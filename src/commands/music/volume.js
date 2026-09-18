import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { guarded, requireSameChannel } from "../../music/guard.js";
import { repaint } from "../../music/repaint.js";

export default {
  type: CommandType.Both,
  name: "volume",
  aliases: ["vol", "v", "ses"],
  description: "Ses seviyesini ayarlar (0 - 200 arası).",
  permission: Permission.Everyone,

  options: [
    {
      name: "seviye",
      description: "0 ile 200 arası bir değer. Boş bırakılırsa mevcut ses seviyesini gösterir.",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      min_value: 0,
      max_value: 200,
    },
  ],

  run: guarded([requireSameChannel], async (ctx, player) => {
    if (!player) {
      return ctx.reply(ui.notice("Şu anda çalan bir şey yok."), { ephemeral: true });
    }

    const asked = ctx.options?.getInteger("seviye") ?? ctx.options?.getInteger("level") ?? parseInt(ctx.args[0], 10);

    if (!Number.isFinite(asked)) {
      return ctx.reply(
        ui.notice(`${emoji("volume")} Mevcut ses seviyesi: **%${player.volume}**.`),
        { ephemeral: true }
      );
    }

    const level = Math.max(0, Math.min(200, asked));
    await player.setVolume(level);
    repaint(ctx.guild.id);

    return ctx.reply(
      ui.notice(`${emoji(level === 0 ? "mute" : "volume")} Ses seviyesi **%${level}** olarak ayarlandı.`)
    );
  }),
};
