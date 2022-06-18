const {
    Client,
    Collection,
    Intents
} = require("discord.js")
const glob = require("glob")
const path = require("node:path")
const { client } = require("../index.js")

class ExtendedClient extends Client {
    constructor() {
        super({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MESSAGE_TYPING] })
        this.commands = new Collection
    }

    start() {
        this.registerEvents()
        this.registerModules()
        this.login(process.env.botToken)
    }

    async registerEvents() {
        const eventFiles = glob.sync(
            path
                .join(process.cwd(), "src", "events", "*.js")
                .split(path.sep)
                .join("/")
        )
        console.log("events :", eventFiles)
        eventFiles.forEach(async (filePath) => {
            const event = require(filePath)
            this.on(event.event, event.run)
        })
    }

    async registerCommands({
        slashCommands,
        guildID
    }) {
        await this.application?.commands.set([])
        await this.guilds.cache.get(guildID)?.commands.set([])
        if (guildID) {
            this.guilds.cache.get(guildID)?.commands.set(slashCommands)
            console.log(`Registering commands to ${guildID}`)
        } else {
            this.application?.commands.set(slashCommands)
            console.log("Registering global commands")
        }
    }

    async registerModules() {
        const slashCommands = []
        const commandFiles = glob.sync(
            path
                .join(process.cwd(), "src", "commands", "*{.ts,.js}")
                .split(path.sep)
                .join("/")
        )
        console.log("commandes :", commandFiles)

        for (const file of commandFiles) {
            const command = require(file)
            slashCommands.push(command.data)
            this.commands.set(command.data.name, command)
        }

        this.on("ready", () => {
            this.registerCommands({
                slashCommands: slashCommands,
                guildID: process.env.guildId
            })
        })
    }
}

module.exports = {
    ExtendedClient
}