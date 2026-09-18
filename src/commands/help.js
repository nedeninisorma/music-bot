import { CommandType, Permission } from "../core/command.js";
import { ui, Accent } from "../core/ui.js";
import { emoji } from "../music/emojis.js";

const GROUPS = [
  {
    title: "Oynatma & Kontrol",
    icon: "play",
    names: ["play", "playnext", "replay", "radio", "search", "player", "skip", "seek", "stop", "zamanlayici", "paylas"],
  },
  {
    title: "Kuyruk & Çalma Listesi",
    icon: "queue",
    names: ["queue", "shuffle", "loop", "remove", "move", "clear", "autoplay", "kuyruk-kaydet"],
  },
  {
    title: "Keşif, Oylama & İstatistik",
    icon: "fire",
    names: ["oner", "oylama", "gecmis", "istatistik"],
  },
  {
    title: "Ses & Efektler",
    icon: "filter",
    names: ["volume", "filter", "lyrics"],
  },
  {
    title: "Kişisel Kütüphane",
    icon: "heart",
    names: ["playlist", "favorite"],
  },
];

export default {
  type: CommandType.Both,
  name: "help",
  aliases: ["yardim", "komutlar"],
  description: "Tüm komutları ve nasıl kullanılacaklarını listeler.",
  permission: Permission.Everyone,

  run(ctx) {
    const commands = ctx.client.commands;
    const grouped = new Set(GROUPS.flatMap((group) => group.names));

    const rest = [...commands.values()].filter((command) => !grouped.has(command.name));

    const sections = GROUPS.map((group) => {
      const lines = group.names
        .map((name) => commands.get(name))
        .filter(Boolean)
        .map((command) => describe(command, ctx.config.prefix));

      return lines.length
        ? [ui.text(`### ${emoji(group.icon)} ${group.title}`), ui.text(...lines)]
        : [];
    }).flat();

    return ctx.reply(
      ui.container(
        Accent.primary,
        ui.text(`# ${emoji("music")} Komut Listesi`),
        ui.text("-# Çoğu işlemi müzik panelindeki butonlarla yapabilirsiniz; komutlar detaylı kontroller içindir."),
        ui.divider(),
        ...sections,
        rest.length > 0 && ui.divider(),
        rest.length > 0 && ui.text(`### ${emoji("disc")} Diğer Komutlar`),
        rest.length > 0 && ui.text(...rest.map((command) => describe(command, ctx.config.prefix)))
      ),
      { ephemeral: true }
    );
  },
};

function describe(command, prefix) {
  const slash = command.type !== CommandType.Prefix ? `\`/${command.name}\`` : null;
  const text = command.type !== CommandType.Slash ? `\`${prefix}${command.name}\`` : null;

  const triggers = [slash, text].filter(Boolean).join(" veya ");
  return `> ${triggers}\n-# ↳   *${command.description || "Açıklama bulunmuyor."}*`;
}
