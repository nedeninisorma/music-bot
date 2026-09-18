import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { SOURCES } from "../../music/search.js";
import { enqueue, panelOrNotice } from "../../music/session.js";

export default {
  type: CommandType.Both,
  name: "play",
  aliases: ["p"],
  description: "Bir şarkı çalar veya kuyruğa ekler. Bağlantı veya arama kelimesi yazabilirsiniz.",
  permission: Permission.Everyone,

  options: [
    {
      name: "query",
      description: "Şarkı adı, sanatçı veya müzik bağlantısı.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "source",
      description: "Arama yapılacak platform (bağlantı yapıştırdıysanız yok sayılır).",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: Object.entries(SOURCES).map(([value, name]) => ({ name, value })),
    },
    {
      name: "karistir",
      description: "Çalma listesiyse şarkıları rastgele sırayla çal (varsayılan: Evet).",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],

  async run(ctx) {
    const query = ctx.options?.getString("query") ?? ctx.args.join(" ");
    if (!query) {
      return ctx.reply(ui.notice("Lütfen çalmak için bir şarkı adı veya bağlantı belirtin."), {
        ephemeral: true,
      });
    }

    await ctx.defer();

    const shuffle = ctx.options?.getBoolean("karistir") ?? true;
    const added = await enqueue(ctx, query, { source: ctx.options?.getString("source"), shuffle });
    if (added.error) return ctx.reply(ui.notice(added.error));

    return panelOrNotice(ctx, added);
  },
};
