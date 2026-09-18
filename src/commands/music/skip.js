import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { escape } from "../../music/panel.js";
import { view } from "../../music/track.js";
import { guarded, requirePlaying, requireSameChannel } from "../../music/guard.js";
import { repaint } from "../../music/repaint.js";
import { requireVote, clearVotes } from "../../music/vote.js";

export default {
  type: CommandType.Both,
  name: "skip",
  aliases: ["s", "next"],
  description: "Çalan şarkıyı veya birden fazla şarkıyı atlar.",
  permission: Permission.Everyone,

  options: [
    {
      name: "sayi",
      description: "Kaç şarkı atlanacak (varsayılan: 1).",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      min_value: 1,
    },
  ],

  run: guarded([requirePlaying, requireSameChannel], async (ctx, player) => {
    const asked = ctx.options?.getInteger("sayi") ?? parseInt(ctx.args[0], 10);
    const count = Number.isFinite(asked) ? Math.max(1, asked) : 1;

    if (count > player.queue.tracks.length) {
      return ctx.reply(
        ui.notice(
          player.queue.tracks.length
            ? `Sırada sadece ${player.queue.tracks.length} şarkı bekliyor.`
            : "Bu şarkıdan sonra sırada başka şarkı yok. Oynatmayı bitirmek için `/stop` kullanabilirsin."
        ),
        { ephemeral: true }
      );
    }

    const pending = requireVote(ctx, ctx.client, player, "skip");
    if (pending) {
      return ctx.reply(ui.notice(`${emoji("skip")} ${pending}`));
    }

    const skipped = view(player.queue.current);
    await player.skip(count);
    clearVotes(ctx.guild.id);

    repaint(ctx.guild.id);

    return ctx.reply(
      ui.notice(
        count > 1
          ? `${emoji("skip")} **${count} şarkı** atlandı.`
          : `${emoji("skip")} **${escape(skipped.title)}** atlandı.`
      )
    );
  }),
};
