const {Image, Canvas } = require("canvas")
const fs = require("fs")
const config = require("./config.json")
const games = require("./games.json")

let pieces = {}

for (let i = 0; i <= 12; i++) {
    pieces[i] = new Image()
    pieces[i].src = `./pieces/${i}.png`.toString()
}

const generateBoard = function (gameID, player) {
    const board = new Canvas(config.board.size, config.board.size)
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

            ctx.fillRect((x + 1) * (board.width / 10), (y + 1) * (board.height / 10), board.width / 10, board.height / 10)
        }
    }

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (player == 1) {
                ctx.drawImage(
                    pieces[games.games[gameID].board[y][x]],
                    (board.width / 10) * (1 + x),
                    (board.height / 10) * (1 + y),
                    board.width / 10,
                    board.height / 10
                )
            } else {
                ctx.drawImage(
                    pieces[games.games[gameID].board[y][x]],
                    (board.width / 10) * (8 - x),
                    (board.height / 10) * (8 - y),
                    board.width / 10,
                    board.height / 10
                )
            }
        }
    }

    const buffer = board.toBuffer("image/png")
    fs.writeFileSync(`./boards/board${gameID}_j${player}.png`, buffer)
}

module.exports = {
    generateBoard: generateBoard
}
