const { Client, Intents } = require("discord.js")
const { createCanvas, loadImage, Image, Canvas } = require("canvas")
const config = require("./config.json")
const fs = require("fs")
const games = require("./games.json")
require("dotenv").config()

const bot = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
})

class game {
    constructor(j1ID, j2ID) {
        this.j1 = j1ID
        this.j2 = j2ID
        this.boardj1 = games.default
        this.boardj2 = this.boardj1
        this.turns = 0
        this.updatej2()
    }
    updatej2() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                this.boardj2[y][x] = this.boardj1[7 - y][7 - x]
            }
        }
    }
}

let pieces = {}

for (let i = 0; i <= 12; i++) {
    pieces[i] = new Image()
    pieces[i].src = `./pieces/${i}.png`.toString()
}

bot.on("ready", () => {
    console.log("Je suis pr\xEAt \xE0 \xEAtre utilis\xE9 !, " + bot.user.tag)
})

bot.on("messageCreate", async (message) => {
    console.log(message.content)
    if (message.content.startsWith(config.bot.prefix) && !message.author.bot) {
        const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase()

        switch (command) {
            case "ping":
                message.reply("Pong!")
                break

            case "test":
                games.games[0].j1 = 0
                console.log(games.games[0].j1)
                break

            case "game":
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

                if (gameID == undefined) {
                    if (args[0] == undefined) {
                        message.reply("Merci de mentionner la personne à défier")
                    } else if (message.mentions.users.first() == undefined) {
                        message.reply("Mention invalide")
                    } else if (message.mentions.users.first().id == undefined) {
                        message.reply("Vous ne pouvez pas vous défier vous même")
                    } else if (message.mentions.users.first().bot || message.mentions.users.first().system) {
                        message.reply("Vous ne pouvez pas défier un bot")
                    } else {
                        if (Math.random() < 0.5) {
                            test = new game(message.author.id, message.mentions.users.first().id)
                        } else {
                            test = new game(message.mentions.users.first().id, message.author.id)
                        }
                        console.log(games.games.push(test))
                        console.log(test)
                    }
                }
                break
        }
    }

    if (message.content == "board") {
        generateBoard(message.author.id)

        message.channel.send({
            files: [
                {
                    attachment: `./boards/board${message.author.id}.png`,
                    name: "board.png",
                    description: "Plateau de Jeu"
                }
            ]
        })
    }

    //fs.writeFileSync("./games.json",JSON.stringify(games,null,1))
})

function generateBoard(gameID, player) {
    const board = createCanvas(config.board.size, config.board.size)
    const ctx = board.getContext("2d")

    ctx.beginPath()
    ctx.fillStyle = "green"
    ctx.fillRect(0, 0, board.width, board.height)
    ctx.lineWidth = board.width / 40
    ctx.strokeStyle = "orange"
    ctx.strokeRect(board.width / 10, board.height / 10, (8 * board.width) / 10, (8 * board.height) / 10)

    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillStyle = "rgb(50, 100, 170)"
    ctx.lineWidth = 1
    ctx.font = `${(1.5 * board.width) / 20}px sans-serif`
    let letters = ["a", "b", "c", "d", "e", "f", "g", "h"]

    if (player == 1) {
        for (let i = 0; i < 8; i++) {
            ctx.fillText(letters[i], ((2 * i + 3) * board.width) / 20, (1.5 * board.height) / 40)
            ctx.fillText(letters[i], ((2 * i + 3) * board.width) / 20, board.height - board.height / 20)
            ctx.fillText((8 - i).toString(), board.height / 20, ((2 * i + 3) * board.height) / 20)
            ctx.fillText((8 - i).toString(), board.height - board.height / 20, ((2 * i + 3) * board.height) / 20)
        }
    } else {
        for (let i = 0; i < 8; i++) {
            ctx.fillText(letters[7 - i], ((2 * i + 3) * board.width) / 20, (1.5 * board.height) / 40)
            ctx.fillText(letters[7 - i], ((2 * i + 3) * board.width) / 20, board.height - board.height / 20)
            ctx.fillText((i + 1).toString(), board.height / 20, ((2 * i + 3) * board.height) / 20)
            ctx.fillText((i + 1).toString(), board.height - board.height / 20, ((2 * i + 3) * board.height) / 20)
        }
    }

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if ((x + y) % 2 == 0) {
                ctx.fillStyle = "white"
            } else {
                ctx.fillStyle = "black"
            }

            ctx.fillRect(
                (x + 1) * (board.width / 10),
                (y + 1) * (board.height / 10),
                board.width / 10,
                board.height / 10
            )

            ctx.drawImage(
                pieces[games.default[y][x]],
                (board.width / 10) * (1 + x),
                (board.height / 10) * (1 + y),
                board.width / 10,
                board.height / 10
            )
        }
    }

    const buffer = board.toBuffer("image/png")
    fs.writeFileSync(`./boards/board${gameID}.png`, buffer)
}

bot.login(process.env.BOT_TOKEN)
