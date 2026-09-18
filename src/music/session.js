import { ui } from "../core/ui.js";
import { emoji } from "./emojis.js";
import { escape } from "./panel.js";
import { formatTime, formatLong } from "./card.js";
import { view } from "./track.js";
import { getState } from "./state.js";
import { getPlayer, createPlayer, nodeReady } from "./lavalink.js";
import { find } from "./search.js";
import { movePanel, repaint } from "./repaint.js";
import { shuffleArray } from "../core/utils/flow.js";

export async function ensurePlayer(ctx) {
  const voiceChannelId = ctx.member?.voice?.channelId;
  if (!voiceChannelId) return { error: "Önce bir ses kanalına katılmalısın." };
  if (!nodeReady()) return { error: "Ses sunucusu (Lavalink) şu anda çevrimdışı. Lütfen biraz sonra tekrar deneyin." };

  const existing = getPlayer(ctx.guild.id);
  if (existing && existing.voiceChannelId && existing.voiceChannelId !== voiceChannelId) {
    return { error: `Şu anda <#${existing.voiceChannelId}> kanalında çalıyorum — önce o kanala katılmalısın.` };
  }

  const player = await createPlayer({
    guildId: ctx.guild.id,
    voiceChannelId,
    textChannelId: ctx.channel.id,
  });

  const state = getState(ctx.guild.id);
  state.channelId = ctx.channel.id;

  return { player, state };
}

export async function enqueue(ctx, query, { next = false, source, shuffle = true } = {}) {
  const ready = await ensurePlayer(ctx);
  if (ready.error) return ready;

  const { player, state } = ready;
  const wasIdle = !player.queue.current;

  let result;
  try {
    result = await find(player, query, ctx.user, { source });
  } catch (error) {
    console.error("Searching failed:", error.message);
    return { error: `Şu anda **${escape(query)}** için arama yapılamadı.` };
  }

  if (!result.tracks.length) return { error: `**${escape(query)}** için hiçbir sonuç bulunamadı.` };

  let tracks = result.playlist ? [...result.tracks] : [result.tracks[0]];
  const isShuffled = Boolean(result.playlist && shuffle);
  if (isShuffled) {
    tracks = shuffleArray(tracks);
  }

  await player.queue.add(tracks, next ? 0 : undefined);

  if (wasIdle) await player.play();

  return { player, state, tracks, playlist: result.playlist, wasIdle, shuffled: isShuffled };
}

export async function panelOrNotice(ctx, added) {
  const { player, state, tracks, playlist, wasIdle, shuffled } = added;

  if (wasIdle || !state.messageId) {
    await movePanel(player, state, (view) => ctx.reply(view));
    return;
  }

  await ctx.reply(queuedNotice(tracks, playlist, player, { shuffled }));
  return repost(ctx, player, state);
}

async function repost(ctx, player, state) {
  const channel = ctx.channel;
  const previous = state.messageId;

  const message = await movePanel(player, state, (view) => channel.send(view)).catch(() => null);
  if (!message) return repaint(ctx.guild.id);

  if (previous && previous !== message.id) {
    await channel.messages
      .fetch(previous)
      .then((old) => old.delete())
      .catch(() => {});
  }
}

export function queuedNotice(tracks, playlist, player, { shuffled = false } = {}) {
  const waiting = player.queue.tracks.length;

  if (playlist) {
    const shuffleBadge = shuffled ? ` ${emoji("shuffle")} *(rastgele sıralandı)*` : "";
    return ui.notice(
      `${emoji("playlist")} Çalma listesi eklendi: **${escape(playlist.name)}**${shuffleBadge} — ${tracks.length} parça`,
      `-# Sırada ${waiting} parça bekliyor — toplam ${formatLong(Math.round(playlist.duration / 1000))}`
    );
  }

  const track = view(tracks[0]);
  return ui.notice(
    `${emoji("queue")} Kuyruğa eklendi: **${escape(track.title)}** — *${escape(track.artist)}*`,
    `-# Sıra: ${waiting} — \`${track.isLive ? "canlı" : formatTime(track.duration)}\``
  );
}
