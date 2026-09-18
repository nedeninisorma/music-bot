import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { formatTime } from "../../music/card.js";
import { view } from "../../music/track.js";
import { guarded, requirePlaying, requireSameChannel } from "../../music/guard.js";
import { repaint } from "../../music/repaint.js";

export default {
  type: CommandType.Both,
  name: "seek",
  aliases: ["jump", "goto"],
  description: "Şarkının belirli bir saniyesine veya dakikasına sarar (örn: 1:30, 90, +30 veya -30).",
  permission: Permission.Everyone,

  options: [
    {
      name: "konum",
      description: "Gidilecek konum: örn. 1:30, 90, +30 veya -30.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],

  run: guarded([requirePlaying, requireSameChannel], async (ctx, player) => {
    const asked = ctx.options?.getString("konum") ?? ctx.args[0];
    const track = view(player.queue.current);

    if (track.isLive || !track.isSeekable) {
      return ctx.reply(ui.notice("Bu bir canlı yayın olduğu için ileri/geri sarılamaz."), {
        ephemeral: true,
      });
    }

    const target = resolve(asked, Math.floor(player.position / 1000), track.duration);
    if (target === null) {
      return ctx.reply(ui.notice(`**${asked}** geçerli bir süre formatı değil. \`1:30\`, \`90\` veya \`+30\` şeklinde deneyin.`), {
        ephemeral: true,
      });
    }

    await player.seek(target * 1000);
    repaint(ctx.guild.id);

    return ctx.reply(
      ui.notice(
        `${emoji("play")} Şarkı konumu: **${formatTime(target)}** / ${formatTime(track.duration)}.`
      )
    );
  }),
};

function resolve(input, current, duration) {
  const text = String(input ?? "").trim();
  if (!text) return null;

  const relative = text.match(/^([+-])\s*(.+)$/);
  const seconds = toSeconds(relative ? relative[2] : text);
  if (seconds === null) return null;

  const target = relative
    ? current + (relative[1] === "-" ? -seconds : seconds)
    : seconds;

  return Math.max(0, Math.min(target, Math.max(0, duration - 1)));
}

function toSeconds(text) {
  const parts = text.split(":").map((part) => part.trim());
  if (parts.some((part) => !/^\d+$/.test(part))) return null;

  return parts.reduce((total, part) => total * 60 + Number(part), 0);
}
