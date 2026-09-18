import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { getPlayer } from "../../music/lavalink.js";
import { renderQueuePage } from "../../music/queueView.js";

export default {
  type: CommandType.Both,
  name: "queue",
  aliases: ["q", "list", "kuyruk", "liste"],
  description: "Sırada bekleyen şarkıların listesini gösterir.",
  permission: Permission.Everyone,

  options: [
    {
      name: "sayfa",
      description: "Görüntülenecek sayfa numarası.",
      type: ApplicationCommandOptionType.Integer,
      required: false,
      min_value: 1,
    },
  ],

  run(ctx) {
    const asked = ctx.options?.getInteger("sayfa") ?? ctx.options?.getInteger("page") ?? parseInt(ctx.args[0], 10);
    const page = Number.isFinite(asked) ? asked - 1 : 0;

    return ctx.reply(renderQueuePage(getPlayer(ctx.guild.id), page), { ephemeral: true });
  },
};
