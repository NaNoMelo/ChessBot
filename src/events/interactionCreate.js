const { client } = require("../index.js")

module.exports = {
    event: "interactionCreate",
    run: async (interaction) => {
        if (interaction.isCommand()) {
            await interaction.deferReply()
            const command = client.commands.get(interaction.commandName)
            if (!command) return interaction.followUp("Command doesn't exist")

            command.run(
                interaction.options,
                interaction
            )
        }
    }
}