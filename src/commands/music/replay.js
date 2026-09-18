import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { view } from "../../music/track.js";
import { escape } from "../../music/panel.js";
import { guarded, requirePlaying, requireSameChannel } from "../../music/guard.js";
import { repaint } from "../../music/repaint.js";

export default {
  type: CommandType.Both,
  name: "replay",
  aliases: ["tekrar", "restart", "basa-sar"],
  description: "Çalan şarkıyı en başa sarar.",
  permission: Permission.Everyone,

  run: guarded([requirePlaying, requireSameChannel], async (ctx, player) => {
    const track = view(player.queue.current);

    if (track.isLive || !track.isSeekable) {
      return ctx.reply(ui.notice("Bu bir canlı yayın olduğu için başa sarılamaz."), {
        ephemeral: true,
      });
    }

    await player.seek(0);
    repaint(ctx.guild.id);

    return ctx.reply(
      ui.notice(
        `${emoji("play")} **${escape(track.title)}** en başa sarıldı.`
      )
    );
  }),
};
