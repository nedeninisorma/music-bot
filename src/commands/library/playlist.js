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
  listPlaylists,
  getPlaylist,
  savePlaylist,
  addToPlaylist,
  removeFromPlaylist,
  renamePlaylist,
  deletePlaylist,
  restore,
  totalDuration,
} from "../../music/library.js";

const NAME = {
  name: "isim",
  description: "Çalma listesinin adı.",
  type: ApplicationCommandOptionType.String,
  required: true,
};

export default {
  type: CommandType.Both,
  name: "playlist",
  aliases: ["pl", "calma-listesi"],
  description: "Kendi özel çalma listelerinizi kaydedin, yönetin ve dinleyin.",
  permission: Permission.Everyone,

  options: [
    {
      name: "kaydet",
      description: "Kuyruktaki şarkıları yeni bir çalma listesi olarak kaydeder.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [NAME],
    },
    {
      name: "yukle",
      description: "Kayıtlı bir çalma listesini kuyruğa ekler.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        NAME,
        {
          name: "karistir",
          description: "Şarkıları rastgele sırayla çal (varsayılan: Evet).",
          type: ApplicationCommandOptionType.Boolean,
          required: false,
        },
      ],
    },
    {
      name: "liste",
      description: "Çalma listelerinizi veya bir listenin içeriğini görüntüler.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [{ ...NAME, required: false, description: "Tümünü listelemek için boş bırakın." }],
    },
    {
      name: "ekle",
      description: "Çalan şarkıyı bir çalma listesine ekler.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [NAME],
    },
    {
      name: "sil-sarki",
      description: "Çalma listesinden bir şarkıyı kaldırır.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        NAME,
        {
          name: "sira",
          description: "Şarkının listedeki sıra numarası.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
        },
      ],
    },
    {
      name: "yeniden-adlandir",
      description: "Bir çalma listesinin adını değiştirir.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [NAME, { ...NAME, name: "yeni_isim", description: "Yeni isim." }],
    },
    {
      name: "sil",
      description: "Bir çalma listesini kalıcı olarak siler.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [NAME],
    },
  ],

  async run(ctx) {
    const action = ctx.options?.getSubcommand(false) ?? ctx.args[0]?.toLowerCase() ?? "liste";
    const name = ctx.options?.getString("isim") ?? ctx.options?.getString("name") ?? ctx.args.slice(1).join(" ");

    if (action === "liste" || action === "list") return onList(ctx, name);
    if (action === "kaydet" || action === "save") return onSave(ctx, name);
    if (action === "yukle" || action === "load") return onLoad(ctx, name);
    if (action === "ekle" || action === "add") return onAdd(ctx, name);
    if (action === "sil-sarki" || action === "remove") return onRemove(ctx, name);
    if (action === "yeniden-adlandir" || action === "rename") return onRename(ctx, name);
    if (action === "sil" || action === "delete") return onDelete(ctx, name);

    return ctx.reply(
      ui.notice(
        `**${escape(action)}** geçerli bir çalma listesi işlemi değil.`,
        "-# Kullanılabilir işlemler: `kaydet`, `yukle`, `liste`, `ekle`, `sil-sarki`, `yeniden-adlandir`, `sil`."
      ),
      { ephemeral: true }
    );
  },
};

async function onList(ctx, name) {
  if (name) return onShowOne(ctx, name);

  const playlists = await listPlaylists(ctx.user.id);
  if (!playlists.length) {
    return ctx.reply(
      ui.notice(
        `${emoji("playlist")} Henüz bir çalma listeniz yok.`,
        "-# Kuyruğa şarkı ekleyip `/playlist kaydet <isim>` komutuyla kaydedebilirsiniz."
      ),
      { ephemeral: true }
    );
  }

  const lines = playlists.map(
    (playlist) =>
      `${emoji("disc")} **${escape(playlist.name)}**\n-# ${playlist.tracks.length} parça — ${formatLong(totalDuration(playlist.tracks))}`
  );

  return ctx.reply(
    ui.container(
      Accent.primary,
      ui.text(`### ${emoji("playlist")} Çalma Listeleriniz`),
      ui.divider(),
      ui.text(...lines),
      ui.divider(),
      ui.text("-# Birini çalmak için: `/playlist yukle <isim>`")
    ),
    { ephemeral: true }
  );
}

async function onShowOne(ctx, name) {
  const playlist = await getPlaylist(ctx.user.id, name);
  if (!playlist) return missing(ctx, name);

  const lines = playlist.tracks.slice(0, 25).map((track, index) => {
    const length = track.isStream ? "canlı" : formatTime(Math.round((track.duration || 0) / 1000));
    return `\`${String(index + 1).padStart(2, " ")}.\` ${escape(track.title)} — *${escape(track.author)}* \`${length}\``;
  });

  return ctx.reply(
    ui.container(
      Accent.primary,
      ui.text(`### ${emoji("playlist")} ${escape(playlist.name)}`),
      ui.text(`-# ${playlist.tracks.length} parça — ${formatLong(totalDuration(playlist.tracks))}`),
      ui.divider(),
      ui.text(...(lines.length ? lines : ["-# Bu liste boş."])),
      playlist.tracks.length > 25 && ui.text(`-# ve ${playlist.tracks.length - 25} şarkı daha...`)
    ),
    { ephemeral: true }
  );
}

