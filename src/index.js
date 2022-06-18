const { Client, Intents, Formatters } = require("discord.js")
const fs = require("fs")
const { generateBoard } = require("./board.js")
const config = require("./config.json")
const { verifyMove } = require("./game.js")
const games = require("./games.json")
require("dotenv").config()

const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

class game {
    constructor(j1ID, j2ID) {
        this.j1 = j1ID
        this.j2 = j2ID
        this.board = games.default
        this.turns = 0
    }
}

bot.on("ready", () => {
    console.log("Je suis pr\xEAt \xE0 \xEAtre utilis\xE9 !, " + bot.user.tag)
})

bot.on("messageCreate", async (message) => {
    console.log(message.content)
    if (message.content.startsWith(config.bot.prefix) && !message.author.bot) {
        const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase()

        let gameID
        let player
        for (let i = 0; i < games.games.length; i++) {
            if (games.games[i].j1 == message.author.id.toString()) {
                gameID = i
                player = 1
            } else if (games.games[i].j2 == message.author.id.toString()) {
                gameID = i
                player = 2
            }
        }

        switch (command) {
            case "ping":
                message.reply("Pong!")
                break

            case "test":
                console.log(Math.sign(-1000))
                break

            case "board":
                generateBoard(0, 1)
                generateBoard(0, 2)
                message.channel.send({
                    files: [
                        {
                            attachment: `./boards/board${0}_j${1}.png`,
                            name: "board.png",
                            description: "Plateau de Jeu"
                        },
                        {
                            attachment: `./boards/board${0}_j${2}.png`,
                            name: "board.png",
                            description: "Plateau de Jeu"
                        }
                    ]
                })
                break

            case "challenge":
                if (gameID == undefined) {
                    if (args[0] == undefined) {
                        message.reply("Merci de mentionner la personne à défier")
                    } else if (message.mentions.users.first() == undefined) {
                        message.reply("Mention invalide")
                    } else if (message.mentions.users.first().id == undefined) {
                        //message.author.id
                        message.reply("Vous ne pouvez pas vous défier vous même")
                    } else if (message.mentions.users.first().bot || message.mentions.users.first().system) {
                        message.reply("Vous ne pouvez pas défier un bot")
                    } else {
                        if (Math.random() < 0.5) {
                            challenge = new game(message.author.id, message.mentions.users.first().id)
                            player = 1
                        } else {
                            challenge = new game(message.mentions.users.first().id, message.author.id)
                            player = 2
                        }
                        gameID = games.games.push(challenge) - 1

                        generateBoard(gameID, 1)

                        message.channel.send({
                            content: `${Formatters.userMention(games.games[gameID].j1)}`,
                            files: [
                                {
                                    attachment: `./boards/board${gameID}_j${1}.png`,
                                    name: "board.png",
                                    description: "Plateau de Jeu"
                                }
                            ]
                        })
                    }
                } else {
                    let opponent
                    if (player == 1) {
                        opponent = Formatters.userMention(games.games[gameID].j2)
                    } else {
                        opponent = Formatters.userMention(games.games[gameID].j1)
                    }
                    message.reply(`Vous avez encore une partie en cours contre ${opponent}`)
                }

                fs.writeFileSync("./games.json", JSON.stringify(games, null, 4))
                break

            case "move":
                if (args[0] == undefined) {
                    message.reply("Veuiller indiquer le déplacement à effectuer")
                } else {
                    let i = 1
                    console.log(args)
                    while (args[i] != undefined) {
                        args[0] += args[i]
                        i++
                    }
                    console.log(args)
                    var move = args[0].toLowerCase().split("")
                    console.log(move)
                    if (move[0].match(/[a-h]/) && move[1].match(/[1-8]/) && move[2].match(/[a-h]/) && move[3].match(/[1-8]/) && args[0].length == 4) {
                        move[0] = move[0].charCodeAt(0) - 96
                        move[1] = Number(move[1])
                        move[2] = move[2].charCodeAt(0) - 96
                        move[3] = Number(move[3])
                        console.log(move)
                        verifyMove(gameID, player, move)


                    } else {
                        message.reply("Déplacement invalide")
                    }
                }
                break
        }
    }
})

bot.login(process.env.BOT_TOKEN)
