const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("poll")
    .setDescription("Creates a poll with the given options")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("The question to ask")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("a1").setDescription("Answer 1").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("a2").setDescription("Answer 2").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("a3").setDescription("Answer 3").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("a4").setDescription("Answer 4").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("a5").setDescription("Answer 5").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("a6").setDescription("Answer 6").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("a7").setDescription("Answer 7").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("a8").setDescription("Answer 8").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("a9").setDescription("Answer 9").setRequired(false)
    )
    .addStringOption((option) =>
      option.setName("a10").setDescription("Answer 10").setRequired(false)
    ),
  async execute(interaction) {
    const numbers = [
      "1️⃣",
      "2️⃣",
      "3️⃣",
      "4️⃣",
      "5️⃣",
      "6️⃣",
      "7️⃣",
      "8️⃣",
      "9️⃣",
      "🔟",
    ];

    var reactions = [];
    const poll = new MessageEmbed()
      .setTitle(`Poll: ${interaction.options.getString("question")}`)
      .setAuthor({
        name: interaction.member.nickname || interaction.user.username,
        iconURL: interaction.user.avatarURL({ dynamic: true }),
      });

    for (let i = 1; i <= 10; i++) {
      const option = interaction.options.getString(`a${i}`);
      if (option) {
        poll.addField(`${numbers[i - 1]}`, `${option}`);
        reactions.push(numbers[i - 1]);
      }
    }

    const message = await interaction.channel.send({ embeds: [poll] });
    await interaction.deferReply({ ephemeral: true });

    if (message) {
      for (const reaction of reactions) {
        await message.react(reaction);
      }
    }

    await interaction.editReply("Poll created!");
  },
};
