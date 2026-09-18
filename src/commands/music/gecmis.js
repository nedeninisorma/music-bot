import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui, Accent } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { escape } from "../../music/panel.js";
import { formatTime } from "../../music/card.js";
import { getHistory } from "../../music/history.js";
import { enqueue, panelOrNotice } from "../../music/session.js";

export default {
  type: CommandType.Both,
  name: "gecmis",
  aliases: ["history", "son-calinanlar", "recent"],
  description: "Son çalınan şarkıların geçmişini görüntüler veya geçmişten bir şarkıyı tekrar çalar.",
  permission: Permission.Everyone,

  options: [
    {
      name: "liste",
      description: "Son çalınan şarkıları listeler. (List recently played tracks)",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "sayi",
          description: "Listelenecek şarkı sayısı (1-25).",
          type: ApplicationCommandOptionType.Integer,
          required: false,
          min_value: 1,
          max_value: 25,
        },
      ],
    },
    {
      name: "cal",
      description: "Geçmişteki belirli bir şarkıyı tekrar kuyruğa ekler. (Re-play track from history)",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "sira",
          description: "Geçmiş listesindeki şarkı numarası.",
          type: ApplicationCommandOptionType.Integer,
          required: true,
          min_value: 1,
          max_value: 50,
        },
      ],
    },
  ],

  async run(ctx) {
    const action = ctx.options?.getSubcommand(false) ?? ctx.args[0]?.toLowerCase() ?? "liste";

    if (action === "liste" || action === "list" || action === "view") {
      return onList(ctx);
    }
    if (action === "cal" || action === "play" || action === "replay") {
      return onPlay(ctx);
    }

    // Doğrudan sayı girilmişse çalma olarak yorumla: !gecmis 1
    const directNum = parseInt(action, 10);
    if (!Number.isNaN(directNum) && directNum >= 1) {
      return onPlayDirect(ctx, directNum);
    }

    return onList(ctx);
  },
};

async function onList(ctx) {
  const limit = ctx.options?.getInteger("sayi") ?? ctx.options?.getInteger("limit") ?? 15;
  const history = await getHistory(ctx.guild.id, Math.min(25, Math.max(1, limit)));

  if (!history.length) {
    return ctx.reply(
      ui.notice(
        `${emoji("queue")} Bu sunucuda henüz kaydedilmiş bir şarkı geçmişi yok.`,
        "-# Şarkılar çalındıkça geçmiş otomatik olarak kaydedilir."
      ),
      { ephemeral: true }
    );
  }

  const lines = history.map((item, index) => {
    const time = item.duration ? formatTime(Math.round(item.duration / 1000)) : "canlı";
    const author = item.author ? ` — *${escape(item.author)}*` : "";
    return `\`${String(index + 1).padStart(2, " ")}.\` **${escape(item.title)}**${author} \`[${time}]\``;
  });

  return ctx.reply(
    ui.container(
      Accent.primary,
      ui.text(`### ${emoji("history") || emoji("queue")} Son Çalınan Şarkılar (History)`),
      ui.text(`-# Toplam son ${history.length} kayıt listeleniyor. Tekrar çalmak için: \`/gecmis cal sira:<no>\``),
      ui.divider(),
      ui.text(...lines)
    ),
    { ephemeral: true }
  );
}

async function onPlay(ctx) {
  const position = ctx.options?.getInteger("sira") ?? parseInt(ctx.args[1], 10);
  return onPlayDirect(ctx, position);
}

async function onPlayDirect(ctx, position) {
  if (!position || position < 1) {
    return ctx.reply(ui.notice("Lütfen çalmak istediğiniz şarkının geçmiş sıra numarasını belirtin."), {
      ephemeral: true,
    });
  }

  const history = await getHistory(ctx.guild.id, 50);
  const target = history[position - 1];

  if (!target) {
    return ctx.reply(ui.notice(`Geçmişte **${position}** numaralı şarkı bulunamadı.`), {
      ephemeral: true,
    });
  }

  await ctx.defer();

  const query = target.uri || `${target.title} ${target.author || ""}`.trim();
  const added = await enqueue(ctx, query);
  if (added.error) return ctx.reply(ui.notice(added.error));

  return panelOrNotice(ctx, added);
}
