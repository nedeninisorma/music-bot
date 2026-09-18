/**
 * Sunucu ve kullanıcı bazında dinleme istatistikleri servisi.
 */

/** @type {import('../core/data/Database.js').Database} */
let store = null;

export function useStats(db) {
  store = db;
}

const keyPlays = (guildId) => `stats:plays:${guildId}`;
const keyDuration = (guildId) => `stats:duration:${guildId}`;
const keyTracks = (guildId) => `stats:tracks:${guildId}`;
const keyUsers = (guildId) => `stats:users:${guildId}`;

/**
 * Bir şarkı çalındığında istatistikleri günceller.
 * @param {string} guildId
 * @param {object} track - Lavalink track nesnesi
 * @param {string} userId
 */
export async function recordTrackPlay(guildId, track, userId) {
  if (!store || !track?.info) return;

  const info = track.info;
  const durationMs = Number(info.duration) || 0;

  try {
    // Toplam çalma sayısını artır
    await store.add(keyPlays(guildId), 1);

    // Toplam çalma süresini artır
    if (durationMs > 0 && !info.isStream) {
      await store.add(keyDuration(guildId), durationMs);
    }

    // Şarkı bazında sayaç
    const trackMap = (await store.get(keyTracks(guildId))) || {};
    const trackKey = info.identifier || info.uri || info.title;
    if (!trackMap[trackKey]) {
      trackMap[trackKey] = {
        title: info.title,
        author: info.author,
        uri: info.uri,
        count: 1,
      };
    } else {
      trackMap[trackKey].count = (trackMap[trackKey].count || 0) + 1;
    }

    // Bellek ve boyut optimizasyonu: En çok dinlenen 100 parçayı koru
    const trackEntries = Object.entries(trackMap);
    if (trackEntries.length > 120) {
      trackEntries.sort((a, b) => (b[1].count || 0) - (a[1].count || 0));
      const pruned = Object.fromEntries(trackEntries.slice(0, 100));
      await store.set(keyTracks(guildId), pruned);
    } else {
      await store.set(keyTracks(guildId), trackMap);
    }

    // Kullanıcı bazında sayaç
    if (userId) {
      const userMap = (await store.get(keyUsers(guildId))) || {};
      if (!userMap[userId]) {
        userMap[userId] = { count: 1, duration: durationMs };
      } else {
        userMap[userId].count = (userMap[userId].count || 0) + 1;
        userMap[userId].duration = (userMap[userId].duration || 0) + durationMs;
      }
      await store.set(keyUsers(guildId), userMap);
    }
  } catch (err) {
    console.error("Stats update failed:", err.message);
  }
}

/**
 * Sunucu istatistiklerini getirir.
 * @param {string} guildId
 */
export async function getGuildStats(guildId) {
  if (!store) {
    return { plays: 0, duration: 0, topTracks: [], topUsers: [] };
  }

  const [plays, duration, tracks, users] = await Promise.all([
    store.get(keyPlays(guildId), 0),
    store.get(keyDuration(guildId), 0),
    store.get(keyTracks(guildId), {}),
    store.get(keyUsers(guildId), {}),
  ]);

  const topTracks = Object.values(tracks || {})
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 10);

  const topUsers = Object.entries(users || {})
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 5);

  return {
    plays: plays || 0,
    duration: duration || 0,
    topTracks,
    topUsers,
  };
}
