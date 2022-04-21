const { Client, Intents } = require("discord.js");
const { createCanvas, loadImage, Image , Canvas } = require('canvas')
const config = require("./config.json");
const fs = require('fs')
const games = require("./games.json");
require('dotenv').config();

const bot = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES]});

let pieces = {}

for (let i = 0; i<=12;i++){
    pieces[i] = new Image()
    pieces[i].src = `./pieces/${i}.png`.toString()
}

bot.on("ready", () => {
    console.log('Je suis pr\xEAt \xE0 \xEAtre utilis\xE9 !, '+ bot.user.tag);
});

bot.on("messageCreate", async (message) => {
    console.log(message.content);
	if (message.content.startsWith(config.bot.prefix) && !message.author.bot ) {

		const args = message.content.slice(config.bot.prefix.length).trim().split(/ +/g);
		const command = args.shift().toLowerCase();

		switch (command) {
            case "ping":
                message.reply("Pong!");
            break;
        }
    }

    if (message.content == "game") {
        for (let i = 0;i<games.games.size();i++){
            if (games.games[i].j1 == message.author.id.toString()){

            }else if (games.games[i].j2 == message.author.id.toString()){

            }
        }
    }

    if (message.content == "board") {
        generateBoard(message.author.id)
        
        message.channel.send({
            files: [{
                attachment: `./boards/board${message.author.id}.png`,
                name: 'board.png',
                description: 'Plateau de Jeu'
            }]
        })
    }
})

function generateBoard(gameID){
    const board = createCanvas(config.board.size,config.board.size)
    const ctx = board.getContext("2d")

    ctx.beginPath()
    ctx.fillStyle = "green"
    ctx.fillRect(0,0,board.width,board.height)
    ctx.lineWidth = board.width/20
    ctx.strokeStyle = "orange"
    ctx.rect(board.width/10,board.height/10,8*board.width/10,8*board.height/10)
    ctx.stroke()
    for (let x=0;x<8;x++){
        for (let y=0;y<8;y++){
            if ((x+y)%2==1){
                ctx.fillStyle = "white"
            }else{
                ctx.fillStyle = "black"
            }

            ctx.fillRect((x+1)*(board.width/10),(y+1)*(board.height/10),board.width/10,board.height/10)

            ctx.drawImage(pieces[games.default[y][x]],board.width/10*(1+x),board.height/10*(1+y),board.width/10,board.height/10)
        }
    }

    fs.readFile(`./boards/board${gameID}.png`, 'utf8', (err, data) => {
        const content = data;
        //console.log(content);
    })

    const buffer = board.toBuffer("image/png");
    fs.writeFileSync(`./boards/board${gameID}.png`, buffer);
}

bot.login(process.env.BOT_TOKEN)