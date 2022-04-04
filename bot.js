const { Client, Intents } = require("discord.js");
const { createCanvas, loadImage, Canvas } = require('canvas')
const config = require("./config.json");
const fs = require('fs')

const bot = new Client({intents:[Intents.FLAGS.GUILDS,Intents.FLAGS.GUILD_MESSAGES]});

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

    if (message.content == "image") {
        message.channel.send({
            files: [{
                attachment: './chesscom_pawn.png',
                name: 'chesscom_pawn.png',
                description: 'Une image'
              }]
        })
    }

    if (message.content == "board") {
        generateBoard(message.author.id)

        message.channel.send({
            files: [{
                attachment: `./boards/board${gameID}.png`,
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
        }
    }

    
    const out = fs.createWriteStream(`./boards/board${gameID}.png`)
    const stream = board.createPNGStream()
    stream.pipe(out)
    out.on('finish', () =>  console.log('The PNG file was created.'))
}

bot.login(config.bot.token)