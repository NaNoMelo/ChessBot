const fs = require("fs")
const { Image, Canvas } = require("canvas")
const path = require("path")
const config = require(`${process.cwd()}/config.json`)
const glob = require("glob")

const CouleurPiece = Object.freeze({
    VIDE: 0,
    BLANC: 1,
    NOIR: 2
})

const TypePiece = Object.freeze({
    VIDE: 0,
    PION: 1,
    FOU: 2,
    TOUR: 3,
    CAVALIER: 4,
    DAME: 5,
    ROI: 6
})

class Piece {
    constructor(typePiece, couleurPiece) {
        this.typePiece = typePiece
        this.couleurPiece = couleurPiece
        this.turns = 0
    }
}
Object.assign

const pieces = []
for (let i = 0; i < 3; i++) {
    pieces[i] = new Array(8)
}

for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 7; j++) {
        pieces[i][j] = new Image
        pieces[i][j].src = path.join(process.cwd(), "src", "pieces", i.toString(), `${j}.png`)
        console.log(path.join(process.cwd(), "src", "pieces", i.toString(), `${j}.png`))
    }
}
console.log(pieces)

class Game {
    constructor(j1ID, j2ID) {
        this.board = []
        for (let i = 0; i < 8; i++) {
            this.board.push([])
        }
        this.fillBoard()
        this.turns = 0
        this.j1 = j1ID
        this.j2 = j2ID
        setTimeout(() => {
            this.showBoard()
        }, 2000)

        //console.log(fs.writeFileSync("./src/classes/games.json", JSON.stringify(this, null, 4)))
    }

    async fillBoard() {
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                switch (y) {
                    case 0, 7:
                        let c = y == 0 ? 1 : 2
                        switch (x) {
                            case 0, 7:
                                this.board[x][y] = new Piece(TypePiece.TOUR, c)
                                break;
                            case 1, 6:
                                this.board[x][y] = new Piece(TypePiece.CAVALIER, c)
                                break;
                            case 2, 5:
                                this.board[x][y] = new Piece(TypePiece.FOU, c)
                                break;
                            case 3:
                                this.board[x][y] = new Piece(TypePiece.DAME, c)
                                break;
                            case 4:
                                this.board[x][y] = new Piece(TypePiece.ROI, c)
                                break;
                        }
                        break
                    case 1:
                        this.board[x][y] = new Piece(TypePiece.PION, CouleurPiece.NOIR)
                        break;
                    case 6:
                        this.board[x][y] = new Piece(TypePiece.PION, CouleurPiece.BLANC)
                        break
                    default:
                        this.board[x][y] = new Piece(TypePiece.VIDE, CouleurPiece.VIDE)
                        break
                }
            }
        }
    }

    showBoard() {
        let player = 1, gameID = 1
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
                        pieces[this.board[x][y].CouleurPiece][this.board[x][y].typePiece],
                        (board.width / 10) * (1 + x),
                        (board.height / 10) * (1 + y),
                        board.width / 10,
                        board.height / 10
                    )
                } else {
                    ctx.drawImage(
                        pieces[this.board[x][y].CouleurPiece][this.board[x][y].typePiece],
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
}


module.exports = {
    CouleurPiece,
    TypePiece,
    Piece,
    Game
}