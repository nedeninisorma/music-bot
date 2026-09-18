import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui, Accent } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { escape } from "../../music/panel.js";
import { plain } from "../../music/queueView.js";
import { formatTime } from "../../music/card.js";
import { view } from "../../music/track.js";
import { ensurePlayer, enqueue, panelOrNotice } from "../../music/session.js";
import { find } from "../../music/search.js";
import { remember } from "../../music/searches.js";

export default {
  type: CommandType.Both,
  name: "oner",
  aliases: ["recommend", "rec", "oneri", "suggest"],
  description: "Belirttiğiniz 2 şarkıya benzer şarkı önerileri bulur ve çalmanızı sağlar.",
  permission: Permission.Everyone,

  options: [
    {
      name: "sarki1",
      description: "İlk şarkı adı veya sanatçı (First song name)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "sarki2",
      description: "İkinci şarkı adı veya sanatçı (Second song name)",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "otomatik_cal",
      description: "En iyi öneriyi hemen kuyruğa ekle (Auto enqueue best match)",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
  ],

  async run(ctx) {
    const s1 = ctx.options?.getString("sarki1") ?? ctx.args[0];
    const s2 = ctx.options?.getString("sarki2") ?? ctx.args[1];

    if (!s1 || !s2) {
      return ctx.reply(
        ui.notice(
          "Lütfen benzer şarkı önerisi için **2 şarkı adı** belirtin.",
          "-# Örnek: `/oner sarki1:Duman Kırmış Kalbini sarki2:Mor ve Ötesi Bir Derdim Var`"
        ),
        { ephemeral: true }
      );
    }

    await ctx.defer();

    const ready = await ensurePlayer(ctx);
    if (ready.error) return ctx.reply(ui.notice(ready.error));
    const { player } = ready;

    // İki şarkıyı da aratıp sanatçı ve başlık bilgilerini analiz edelim
    const [res1, res2] = await Promise.all([
      find(player, s1, ctx.user).catch(() => null),
      find(player, s2, ctx.user).catch(() => null),
    ]);

    const track1 = res1?.tracks?.[0];
    const track2 = res2?.tracks?.[0];

    const artist1 = track1?.info?.author || s1;
    const artist2 = track2?.info?.author || s2;

    // Benzer şarkılar için zengin arama sorguları oluşturalım
    const searchQueries = [
      `${artist1} ${artist2} radio`,
      `${artist1} similar songs`,
      `${artist2} mix`,
    ];

    let candidates = [];
    for (const q of searchQueries) {
      try {
        const searchRes = await find(player, q, ctx.user);
        if (searchRes?.tracks?.length) {
          candidates.push(...searchRes.tracks);
        }
      } catch {}
      if (candidates.length >= 10) break;
    }

    // İlk girilen 2 şarkıyı veya birbirinin aynısı olanları filtrele
    const seenUris = new Set([track1?.info?.uri, track2?.info?.uri].filter(Boolean));
    const seenTitles = new Set([track1?.info?.title?.toLowerCase(), track2?.info?.title?.toLowerCase()].filter(Boolean));

    const uniqueTracks = [];
    for (const t of candidates) {
      const uri = t.info?.uri;
      const title = t.info?.title?.toLowerCase();
      if (!uri || seenUris.has(uri) || seenTitles.has(title)) continue;

      seenUris.add(uri);
      seenTitles.add(title);
      uniqueTracks.push(t);
      if (uniqueTracks.length >= 5) break;
    }

    if (!uniqueTracks.length) {
      return ctx.reply(
        ui.notice(`"${escape(s1)}" ve "${escape(s2)}" için benzer bir şarkı önerisi bulunamadı.`)
      );
    }

    // Kullanıcı otomatik çalmayı seçtiyse 1. öneriyi ekle
    const autoPlay = ctx.options?.getBoolean("otomatik_cal") ?? false;
    if (autoPlay) {
      const best = uniqueTracks[0];
      const added = await enqueue(ctx, best.info.uri || best.info.title);
      if (added.error) return ctx.reply(ui.notice(added.error));
      return panelOrNotice(ctx, added);
    }

    // Arama sonuçları bilet sistemiyle select menüye bağlanır
    const ticket = remember(ctx.guild.id, ctx.user.id, uniqueTracks);

    const lines = uniqueTracks.map((t, idx) => {
      const v = view(t);
      const time = v.isLive ? "canlı" : formatTime(v.duration);
      return `\`${idx + 1}.\` **${escape(v.title)}**\n-# ${escape(v.artist)} \`[${time}]\``;
    });

    return ctx.reply(
      ui.container(
        Accent.primary,
        ui.text(`### 💡 Akıllı Şarkı Önerileri (Recommendations)`),
        ui.text(
          `-# İlham Alınan: **${escape(track1?.info?.title || s1)}** & **${escape(track2?.info?.title || s2)}**`
        ),
        ui.divider(),
        ui.text(...lines),
        ui.divider(),
        ui.row(
          ui.select(
            `sr:pick:${ticket}`,
            "Kuyruğa eklemek istediğiniz öneriyi seçin...",
            uniqueTracks.map((t, idx) => {
              const v = view(t);
              return {
                label: plain(v.title, 100),
                value: String(idx),
                description: plain(`${v.artist} - ${formatTime(v.duration)}`, 100),
              };
            }),
            { max: 1 }
          )
        )
      )
    );
  },
};
