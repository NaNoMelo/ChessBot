module.exports = {
    data: {
        name: "ping",
        description: "replies with pong"
    },
    async run(arg, interaction) {
        interaction.followUp("pong");
    }
};