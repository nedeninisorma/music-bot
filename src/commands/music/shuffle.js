import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { guarded, requireSameChannel } from "../../music/guard.js";
import { repaint } from "../../music/repaint.js";

export default {
  type: CommandType.Both,
  name: "shuffle",
  aliases: ["mix", "karistir"],
  description: "Kuyrukta bekleyen tüm şarkıları rastgele karıştırır.",
  permission: Permission.Everyone,

  run: guarded([requireSameChannel], async (ctx, player) => {
    if (!player || player.queue.tracks.length < 2) {
      return ctx.reply(ui.notice("Karıştırmak için kuyrukta en az 2 şarkı olmalı."), { ephemeral: true });
    }

    await player.queue.shuffle();
    repaint(ctx.guild.id);

    return ctx.reply(
      ui.notice(`${emoji("shuffle")} Kuyruktaki **${player.queue.tracks.length} şarkı** karıştırıldı.`)
    );
  }),
};
