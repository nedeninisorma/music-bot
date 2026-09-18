import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { guarded, requireSameChannel } from "../../music/guard.js";
import { repaint } from "../../music/repaint.js";

const MODES = ["off", "track", "queue"];

const SAID = {
  off: "Döngü modu **kapalı**.",
  track: "Tekrar çalınıyor: **bu şarkı**.",
  queue: "Tekrar çalınıyor: **tüm kuyruk**.",
};

export default {
  type: CommandType.Both,
  name: "loop",
  aliases: ["repeat", "l", "dongu", "tekrar"],
  description: "Şarkı veya kuyruk tekrarlama (döngü) modunu ayarlar.",
  permission: Permission.Everyone,

  options: [
    {
      name: "mod",
      description: "Döngü modu. Boş bırakılırsa sıradaki moda geçer.",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: [
        { name: "Kapalı", value: "off" },
        { name: "Çalan Şarkı", value: "track" },
        { name: "Tüm Kuyruk", value: "queue" },
      ],
    },
  ],

  run: guarded([requireSameChannel], async (ctx, player) => {
    if (!player) {
      return ctx.reply(ui.notice("Şu anda çalan bir şey yok."), { ephemeral: true });
    }

    const asked = (ctx.options?.getString("mod") ?? ctx.options?.getString("mode") ?? ctx.args[0])?.toLowerCase();
    const mode = MODES.includes(asked)
      ? asked
      : MODES[(MODES.indexOf(player.repeatMode) + 1) % MODES.length];

    await player.setRepeatMode(mode);
    repaint(ctx.guild.id);

    return ctx.reply(ui.notice(`${emoji("loop")} ${SAID[mode]}`));
  }),
};
