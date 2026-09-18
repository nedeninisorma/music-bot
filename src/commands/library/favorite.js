import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui, Accent } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { escape } from "../../music/panel.js";
import { formatTime, formatLong } from "../../music/card.js";
import { getPlayer } from "../../music/lavalink.js";
import { ensurePlayer, panelOrNotice } from "../../music/session.js";
import { shuffleArray } from "../../core/utils/flow.js";
import {
  listFavorites,
  addFavorite,
  removeFavorite,
  restore,
  totalDuration,
} from "../../music/library.js";

export default {
  type: CommandType.Both,
  name: "favorite",
  aliases: ["fav", "f", "favori"],
  description: "Beğendiğiniz şarkıları favorilere kaydeder ve dilediğinizde çalar.",
  permission: Permission.Everyone,

  options: [
    {
      name: "ekle",
      description: "Çalan şarkıyı favorilerinize kaydeder.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "liste",
      description: "Favorilerinizi listeler.",
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: "cal",
      description: "Favorilerinizdeki şarkıları kuyruğa ekler.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "sira",
          description: "Çalınacak şarkının numarası. Tümünü çalmak için boş bırakın.",
          type: ApplicationCommandOptionType.Integer,
          required: false,
          min_value: 1,
        },
        {
          name: "karistir",
          description: "Şarkıları rastgele sırayla çal (varsayılan: Evet).",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    },
    {
      name: "sil",
      description: "Favorilerinizden bir şarkıyı kaldırır.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "sira",
          description: "Favorilerdeki sıra numarası.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
        },
      ],
    },
  ],

  async run(ctx) {
    const action = ctx.options?.getSubcommand(false) ?? ctx.args[0]?.toLowerCase() ?? "liste";

    if (action === "ekle" || action === "add") return onAdd(ctx);
    if (action === "liste" || action === "list") return onList(ctx);
    if (action === "cal" || action === "play") return onPlay(ctx);
    if (action === "sil" || action === "remove") return onRemove(ctx);

    return ctx.reply(
      ui.notice(
        `**${escape(action)}** geçerli bir favori işlemi değil.`,
        "-# Kullanılabilir işlemler: `ekle`, `liste`, `cal`, `sil`."
      ),
      { ephemeral: true }
    );
  },
};

async function onAdd(ctx) {
  const player = getPlayer(ctx.guild.id);
  if (!player?.queue.current) {
    return ctx.reply(ui.notice("Şu anda çalan bir şarkı yok."), { ephemeral: true });
  }

  const { track, count, error } = await addFavorite(ctx.user.id, player.queue.current);
  if (error) return ctx.reply(ui.notice(error), { ephemeral: true });

  return ctx.reply(
    ui.notice(
      `${emoji("heart")} **${escape(track.title)}** — *${escape(track.author)}* favorilerinize eklendi.`,
      `-# Toplam ${count} favori şarkınız var. \`/favorite cal\` ile dinleyebilirsiniz.`
    ),
    { ephemeral: true }
  );
}

async function onList(ctx) {
  const favorites = await listFavorites(ctx.user.id);
  if (!favorites.length) {
    return ctx.reply(
      ui.notice(
        `${emoji("heart")} Henüz favori şarkınız yok.`,
        "-# Paneldeki **Favori** butonuna basarak veya `/favorite ekle` ile ekleyebilirsiniz."
      ),
      { ephemeral: true }
    );
  }

  const lines = favorites.slice(0, 25).map((track, index) => {
    const length = track.isStream ? "canlı" : formatTime(Math.round((track.duration || 0) / 1000));
    return `\`${String(index + 1).padStart(2, " ")}.\` ${escape(track.title)} — *${escape(track.author)}* \`${length}\``;
  });

  return ctx.reply(
    ui.container(
      Accent.primary,
      ui.text(`### ${emoji("heart")} Favori Şarkılarınız`),
      ui.text(`-# Toplam ${favorites.length} parça — ${formatLong(totalDuration(favorites))}`),
      ui.divider(),
      ui.text(...lines),
      favorites.length > 25 && ui.text(`-# ve ${favorites.length - 25} şarkı daha...`),
      ui.divider(),
      ui.text("-# Hepsini kuyruğa eklemek için: `/favorite cal`")
    ),
    { ephemeral: true }
  );
}

async function onPlay(ctx) {
  const favorites = await listFavorites(ctx.user.id);
  if (!favorites.length) {
    return ctx.reply(ui.notice("Çalınacak favori şarkınız bulunmuyor."), { ephemeral: true });
  }

  const asked = ctx.options?.getInteger("sira") ?? ctx.options?.getInteger("position") ?? parseInt(ctx.args[1], 10);
  const picked = Number.isFinite(asked) ? [favorites[asked - 1]].filter(Boolean) : favorites;

  if (!picked.length) {
    return ctx.reply(ui.notice(`**${asked}** numaralı sırada favori şarkı bulunamadı.`), {
      ephemeral: true,
    });
  }

  await ctx.defer();

  const ready = await ensurePlayer(ctx);
  if (ready.error) return ctx.reply(ui.notice(ready.error));

  const { player, state } = ready;
  const wasIdle = !player.queue.current;
  const shouldShuffle = ctx.options?.getBoolean("karistir") ?? true;
  let tracks = picked.map((track) => restore(track, ctx.user));
  if (!Number.isFinite(asked) && shouldShuffle && tracks.length > 1) {
    tracks = shuffleArray(tracks);
  }

  await player.queue.add(tracks);
  if (wasIdle) await player.play();

  return panelOrNotice(ctx, {
    player,
    state,
    tracks,
    wasIdle,
    shuffled: shouldShuffle,
    playlist:
      tracks.length > 1
        ? { name: "Favorileriniz", duration: totalDuration(picked) * 1000 }
        : null,
  });
}

async function onRemove(ctx) {
  const asked = ctx.options?.getInteger("sira") ?? ctx.options?.getInteger("position") ?? parseInt(ctx.args[1], 10);
  const index = Number.isFinite(asked) ? asked - 1 : -1;

  const { track, count, error } = await removeFavorite(ctx.user.id, index);
  if (error) return ctx.reply(ui.notice(error), { ephemeral: true });

  return ctx.reply(
    ui.notice(
      `${emoji("heart")} **${escape(track.title)}** favorilerinizden kaldırıldı.`,
      `-# Kalan favori şarkı sayısı: ${count}.`
    ),
    { ephemeral: true }
  );
}
