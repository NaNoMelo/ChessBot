const { Client, Intents } = require("discord.js");
const config = require("./config.json");

const bot = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES]});

bot.on("ready", () => {
    console.log('Je suis pr\xEAt \xE0 \xEAtre utilis\xE9 !, '+ bot.user.tag);
});

bot.on("messageCreate", async (message) => {
    console.log(message.content);
	if (message.content.startsWith(config.prefix) && !message.author.bot ) {

		const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		switch (command) {
            case "ping":
                message.reply("Pong!");
            break;
        }
    }

    if (message.content == "ping") {
        message.reply("ping");
    }
})

bot.login(config.token)