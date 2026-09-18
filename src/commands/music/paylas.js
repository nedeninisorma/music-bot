import { CommandType, Permission } from "../../core/command.js";
import { ui, Accent } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { escape } from "../../music/panel.js";
import { formatTime } from "../../music/card.js";
import { getPlayer } from "../../music/lavalink.js";

export default {
  type: CommandType.Both,
  name: "paylas",
  aliases: ["share", "np-link", "sarki-paylas"],
  description: "Şu anda çalan şarkının bağlantısını ve detaylarını kanalda paylaşır.",
  permission: Permission.Everyone,

  async run(ctx) {
    const player = getPlayer(ctx.guild.id);
    const current = player?.queue.current;

    if (!current) {
      return ctx.reply(ui.notice("Şu anda çalan bir şarkı bulunmuyor."), { ephemeral: true });
    }

    const info = current.info;
    const duration = info.isStream ? "Canlı Yayın" : formatTime(Math.round((info.duration || 0) / 1000));
    const requester = current.requester?.id ? `<@${current.requester.id}>` : "Bilinmiyor";

    const lines = [
      `### 🎵 [${escape(info.title)}](${info.uri || "https://discord.com"})`,
      `**Sanatçı:** ${escape(info.author || "Bilinmiyor")}`,
      `**Süre:** \`${duration}\` • **Kaynak:** ${info.sourceName || "Müzik"}`,
      `**Ekleyen:** ${requester}`,
    ];

    if (info.uri) {
      lines.push(`\n🔗 **Doğrudan Bağlantı:** [Dinlemek için tıkla](${info.uri})`);
    }

    return ctx.reply(
      ui.container(
        Accent.primary,
        ui.text(`## ${emoji("disc") || "💿"} Çalan Şarkı Paylaşımı`),
        ui.divider(),
        ui.text(...lines)
      )
    );
  },
};
