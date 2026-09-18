import { ackUpdate } from "../core/utils/respond.js";
import { withLock } from "../core/utils/flow.js";
import { votePoll, getPoll } from "../music/polls.js";
import { renderPollContainer } from "../commands/music/oylama.js";

export default {
  id: "pv",

  async run(interaction, { parts }) {
    if (parts[1] !== "vote") return ackUpdate(interaction);

    const index = parseInt(parts[2], 10);
    if (Number.isNaN(index)) return ackUpdate(interaction);

    return withLock(`poll:${interaction.guild.id}`, async () => {
      const result = votePoll(interaction.guild.id, interaction.user.id, index);
      if (result.error) {
        return interaction.reply({ content: result.error, ephemeral: true }).catch(() => {});
      }

      const poll = getPoll(interaction.guild.id);
      if (!poll) return ackUpdate(interaction);

      await interaction.update(renderPollContainer(poll)).catch(() => {});
    });
  },
};
