import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { FILTERS, applyFilter, activeFilters } from "../../music/filters.js";
import { guarded, requirePlaying, requireSameChannel } from "../../music/guard.js";
import { repaint } from "../../music/repaint.js";

export default {
  type: CommandType.Both,
  name: "filter",
  aliases: ["fx", "effect", "filtre"],
  description: "Ses efektleri uygular: bass boost, nightcore, 8D ve daha fazlası.",
  permission: Permission.Everyone,

  options: [
    {
      name: "filtre",
      description: "Uygulanacak filtre. Aktif filtreleri görmek için boş bırakın.",
      type: ApplicationCommandOptionType.String,
      required: false,
      choices: Object.entries(FILTERS)
        .slice(0, 25)
        .map(([value, filter]) => ({ name: filter.label, value })),
    },
  ],

  run: guarded([requirePlaying, requireSameChannel], async (ctx, player) => {
    const asked = (ctx.options?.getString("filtre") ?? ctx.options?.getString("name") ?? ctx.args[0])?.toLowerCase();

    if (!asked) {
      const active = activeFilters(player);
      return ctx.reply(
        ui.notice(
          active.length
            ? `${emoji("filter")} Aktif filtreler: **${active.join(", ")}**`
            : `${emoji("filter")} Şu anda aktif bir filtre yok.`,
          `-# Seçenekler: ${Object.keys(FILTERS).join(", ")}`
        ),
        { ephemeral: true }
      );
    }

    if (!FILTERS[asked]) {
      return ctx.reply(
        ui.notice(
          `**${asked}** geçerli bir filtre değil.`,
          `-# Seçenekler: ${Object.keys(FILTERS).join(", ")}`
        ),
        { ephemeral: true }
      );
    }

    await ctx.defer();

    const applied = await applyFilter(player, asked);
    repaint(ctx.guild.id);

    return ctx.reply(
      ui.notice(
        asked === "clear"
          ? `${emoji("filter")} Tüm filtreler kaldırıldı ve ses sıfırlandı.`
          : `${emoji("filter")} **${applied.label}** — ${applied.description}`,
        "-# Filtrenin oturması 1-2 saniye sürebilir."
      )
    );
  }),
};
