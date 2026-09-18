import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui, Accent } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { escape } from "../../music/panel.js";
import { formatTime } from "../../music/card.js";
import { view } from "../../music/track.js";
import { ensurePlayer, enqueue, panelOrNotice } from "../../music/session.js";
import { find } from "../../music/search.js";
import { getPoll, createPoll, cancelPoll } from "../../music/polls.js";

export function renderPollContainer(poll) {
  const lines = poll.candidates.map((c, idx) => {
    const votes = c.voters.size;
    const bar = "█".repeat(votes) + "░".repeat(Math.max(0, 10 - votes));
    return `**${idx + 1}.** [${escape(c.title)}](${c.uri || "https://discord.com"})\n-# ${escape(c.author)} • **${votes} Oy** \`[${bar}]\``;
  });

  const remainingMinutes = Math.max(0, Math.ceil((poll.endsAt - Date.now()) / 60_000));

  const buttons = poll.candidates.map((c, idx) =>
    ui.button(`pv:vote:${idx}`, `${idx + 1}. Şarkıya Oy Ver (${c.voters.size})`, "primary")
  );

  return ui.container(
    Accent.primary,
    ui.text(`### 🗳️ Müzik Oylaması (Song Poll)`),
    ui.text(`-# En çok oy alan parça çalınacak! Kalan süre: ~**${remainingMinutes} dakika**`),
    ui.divider(),
    ui.text(...lines),
    ui.divider(),
    ui.row(...buttons.slice(0, 5))
  );
}

export default {
  type: CommandType.Both,
  name: "oylama",
  aliases: ["poll", "vote", "sarki-oylama"],
  description: "Şarkılar arasında oylama başlatır ve kazanan parçayı çalar.",
  permission: Permission.Everyone,

  options: [
    {
      name: "baslat",
      description: "Yeni bir şarkı oylaması başlatır.",
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: "sarki1",
          description: "1. Şarkı adı veya bağlantısı",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "sarki2",
          description: "2. Şarkı adı veya bağlantısı",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "sarki3",
          description: "3. Şarkı adı veya bağlantısı (isteğe bağlı)",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "sure",
          description: "Oylama süresi (dakika, varsayılan: 2)",
          type: ApplicationCommandOptionType.Integer,
          required: false,
          min_value: 1,
          max_value: 15,
        },
      ],
    },
    {
      name: "bitir",
      description: "Mevcut oylamayı erken bitirir ve kazanan şarkıyı çalar.",
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],

  async run(ctx) {
    const action = ctx.options?.getSubcommand(false) ?? ctx.args[0]?.toLowerCase() ?? "baslat";

    if (action === "bitir" || action === "end") {
      return onEnd(ctx);
    }

    return onStart(ctx);
  },
};

async function onStart(ctx) {
  const ready = await ensurePlayer(ctx);
  if (ready.error) return ctx.reply(ui.notice(ready.error));
  const { player } = ready;

  const s1 = ctx.options?.getString("sarki1") ?? ctx.args[0];
  const s2 = ctx.options?.getString("sarki2") ?? ctx.args[1];
  const s3 = ctx.options?.getString("sarki3") ?? ctx.args[2];
  const minutes = ctx.options?.getInteger("sure") ?? 2;

  if (!s1 || !s2) {
    return ctx.reply(
      ui.notice(
        "Oylama başlatmak için en az **2 şarkı** belirtmelisiniz.",
        "-# Örnek: `/oylama baslat sarki1:Tarkan Şımarık sarki2:Kuzu Kuzu sure:2`"
      ),
      { ephemeral: true }
    );
  }

  await ctx.defer();

  const queries = [s1, s2, s3].filter(Boolean);
  const candidates = [];

  for (const q of queries) {
    try {
      const res = await find(player, q, ctx.user);
      if (res?.tracks?.length) {
        const t = res.tracks[0];
        candidates.push({
          title: t.info.title,
          author: t.info.author,
          uri: t.info.uri,
          track: t,
          voters: new Set(),
        });
      }
    } catch {}
  }

  if (candidates.length < 2) {
    return ctx.reply(
      ui.notice("Belirttiğiniz şarkılardan en az 2 tanesi aramalarda bulunamadı. Lütfen kontrol edin.")
    );
  }

  const endsAt = Date.now() + minutes * 60_000;

  const timeoutId = setTimeout(async () => {
    await finishPoll(ctx.guild.id, ctx.channel, ctx.client);
  }, minutes * 60_000);

  const poll = createPoll(ctx.guild.id, {
    guildId: ctx.guild.id,
    channelId: ctx.channel.id,
    createdBy: ctx.user.id,
    endsAt,
    timeoutId,
    candidates,
  });

  const replyMsg = await ctx.reply(renderPollContainer(poll));
  if (replyMsg?.id) {
    poll.messageId = replyMsg.id;
  }
}

async function onEnd(ctx) {
  const poll = getPoll(ctx.guild.id);
  if (!poll) {
    return ctx.reply(ui.notice("Bu sunucuda aktif bir oylama bulunmuyor."), { ephemeral: true });
  }

  await ctx.defer();
  await finishPoll(ctx.guild.id, ctx.channel, ctx.client);
}

export async function finishPoll(guildId, channel, client) {
  const poll = getPoll(guildId);
  if (!poll) return;

  cancelPoll(guildId);

  // En çok oy alanı belirle
  const sorted = [...poll.candidates].sort((a, b) => b.voters.size - a.voters.size);
  const winner = sorted[0];

  const announcement = ui.container(
    Accent.primary,
    ui.text(`### 🏆 Oylama Tamamlandı! (Poll Finished)`),
    ui.text(
      `**Kazanan Parça:** [${escape(winner.title)}](${winner.uri || "https://discord.com"}) — *${escape(winner.author)}*`,
      `-# Toplam **${winner.voters.size}** oy aldı!`
    )
  );

  const targetChannel = channel || (await client?.channels.fetch(poll.channelId).catch(() => null));
  if (targetChannel) {
    await targetChannel.send(announcement).catch(() => {});
  }

  // Kazanan şarkıyı çal
  try {
    const fakeCtx = {
      guild: { id: guildId },
      channel: targetChannel,
      user: { id: poll.createdBy, username: "Poll" },
      member: targetChannel?.guild?.members?.cache?.get(poll.createdBy),
      defer: async () => {},
      reply: (content) => targetChannel?.send(content),
    };

    const added = await enqueue(fakeCtx, winner.uri || winner.title);
    if (!added.error) {
      await panelOrNotice(fakeCtx, added);
    }
  } catch (err) {
    console.error("Poll winner enqueue failed:", err.message);
  }
}
