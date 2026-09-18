import { ui, payload } from "../core/ui.js";
import { withLock, shuffleArray } from "../core/utils/flow.js";
import { ackUpdate, answer } from "../core/utils/respond.js";
import { getPlayer } from "../music/lavalink.js";
import { getState } from "../music/state.js";
import { panelWith, drawCard, volumeModal, addModal, escape } from "../music/panel.js";
import { renderQueuePage } from "../music/queueView.js";
import { repaint, unwatch, movePanel } from "../music/repaint.js";
import { find } from "../music/search.js";
import { queuedNotice } from "../music/session.js";
import { FILTERS, applyFilter, activeFilters } from "../music/filters.js";
import { addFavorite } from "../music/library.js";
import { view } from "../music/track.js";
import { requireVote, clearVotes } from "../music/vote.js";
import { emoji } from "../music/emojis.js";

const INSTANT = new Set(["pause", "resume", "shuffle", "loop", "autoplay"]);

export default {
  id: "mp",

  async run(interaction, { parts }) {
    const action = parts[1];

    if (action === "queue") return onQueueView(interaction);
    if (action === "favorite") return onFavorite(interaction);
    if (action === "filter") return onFilterMenu(interaction);
    if (action === "fx") return onFilterPick(interaction);
    if (action === "volume") {
      return openModal(interaction, volumeModal(getPlayer(interaction.guild.id)?.volume ?? 100));
    }
    if (action === "add") return openModal(interaction, addModal());
    if (action === "m") return onModal(interaction, parts[2]);

    if (!(await ackUpdate(interaction))) return;

    if (INSTANT.has(action)) return handle(interaction, action);
    return withLock(`music:${interaction.guild.id}`, () => handle(interaction, action));
  },
};

async function handle(interaction, action) {
  const guildId = interaction.guild.id;
  const player = getPlayer(guildId);

  if (!player) {
    return answer(interaction, payload(ui.notice("Oturum sonlandı."), { ephemeral: true }));
  }

  const listening = interaction.member?.voice?.channelId;
  if (player.voiceChannelId && listening !== player.voiceChannelId) {
    return answer(
      interaction,
      payload(ui.notice(`Kontrolleri kullanmak için <#${player.voiceChannelId}> kanalına katılmalısın.`), {
        ephemeral: true,
      })
    );
  }

  if (action === "skip" || action === "stop") {
    const pending = requireVote(
      { guild: interaction.guild, user: interaction.user, member: interaction.member },
      interaction.client,
      player,
      action
    );

    if (pending) {
      return answer(
        interaction,
        payload(ui.notice(`${emoji(action)} ${pending}`), { ephemeral: true })
      );
    }
  }

  switch (action) {
    case "pause":
      if (!player.paused) await player.pause();
      break;

    case "resume":
      if (player.paused) await player.resume();
      else if (!player.playing && player.queue.tracks.length) await player.play();
      break;

    case "skip":
      if (player.queue.tracks.length) await player.skip();
      else await player.stopPlaying(true, false);
      clearVotes(guildId);
      break;

    case "previous": {
      const earlier = player.queue.previous[0];
      if (player.position > 5_000 || !earlier) {
        await player.seek(0);
      } else {
        await player.queue.add(earlier, 0);
        await player.skip();
      }
      break;
    }

    case "shuffle":
      await player.queue.shuffle();
      break;

    case "loop":
      await player.setRepeatMode(nextMode(player.repeatMode));
      break;

    case "autoplay": {
      const state = getState(guildId);
      state.autoplay = !state.autoplay;
      break;
    }

    case "stop":
      await player.destroy("Oynatma panel üzerinden durduruldu.");
      unwatch(guildId);
      clearVotes(guildId);
      break;

    default:
      return;
  }

  const after = getPlayer(guildId);
  await answer(interaction, { ...panelWith(after, null), attachments: [] });

  if (!after?.queue.current) return;

  setImmediate(() => {
    drawCard(after)
      .then((card) => answer(interaction, { ...panelWith(after, card), attachments: [] }))
      .catch((error) => console.error("Attaching the card failed:", error.message));
  });
}

function nextMode(mode) {
  const modes = ["off", "track", "queue"];
  return modes[(modes.indexOf(mode) + 1) % modes.length];
}

async function onQueueView(interaction) {
  if (!(await ackUpdate(interaction))) return;
  return answer(
    interaction,
    payload(renderQueuePage(getPlayer(interaction.guild.id), 0), { ephemeral: true })
  );
}

async function onFavorite(interaction) {
  const player = getPlayer(interaction.guild.id);
  if (!player?.queue.current) {
    return answer(
      interaction,
      payload(ui.notice("Şu anda çalan bir şarkı yok."), { ephemeral: true })
    );
  }

  const { track, count, error } = await addFavorite(interaction.user.id, player.queue.current);

  return answer(
    interaction,
    payload(
      error
        ? ui.notice(error)
        : ui.notice(
            `${emoji("heart")} **${escape(track.title)}** favorilerinize kaydedildi.`,
            `-# Toplam ${count} favori. \`/favorite cal\` ile dinleyebilirsiniz.`
          ),
      { ephemeral: true }
    )
  );
}

