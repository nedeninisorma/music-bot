import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { escape } from "../../music/panel.js";
import { getPlayer } from "../../music/lavalink.js";
import { savePlaylist } from "../../music/library.js";

export default {
  type: CommandType.Both,
  name: "kuyruk-kaydet",
  aliases: ["save-queue", "savequeue", "sq"],
  description: "Şu anki müzik kuyruğunu özel bir çalma listesi olarak kaydeder.",
  permission: Permission.Everyone,

  options: [
    {
      name: "isim",
      description: "Çalma listesi adı (Playlist name)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  async run(ctx) {
    const name = ctx.options?.getString("isim") ?? ctx.options?.getString("name") ?? ctx.args.join(" ");

    if (!name) {
      return ctx.reply(ui.notice("Lütfen çalma listesi için bir isim belirtin."), {
        ephemeral: true,
      });
    }

    const player = getPlayer(ctx.guild.id);
    const tracks = [player?.queue.current, ...(player?.queue.tracks ?? [])].filter(Boolean);

    if (!tracks.length) {
      return ctx.reply(ui.notice("Şu anda kuyrukta kaydedilecek herhangi bir şarkı bulunmuyor."), {
        ephemeral: true,
      });
    }

    const { playlist, error } = await savePlaylist(ctx.user.id, name, tracks);
    if (error) return ctx.reply(ui.notice(error), { ephemeral: true });

    return ctx.reply(
      ui.notice(
        `${emoji("playlist")} **${escape(playlist.name)}** başarıyla kaydedildi! (${playlist.tracks.length} parça)`,
        "-# İstediğiniz zaman `/playlist yukle isim:" + escape(playlist.name) + "` komutuyla çalabilirsiniz."
      )
    );
  },
};
