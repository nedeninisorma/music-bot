import { ApplicationCommandOptionType } from "discord.js";

import { CommandType, Permission } from "../../core/command.js";
import { ui } from "../../core/ui.js";
import { emoji } from "../../music/emojis.js";
import { enqueue, panelOrNotice } from "../../music/session.js";

export const STATIONS = {
  powerfm: {
    name: "Power FM",
    url: "https://powerfm.listenpowerapp.com/powerfm/mpeg/icecast.audio",
  },
  powerturk: {
    name: "Power Türk",
    url: "https://powerturk.listenpowerapp.com/powerturk/mpeg/icecast.audio",
  },
  kralpop: {
    name: "Kral Pop",
    url: "https://kralpop.listen.kralmuzik.com.tr/kralpop/mpeg/icecast.audio",
  },
  virgin: {
    name: "Virgin Radio Türkiye",
    url: "https://virginradioturkiye.listenpowerapp.com/virginradioturkiye/mpeg/icecast.audio",
  },
  slowturk: {
    name: "Slow Türk",
    url: "https://radyo.dogannet.tv/slowturk",
  },
  metrofm: {
    name: "Metro FM",
    url: "https://metrofm.listenpowerapp.com/metrofm/mpeg/icecast.audio",
  },
  fenomen: {
    name: "Radyo Fenomen",
    url: "https://fenomen.listenfenomen.com/fenomen/128/icecast.audio",
  },
  superfm: {
    name: "Süper FM",
    url: "https://superfm.listenpowerapp.com/superfm/mpeg/icecast.audio",
  },
  trtfm: {
    name: "TRT FM",
    url: "https://trtfm.turkhosted.com/trtfm.mp3",
  },
  lofi: {
    name: "Lofi / Chill Beats",
    url: "https://streams.fluxfm.de/Chillhop/mp3-320",
  },
};

export default {
  type: CommandType.Both,
  name: "radio",
  aliases: ["radyo"],
  description: "Popüler canlı radyo istasyonlarını çalar.",
  permission: Permission.Everyone,

  options: [
    {
      name: "istasyon",
      description: "Dinlemek istediğiniz radyo istasyonu.",
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: Object.entries(STATIONS).map(([key, item]) => ({
        name: item.name,
        value: key,
      })),
    },
  ],

  async run(ctx) {
    const input = (ctx.options?.getString("istasyon") ?? ctx.args[0] ?? "").toLowerCase().trim();

    if (!input) {
      const list = Object.entries(STATIONS)
        .map(([key, item]) => `• \`${key}\` — **${item.name}**`)
        .join("\n");

      return ctx.reply(
        ui.notice(
          `${emoji("live")} Bir radyo istasyonu seçin:`,
          list + "\n-# Örnek: `/radio istasyon:powerfm` veya `!radyo powerturk`"
        ),
        { ephemeral: true }
      );
    }

    const station = STATIONS[input] || Object.values(STATIONS).find((s) => s.name.toLowerCase().includes(input));

    if (!station) {
      return ctx.reply(
        ui.notice(
          `**${input}** adında bir radyo istasyonu bulunamadı.`,
          "-# `/radio` yazarak mevcut radyo istasyonlarını görebilirsin."
        ),
        { ephemeral: true }
      );
    }

    await ctx.defer();

    const added = await enqueue(ctx, station.url);
    if (added.error) return ctx.reply(ui.notice(added.error));

    return panelOrNotice(ctx, added);
  },
};
