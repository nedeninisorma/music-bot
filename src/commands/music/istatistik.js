import { CommandType, Permission } from "../../core/command.js";
import { ui, Accent } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { escape } from "../../music/panel.js";
import { formatLong } from "../../music/card.js";
import { getGuildStats } from "../../music/stats.js";

export default {
  type: CommandType.Both,
  name: "istatistik",
  aliases: ["stats", "statistics", "istatistikler"],
  description: "Sunucunun müzik dinleme istatistiklerini ve en çok çalınan parçalarını görüntüler.",
  permission: Permission.Everyone,

  async run(ctx) {
    await ctx.defer();

    const stats = await getGuildStats(ctx.guild.id);

    if (!stats.plays) {
      return ctx.reply(
        ui.notice(
          `${emoji("disc")} Bu sunucuda henüz kaydedilmiş müzik istatistiği yok.`,
          "-# Şarkı dinledikçe istatistikler otomatik olarak toplanacaktır."
        )
      );
    }

    const totalSeconds = Math.round((stats.duration || 0) / 1000);
    const durationText = totalSeconds > 0 ? formatLong(totalSeconds) : "0 sn";

    const trackLines = stats.topTracks.length
      ? stats.topTracks.map((t, idx) => {
          const author = t.author ? ` — *${escape(t.author)}*` : "";
          return `\`${idx + 1}.\` **${escape(t.title)}**${author} \`(${t.count} kez)\``;
        })
      : ["-# Henüz parça verisi kaydedilmedi."];

    const userLines = stats.topUsers.length
      ? stats.topUsers.map((u, idx) => {
          const uSec = Math.round((u.duration || 0) / 1000);
          const uTime = uSec > 0 ? ` [${formatLong(uSec)}]` : "";
          return `\`${idx + 1}.\` <@${u.id}> — **${u.count}** şarkı${uTime}`;
        })
      : ["-# Henüz kullanıcı verisi kaydedilmedi."];

    return ctx.reply(
      ui.container(
        Accent.primary,
        ui.text(`### 📊 Sunucu Müzik İstatistikleri (Music Stats)`),
        ui.text(`Toplam Çalma: **${stats.plays}** parça • Toplam Dinleme: **${durationText}**`),
        ui.divider(),
        ui.text(`#### ${emoji("fire") || "🔥"} En Çok Çalınan Parçalar`),
        ui.text(...trackLines),
        ui.divider(),
        ui.text(`#### ${emoji("dj") || "🎧"} En Aktif Dinleyiciler`),
        ui.text(...userLines)
      )
    );
  },
};
