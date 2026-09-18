import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui, Accent } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { escape } from "../../music/panel.js";
import { plain } from "../../music/queueView.js";
import { formatTime } from "../../music/card.js";
import { view } from "../../music/track.js";
import { SOURCES, suggestions } from "../../music/search.js";
import { ensurePlayer } from "../../music/session.js";
import { remember } from "../../music/searches.js";

export default {
  type: CommandType.Both,
  name: "search",
  aliases: ["find", "sc", "ara"],
  description: "Şarkı arar ve sonuçlar arasından seçmenizi sağlar.",
  permission: Permission.Everyone,

  options: [
    {
      name: "arama",
      description: "Aranacak şarkı veya sanatçı adı.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "kaynak",
      description: "Arama yapılacak platform.",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: Object.entries(SOURCES).map(([value, name]) => ({ name, value })),
    },
  ],

  async run(ctx) {
    const query = ctx.options?.getString("arama") ?? ctx.options?.getString("query") ?? ctx.args.join(" ");
    if (!query) {
      return ctx.reply(ui.notice("Lütfen aramak için bir şarkı veya sanatçı adı belirtin."), { ephemeral: true });
    }

    await ctx.defer();

    const ready = await ensurePlayer(ctx);
    if (ready.error) return ctx.reply(ui.notice(ready.error));

    const tracks = await suggestions(ready.player, query, ctx.user).catch(() => []);
    if (!tracks.length) return ctx.reply(ui.notice(`**${escape(query)}** için hiçbir sonuç bulunamadı.`));

    const ticket = remember(ctx.guild.id, ctx.user.id, tracks);

    const lines = tracks.map((track, index) => {
      const item = view(track);
      const length = item.isLive ? "canlı" : formatTime(item.duration);
      return `\`${String(index + 1).padStart(2, " ")}.\` **${escape(item.title)}**\n-# ${escape(item.artist)} \`${length}\` — ${item.source}`;
    });

    return ctx.reply(
      ui.container(
        Accent.primary,
        ui.text(`### ${emoji("search")} "${escape(query)}" İçin Arama Sonuçları`),
        ui.divider(),
        ui.text(...lines),
        ui.divider(),
        ui.row(
          ui.select(
            `sr:pick:${ticket}`,
            "Kuyruğa eklenecek şarkıyı seçin...",
            tracks.map((track, index) => {
              const item = view(track);
              return {
                label: plain(item.title, 100),
                value: String(index),
                description: plain(
                  `${item.artist} - ${item.isLive ? "live" : formatTime(item.duration)}`,
                  100
                ),
              };
            }),
            { max: Math.min(tracks.length, 5) }
          )
        )
      )
    );
  },
};
