import { ApplicationCommandOptionType, MessageFlags } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui, Accent } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { escape } from "../../music/panel.js";
import { view } from "../../music/track.js";
import { getPlayer } from "../../music/lavalink.js";

const ENDPOINT = "https://api.lyrics.ovh/v1";

export default {
  type: CommandType.Both,
  name: "lyrics",
  aliases: ["ly", "words", "sozler", "sarki-sozu"],
  description: "Şarkının sözlerini görüntüler.",
  permission: Permission.Everyone,

  options: [
    {
      name: "sarki",
      description: "Sanatçı ve şarkı adı. Çalan şarkı için boş bırakın.",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],

  async run(ctx) {
    const asked = ctx.options?.getString("sarki") ?? ctx.options?.getString("query") ?? ctx.args?.join(" ");
    const player = getPlayer(ctx.guild.id);
    const playing = player?.queue.current ? view(player.queue.current) : null;

    if (!asked && !playing) {
      return ctx.reply(
        ui.notice(
          "Şu anda bir şarkı çalmıyor — sanatçı ve şarkı adı belirtin, örn: `/lyrics sarki:tarkan kuzu kuzu`."
        ),
        { ephemeral: true }
      );
    }

    await ctx.defer();

    const target = asked
      ? split(asked)
      : { artist: clean(playing.artist), title: clean(playing.title) };

    const words = (!asked && (await fromLavalink(player))) || (await fromOvh(target));

    if (!words) {
      return ctx.reply(
        ui.notice(
          `**${escape(target.title)}**${target.artist ? ` (*${escape(target.artist)}*)` : ""} için şarkı sözü bulunamadı.`,
          "-# `/lyrics sarki:sanatci - sarki` formatında deneyebilirsiniz."
        )
      );
    }

    return ctx.reply({
      components: [
        ui.container(
          Accent.primary,
          ui.text(`### ${emoji("music")} ${escape(target.title)}`),
          target.artist && ui.text(`-# ${emoji("artist")} ${escape(target.artist)}`),
          ui.divider(),
          ...pages(words.text).map((page) => ui.text(page)),
          ui.divider(),
          ui.text(`-# Kaynak: ${words.source}`)
        ),
      ],
      flags: MessageFlags.IsComponentsV2,
    });
  },
};

async function fromLavalink(player) {
  const found = await player?.getCurrentLyrics().catch(() => null);
  if (!found) return null;

  const text = found.text || found.lines?.map((line) => line.line).join("\n");
  if (!text?.trim()) return null;

  return { text: text.trim(), source: found.provider || found.sourceName || "Lavalink" };
}

async function fromOvh({ artist, title }) {
  const attempts = artist ? [[artist, title], ["", title]] : [["", title]];

  for (const [who, what] of attempts) {
    try {
      const url = `${ENDPOINT}/${encodeURIComponent(who || what)}/${encodeURIComponent(what)}`;

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8_000);

      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timer);

      if (!response.ok) continue;

      const body = await response.json();
      const text = (body?.lyrics || "").trim();
      if (text) return { text, source: "lyrics.ovh" };
    } catch {
      continue;
    }
  }
  return null;
}

function split(query) {
  const dash = query.split(/\s+-\s+/);
  if (dash.length >= 2) {
    return { artist: dash[0].trim(), title: dash.slice(1).join(" - ").trim() };
  }
  return { artist: "", title: query.trim() };
}

function clean(text) {
  return String(text ?? "")
    .replace(/\([^)]*\)|\[[^\]]*\]/g, "")
    .replace(/\b(official|lyrics?|audio|video|hd|4k|mv|m\/v|full|album|version|remaster(ed)?)\b/gi, "")
    .replace(/\bfeat\.?\b.*$/i, "")
    .replace(/[|·]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pages(words) {
  const capped = words.slice(0, 11_000);
  const out = [];

  for (const paragraph of capped.split(/\n{2,}/)) {
    const block = paragraph.trim();
    if (!block) continue;

    if (!out.length || out[out.length - 1].length + block.length + 2 > 3800) {
      out.push(block);
    } else {
      out[out.length - 1] += `\n\n${block}`;
    }
  }

  if (words.length > 11_000) out.push("-# ...cut short, the rest is too long to post.");
  return out.length ? out : [words.slice(0, 3800)];
}
