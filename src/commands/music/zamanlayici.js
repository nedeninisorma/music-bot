import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { getPlayer } from "../../music/lavalink.js";
import { setSleepTimer, cancelSleepTimer, getSleepTimer } from "../../music/sleepTimer.js";

export default {
  type: CommandType.Both,
  name: "zamanlayici",
  aliases: ["sleeptimer", "sleep", "uyku", "timer"],
  description: "Belirli bir süre veya şarkı sayısı sonra botun çalmayı durdurmasını sağlar.",
  permission: Permission.Everyone,

  options: [
    {
      name: "dakika",
      description: "Kaç dakika sonra durdurulsun? (Minutes until stop)",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      min_value: 1,
      max_value: 1440,
    },
    {
      name: "sarki",
      description: "Kaç şarkı sonra durdurulsun? (Tracks until stop)",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      min_value: 1,
      max_value: 100,
    },
    {
      name: "iptal",
      description: "Aktif zamanlayıcıyı iptal et (Cancel sleep timer)",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],

  async run(ctx) {
    const cancel = ctx.options?.getBoolean("iptal") ?? (ctx.args[0]?.toLowerCase() === "iptal" || ctx.args[0]?.toLowerCase() === "cancel");
    if (cancel) {
      const stopped = cancelSleepTimer(ctx.guild.id);
      if (stopped) {
        return ctx.reply(ui.notice(`${emoji("stop") || "⏹️"} Uyku zamanlayıcısı iptal edildi.`));
      }
      return ctx.reply(ui.notice("Aktif bir uyku zamanlayıcısı bulunmuyor."), { ephemeral: true });
    }

    const minutes = ctx.options?.getInteger("dakika") ?? ctx.options?.getInteger("minutes");
    const tracks = ctx.options?.getInteger("sarki") ?? ctx.options?.getInteger("tracks");

    // Prefix komutları için basit argüman ayrıştırma: !zamanlayici 30dk veya !zamanlayici 30m veya !zamanlayici 3sarki
    let parsedMinutes = minutes;
    let parsedTracks = tracks;

    if (!parsedMinutes && !parsedTracks && ctx.args[0]) {
      const arg = ctx.args[0].toLowerCase();
      if (arg.endsWith("dk") || arg.endsWith("m")) {
        parsedMinutes = parseInt(arg, 10);
      } else if (arg.endsWith("sarki") || arg.endsWith("t") || arg.endsWith("track")) {
        parsedTracks = parseInt(arg, 10);
      } else {
        const num = parseInt(arg, 10);
        if (!Number.isNaN(num)) parsedMinutes = num;
      }
    }

    // Hiçbir parametre verilmemişse mevcut durumu göster
    if (!parsedMinutes && !parsedTracks) {
      const current = getSleepTimer(ctx.guild.id);
      if (!current) {
        return ctx.reply(
          ui.notice(
            "Aktif bir uyku zamanlayıcısı ayarlı değil.",
            "-# Örnek kullanım: `/zamanlayici dakika:30` veya `/zamanlayici sarki:5`"
          ),
          { ephemeral: true }
        );
      }

      const parts = [];
      if (current.remainingMinutes !== null) parts.push(`**${current.remainingMinutes} dakika**`);
      if (current.remainingTracks !== null) parts.push(`**${current.remainingTracks} şarkı**`);

      return ctx.reply(
        ui.notice(
          `⏰ Aktif uyku zamanlayıcısı: ${parts.join(" veya ")} sonra bot duracak.`,
          "-# İptal etmek için: `/zamanlayici iptal:True`"
        )
      );
    }

    const player = getPlayer(ctx.guild.id);
    if (!player) {
      return ctx.reply(ui.notice("Şu anda çalan bir oynatıcı bulunmuyor."), { ephemeral: true });
    }

    setSleepTimer(
      ctx.guild.id,
      { minutes: parsedMinutes, tracks: parsedTracks },
      async () => {
        const activePlayer = getPlayer(ctx.guild.id);
        if (activePlayer) {
          await activePlayer.destroy();
          ctx.channel?.send(
            ui.notice("⏰ **Uyku zamanlayıcısı doldu.** Müzik durduruldu ve kanaldan ayrıldım.")
          ).catch(() => {});
        }
      }
    );

    const descParts = [];
    if (parsedMinutes) descParts.push(`**${parsedMinutes} dakika**`);
    if (parsedTracks) descParts.push(`**${parsedTracks} şarkı**`);

    return ctx.reply(
      ui.notice(
        `⏰ Uyku zamanlayıcısı kuruldu: ${descParts.join(" veya ")} sonra oynatma sonlandırılacak.`,
        "-# İptal etmek için: `/zamanlayici iptal:True`"
      )
    );
  },
};
