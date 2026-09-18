import { CommandType, Permission } from "../core/command.js";
import { ui } from "../core/ui.js";

export default {

  type: CommandType.Both,
  name: "ping",
  description: "Botun gecikme süresini (ping) ve durumunu kontrol eder.",
  permission: Permission.Everyone,
  cooldown: 3,

  run(ctx) {
    const ms = Math.round(ctx.client.ws.ping);

    const mood = ms < 0 ? "ölçülüyor..." : ms < 150 ? "oldukça hızlı" : "biraz gecikmeli";

    return ctx.reply(ui.notice("# Pong!", `> Buradayım. Ağ gecikmesi: **${ms}ms** (${mood}).`));
  },
};