async function onSave(ctx, name) {
  if (!name) return ctx.reply(ui.notice("Lütfen çalma listesi için bir isim belirtin."), { ephemeral: true });

  const player = getPlayer(ctx.guild.id);
  const tracks = [player?.queue.current, ...(player?.queue.tracks ?? [])].filter(Boolean);

  if (!tracks.length) {
    return ctx.reply(ui.notice("Kuyrukta kaydedilecek şarkı bulunmuyor."), { ephemeral: true });
  }

  const { playlist, error } = await savePlaylist(ctx.user.id, name, tracks);
  if (error) return ctx.reply(ui.notice(error), { ephemeral: true });

  return ctx.reply(
    ui.notice(
      `${emoji("playlist")} **${escape(playlist.name)}** kaydedildi — ${playlist.tracks.length} parça.`,
      "-# Çalmak için `/playlist yukle` komutunu kullanabilirsiniz."
    ),
    { ephemeral: true }
  );
}

async function onLoad(ctx, name) {
  if (!name) return ctx.reply(ui.notice("Hangi çalma listesini yüklemek istiyorsunuz?"), { ephemeral: true });

  const playlist = await getPlaylist(ctx.user.id, name);
  if (!playlist) return missing(ctx, name);

  if (!playlist.tracks.length) {
    return ctx.reply(ui.notice(`**${escape(playlist.name)}** çalma listesi boş.`), { ephemeral: true });
  }

  await ctx.defer();

  const ready = await ensurePlayer(ctx);
  if (ready.error) return ctx.reply(ui.notice(ready.error));

  const { player, state } = ready;
  const wasIdle = !player.queue.current;
  const shouldShuffle = ctx.options?.getBoolean("karistir") ?? true;
  let tracks = playlist.tracks.map((track) => restore(track, ctx.user));
  if (shouldShuffle && tracks.length > 1) {
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
    playlist: { name: playlist.name, duration: totalDuration(playlist.tracks) * 1000 },
  });
}

async function onAdd(ctx, name) {
  const player = getPlayer(ctx.guild.id);
  if (!player?.queue.current) {
    return ctx.reply(ui.notice("Şu anda çalan bir şarkı yok."), { ephemeral: true });
  }

  const { playlist, added, error } = await addToPlaylist(ctx.user.id, name, [player.queue.current]);
  if (error) return ctx.reply(ui.notice(error), { ephemeral: true });

  return ctx.reply(
    ui.notice(
      `${emoji("playlist")} **${escape(playlist.name)}** listesine **${added}** şarkı eklendi — toplam ${playlist.tracks.length} parça.`
    ),
    { ephemeral: true }
  );
}

async function onRemove(ctx, name) {
  const asked = ctx.options?.getInteger("sira") ?? ctx.options?.getInteger("position") ?? parseInt(ctx.args[2], 10);
  const index = Number.isFinite(asked) ? asked - 1 : -1;

  const { playlist, removed, error } = await removeFromPlaylist(ctx.user.id, name, index);
  if (error) return ctx.reply(ui.notice(error), { ephemeral: true });

  return ctx.reply(
    ui.notice(
      `${emoji("playlist")} **${escape(removed.title)}** şarkısı **${escape(playlist.name)}** listesinden kaldırıldı.`
    ),
    { ephemeral: true }
  );
}

async function onRename(ctx, name) {
  const next = ctx.options?.getString("yeni_isim") ?? ctx.options?.getString("to") ?? ctx.args[2];
  if (!next) return ctx.reply(ui.notice("Listenin yeni adı ne olsun?"), { ephemeral: true });

  const { playlist, error } = await renamePlaylist(ctx.user.id, name, next);
  if (error) return ctx.reply(ui.notice(error), { ephemeral: true });

  return ctx.reply(ui.notice(`${emoji("playlist")} Çalma listesinin yeni adı: **${escape(playlist.name)}**.`), {
    ephemeral: true,
  });
}

async function onDelete(ctx, name) {
  const { playlist, error } = await deletePlaylist(ctx.user.id, name);
  if (error) return ctx.reply(ui.notice(error), { ephemeral: true });

  return ctx.reply(ui.notice(`${emoji("playlist")} **${escape(playlist.name)}** silindi.`), {
    ephemeral: true,
  });
}

function missing(ctx, name) {
  return ctx.reply(ui.notice(`**${escape(name)}** adında bir çalma listeniz bulunamadı.`), {
    ephemeral: true,
  });
}
