/**
 * Sunucu bazında şarkı geçmişi servisi.
 * Son 50 çalınan şarkıyı DB'de tutar.
 */

const MAX_HISTORY = 50;

/** @type {import('../core/data/Database.js').Database} */
let store = null;

export function useHistory(db) {
  store = db;
}

const historyKey = (guildId) => `history:${guildId}`;

/**
 * Çalınan şarkıyı geçmişe kaydeder.
 * @param {string} guildId
 * @param {object} track - Lavalink track nesnesi
 * @param {string} userId - İsteyen kullanıcı ID'si
 */
export async function recordPlay(guildId, track, userId) {
  if (!store || !track?.info) return;

  const info = track.info;
  const entry = {
    title: info.title,
    author: info.author,
    uri: info.uri,
    duration: info.duration,
    artworkUrl: info.artworkUrl ?? null,
    sourceName: info.sourceName,
    encoded: track.encoded,
    userId,
    playedAt: Date.now(),
  };

  const history = (await store.get(historyKey(guildId))) ?? [];

  // Aynı şarkıyı üst üste ekleme
  if (history.length > 0 && history[0].uri === entry.uri) return;

  history.unshift(entry);

  // Limiti aşan kayıtları sil
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;

  await store.set(historyKey(guildId), history);
}

/**
 * Sunucu geçmişini döner.
 * @param {string} guildId
 * @param {number} [limit=20]
 * @returns {Promise<Array>}
 */
export async function getHistory(guildId, limit = 20) {
  if (!store) return [];
  const history = (await store.get(historyKey(guildId))) ?? [];
  return history.slice(0, limit);
}
