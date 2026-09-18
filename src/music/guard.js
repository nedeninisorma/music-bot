import { ui } from "../core/ui.js";
import { getPlayer, nodeReady } from "./lavalink.js";

export function requireNode() {
  if (!nodeReady()) {
    return "Ses sunucusu (Lavalink) şu anda çevrimdışı. Lütfen biraz sonra tekrar deneyin.";
  }
  return null;
}

export function requirePlaying(ctx) {
  const player = getPlayer(ctx.guild.id);
  if (!player?.queue.current) return "Şu anda hiçbir şarkı çalmıyor. `/play` ile bir şeyler başlatabilirsin.";
  return null;
}

export function requireVoice(ctx) {
  if (!ctx.member?.voice?.channelId) return "Önce bir ses kanalına katılmalısın.";
  return null;
}

export function requireSameChannel(ctx) {
  const player = getPlayer(ctx.guild.id);
  const listening = ctx.member?.voice?.channelId;

  if (!listening) return "Önce bir ses kanalına katılmalısın.";

  if (player?.voiceChannelId && listening !== player.voiceChannelId) {
    return `Şu anda <#${player.voiceChannelId}> kanalında çalıyorum — kontrolleri kullanmak için o kanala katılmalısın.`;
  }
  return null;
}

export function guarded(checks, body) {
  return async (ctx) => {
    for (const check of checks) {
      const problem = check(ctx);
      if (problem) return ctx.reply(ui.notice(problem), { ephemeral: true });
    }
    return body(ctx, getPlayer(ctx.guild.id));
  };
}
