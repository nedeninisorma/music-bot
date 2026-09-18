import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { getState } from "../../music/state.js";
import { guarded, requireSameChannel } from "../../music/guard.js";
import { repaint } from "../../music/repaint.js";

export default {
  type: CommandType.Both,
  name: "autoplay",
  aliases: ["ap", "otomatik"],
  description: "Kuyruk bittiğinde benzer şarkıları otomatik olarak çalmaya devam eder.",
  permission: Permission.Everyone,

  run: guarded([requireSameChannel], async (ctx) => {
    const state = getState(ctx.guild.id);
    state.autoplay = !state.autoplay;

    repaint(ctx.guild.id);

    return ctx.reply(
      ui.notice(
        state.autoplay
          ? `${emoji("autoplay")} Otomatik oynatma **açık** — kuyruk bitince benzer şarkılar çalmaya devam edecek.`
          : `${emoji("autoplay")} Otomatik oynatma **kapalı** — kuyruk bittiğinde oynatma duracak.`
      )
    );
  }),
};