async function onFilterMenu(interaction) {
  const player = getPlayer(interaction.guild.id);
  if (!player?.queue.current) {
    return answer(
      interaction,
      payload(ui.notice("Şu anda çalan bir şarkı yok."), { ephemeral: true })
    );
  }

  const active = activeFilters(player);

  return answer(
    interaction,
    payload(
      ui.container(
        ui.text(`### ${emoji("filter")} Filtreler`),
        ui.text(active.length ? `-# Aktif: **${active.join(", ")}**` : "-# Şu anda aktif filtre yok."),
        ui.divider(),
        ui.row(
          ui.select(
            "mp:fx",
            "Bir filtre seçin...",
            Object.entries(FILTERS).map(([value, filter]) => ({
              label: filter.label,
              value,
              description: filter.description.slice(0, 100),
            }))
          )
        )
      ),
      { ephemeral: true }
    )
  );
}

async function onFilterPick(interaction) {
  if (!(await ackUpdate(interaction))) return;

  const player = getPlayer(interaction.guild.id);
  if (!player) {
    return answer(interaction, payload(ui.notice("Oturum sonlandı."), { ephemeral: true }));
  }

  const picked = interaction.values?.[0];
  const applied = await applyFilter(player, picked).catch(() => null);

  repaint(interaction.guild.id);

  return answer(interaction, {
    ...payload(
      ui.notice(
        applied
          ? picked === "clear"
            ? `${emoji("filter")} Filtreler sıfırlandı.`
            : `${emoji("filter")} **${applied.label}** — ${applied.description}`
          : "Filtre uygulanamadı. Başka bir filtre deneyin.",
        "-# Filtrenin oturması 1-2 saniye sürebilir."
      )
    ),
    components: undefined,
  });
}

async function openModal(interaction, modal) {
  try {
    await interaction.showModal(modal);
  } catch (error) {
    console.error("Opening a panel modal failed:", error.message);
  }
}

function onModal(interaction, which) {
  if (which === "volume") return onVolumeSubmit(interaction);
  if (which === "add") return onAddSubmit(interaction);
  return ackUpdate(interaction);
}

async function onVolumeSubmit(interaction) {
  const typed = interaction.fields.getTextInputValue("volume").trim();
  const value = parseInt(typed, 10);

  if (Number.isNaN(value)) {
    return answer(
      interaction,
      payload(ui.notice(`**${escape(typed)}** geçerli bir sayı değil. 0 ile 200 arasında bir değer girin.`), {
        ephemeral: true,
      })
    );
  }

  if (!(await ackUpdate(interaction))) return;

  const player = getPlayer(interaction.guild.id);
  if (!player) return;

  await player.setVolume(Math.max(0, Math.min(200, value)));
  return answer(interaction, { ...panelWith(player, null), attachments: [] });
}

async function onAddSubmit(interaction) {
  const query = interaction.fields.getTextInputValue("query").trim();
  if (!query) return ackUpdate(interaction);

  if (!(await ackUpdate(interaction))) return;

  const guildId = interaction.guild.id;
  const player = getPlayer(guildId);

  if (!player) {
    return answer(
      interaction,
      payload(ui.notice("Oturum sona erdi. `/play` ile yeni bir oturum başlatabilirsiniz."), {
        ephemeral: true,
      })
    );
  }

  await answer(interaction, { ...panelWith(player, null, { busy: true }), attachments: [] });

  let result;
  try {
    result = await find(player, query, interaction.user);
  } catch (error) {
    console.error("Adding from the panel failed:", error.message);
    result = { tracks: [] };
  }

  if (!result.tracks.length) {
    await answer(interaction, { ...panelWith(player, null), attachments: [] });
    return interaction
      .followUp(payload(ui.notice(`**${escape(query)}** için hiçbir sonuç bulunamadı.`), { ephemeral: true }))
      .catch(() => {});
  }

  const tracks = result.playlist ? shuffleArray([...result.tracks]) : [result.tracks[0]];
  const wasIdle = !player.queue.current;

  await player.queue.add(tracks);
  if (wasIdle) await player.play();

  await answer(interaction, { ...panelWith(player, null), attachments: [] });

  if (wasIdle) {
    setImmediate(() => {
      drawCard(player)
        .then((card) => answer(interaction, { ...panelWith(player, card), attachments: [] }))
        .catch(() => {});
    });
    return;
  }

  const added = view(tracks[0]);
  const channel = interaction.channel;

  await channel
    ?.send(
      payload(
        result.playlist
          ? queuedNotice(tracks, result.playlist, player, { shuffled: true })
          : ui.notice(
              `${emoji("queue")} <@${interaction.user.id}> kuyruğa ekledi: **${escape(added.title)}** — *${escape(added.artist)}*`
            )
      )
    )
    .catch(() => {});

  const state = getState(guildId);
  const previous = interaction.message?.id ?? state.messageId;

  const moved = channel
    ? await movePanel(player, state, (view) => channel.send(view)).catch(() => null)
    : null;

  if (moved && previous && previous !== moved.id) {
    await channel.messages
      .fetch(previous)
      .then((old) => old.delete())
      .catch(() => {});
  }
}
