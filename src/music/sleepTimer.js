/**
 * In-memory uyku zamanlayıcısı (Sleep Timer).
 * Dakika veya parça sayısı dolduğunda oynatıcıyı otomatik durdurur.
 */

const timers = new Map();

/**
 * @typedef {Object} SleepTimerInfo
 * @property {NodeJS.Timeout|null} timeoutId
 * @property {number|null} remainingTracks
 * @property {number|null} endTime
 * @property {number|null} totalMinutes
 */

/**
 * Uyku zamanlayıcısı kurar.
 * @param {string} guildId
 * @param {{ minutes?: number, tracks?: number }} options
 * @param {Function} onExpire - Süre/parça bitince çalışacak fonksiyon
 */
export function setSleepTimer(guildId, { minutes, tracks }, onExpire) {
  cancelSleepTimer(guildId);

  const info = {
    timeoutId: null,
    remainingTracks: tracks || null,
    endTime: minutes ? Date.now() + minutes * 60_000 : null,
    totalMinutes: minutes || null,
  };

  if (minutes) {
    info.timeoutId = setTimeout(async () => {
      timers.delete(guildId);
      try {
        await onExpire();
      } catch (err) {
        console.error("Sleep timer expire error:", err.message);
      }
    }, minutes * 60_000);
  }

  timers.set(guildId, { ...info, onExpire });
  return info;
}

/**
 * Uyku zamanlayıcısını iptal eder.
 * @param {string} guildId
 * @returns {boolean} İptal edildi mi?
 */
export function cancelSleepTimer(guildId) {
  const existing = timers.get(guildId);
  if (!existing) return false;

  if (existing.timeoutId) {
    clearTimeout(existing.timeoutId);
  }
  timers.delete(guildId);
  return true;
}

/**
 * Mevcut zamanlayıcı bilgisini döner.
 * @param {string} guildId
 */
export function getSleepTimer(guildId) {
  const existing = timers.get(guildId);
  if (!existing) return null;

  return {
    remainingMinutes: existing.endTime ? Math.max(0, Math.ceil((existing.endTime - Date.now()) / 60_000)) : null,
    remainingTracks: existing.remainingTracks,
  };
}

/**
 * Yeni şarkı başladığında parça sayacını 1 düşürür.
 * @param {object} player - Lavalink player
 */
export async function tickSleepTimer(player) {
  if (!player?.guildId) return;
  const existing = timers.get(player.guildId);
  if (!existing || existing.remainingTracks === null) return;

  existing.remainingTracks -= 1;

  if (existing.remainingTracks <= 0) {
    timers.delete(player.guildId);
    try {
      if (typeof existing.onExpire === "function") {
        await existing.onExpire();
      } else {
        await player.destroy();
      }
    } catch (err) {
      console.error("Sleep timer track tick error:", err.message);
    }
  }
}
