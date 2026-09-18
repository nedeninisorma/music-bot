/**
 * In-memory şarkı oylama sistemi (Music Polls).
 */

const polls = new Map();

/**
 * @typedef {Object} PollCandidate
 * @property {string} title
 * @property {string} author
 * @property {string} uri
 * @property {object} track - Raw Lavalink track
 * @property {Set<string>} voters - User IDs who voted
 */

/**
 * @typedef {Object} Poll
 * @property {string} guildId
 * @property {string} channelId
 * @property {string} messageId
 * @property {string} createdBy
 * @property {number} endsAt
 * @property {NodeJS.Timeout} timeoutId
 * @property {PollCandidate[]} candidates
 */

export function getPoll(guildId) {
  return polls.get(guildId) || null;
}

export function createPoll(guildId, data) {
  cancelPoll(guildId);
  polls.set(guildId, data);
  return data;
}

export function cancelPoll(guildId) {
  const existing = polls.get(guildId);
  if (existing?.timeoutId) {
    clearTimeout(existing.timeoutId);
  }
  polls.delete(guildId);
}

export function votePoll(guildId, userId, candidateIndex) {
  const poll = polls.get(guildId);
  if (!poll) return { error: "Aktif bir oylama bulunmuyor." };

  if (candidateIndex < 0 || candidateIndex >= poll.candidates.length) {
    return { error: "Geçersiz şarkı seçimi." };
  }

  // Kullanıcının önceki oyunu kaldır
  for (const candidate of poll.candidates) {
    candidate.voters.delete(userId);
  }

  // Yeni oyunu ekle
  poll.candidates[candidateIndex].voters.add(userId);

  return { poll, chosen: poll.candidates[candidateIndex] };
}
