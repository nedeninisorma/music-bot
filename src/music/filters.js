export const FILTERS = {
  clear: {
    label: "Sıfırla",
    description: "Tüm filtreleri kaldırır ve orijinal sese döner.",
    apply: async (filters) => {
      await filters.resetFilters();
      await filters.clearEQ();
    },
  },
  bassboost: {
    label: "Bass Boost",
    description: "Daha güçlü ve derin baslar.",
    apply: (filters) => filters.setEQPreset("BassboostHigh"),
  },
  nightcore: {
    label: "Nightcore",
    description: "Daha hızlı ve tiz ses tonu.",
    apply: (filters) => filters.toggleNightcore(),
  },
  vaporwave: {
    label: "Vaporwave",
    description: "Daha yavaş ve pes ses tonu.",
    apply: (filters) => filters.toggleVaporwave(),
  },
  eightd: {
    label: "8D Müzik",
    description: "Ses başınızın etrafında 360 derece döner.",
    apply: (filters) => filters.toggleRotation(0.2),
  },
  karaoke: {
    label: "Karaoke",
    description: "Ana vokal sesini kısar.",
    apply: (filters) => filters.toggleKaraoke(),
  },
  tremolo: {
    label: "Tremolo",
    description: "Ses dalgalanması efekti.",
    apply: (filters) => filters.toggleTremolo(),
  },
  vibrato: {
    label: "Vibrato",
    description: "Perde titreşimi efekti.",
    apply: (filters) => filters.toggleVibrato(),
  },
  lowpass: {
    label: "Low Pass",
    description: "Tizleri keser, duvardan gelen müzik gibi.",
    apply: (filters) => filters.toggleLowPass(),
  },
  pop: {
    label: "Pop",
    description: "Pop müzik için dengelenmiş ekolayzır.",
    apply: (filters) => filters.setEQPreset("Pop"),
  },
  rock: {
    label: "Rock",
    description: "Rock müzik için dengelenmiş ekolayzır.",
    apply: (filters) => filters.setEQPreset("Rock"),
  },
  electronic: {
    label: "Elektronik",
    description: "Elektronik müzik için dengelenmiş ekolayzır.",
    apply: (filters) => filters.setEQPreset("Electronic"),
  },
};

export async function applyFilter(player, name) {
  const filter = FILTERS[name];
  if (!filter) return null;

  if (name !== "clear" && isEqPreset(name)) await player.filterManager.clearEQ();
  await filter.apply(player.filterManager);

  return filter;
}

export function activeFilters(player) {
  const state = player?.filterManager?.filters ?? {};
  const names = [];

  if (state.nightcore) names.push("Nightcore");
  if (state.vaporwave) names.push("Vaporwave");
  if (state.rotation) names.push("8D");
  if (state.karaoke) names.push("Karaoke");
  if (state.tremolo) names.push("Tremolo");
  if (state.vibrato) names.push("Vibrato");
  if (state.lowPass) names.push("Low pass");
  const bands = player?.filterManager?.equalizerBands ?? [];
  if (bands.some((band) => band.gain !== 0)) names.push("EQ");

  return names;
}

function isEqPreset(name) {
  return ["bassboost", "pop", "rock", "electronic"].includes(name);
}
