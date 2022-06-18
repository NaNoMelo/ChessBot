games = require("./games.json")

const verifyMove = function (gameID, player, move) {
    let state = 0
    if ((games.games[gameID].board[move[1]][move[0]] % 2) + 1 == player) {
        movement = [move[2] - move[0], move[3] - move[1]]
        switch (games.games[gameID].board[move[1][move[0]]]) {
            case (1, 2): //pion
                break

            case (3, 4): //fou
                if (Math.abs(movement[0]) == Math.abs(movement[1])) {
                    for (let i = 1; i < Math.abs(movement[0]); i++) {
                        if (games.games[gameID].board[move[1] + i * Math.sign(movement[1])][move[0] + i * Math.sign(movement[0])] != 0) {
                            state = 1
                        }
                    }
                } else {
                    state = 1
                }
                break

            case (5, 6): //tour
                if (((Math.abs(movement[0]) > 0 && Math.abs(movement[1]) == 0)) || (Math.abs(movement[1]) > 0 && Math.abs(movement[0]) == 0)) {
                    for (let i = 1; i < Math.abs(movement[0]) + Math.abs(movement[1]); i++) {
                        if (games.games[gameID].board[move[1] + i * Math.sign(movement[1])][move[0] + i * Math.sign(movement[0])] !=0) {
                            state = 1
                        }
                    }
                } else {
                    state = 1
                }
                break
            case (7, 8): //cavalier
                if (Math.abs(movement[0]) + Math.abs(movement[1]) == 3 && (Math.abs(movement[0]) == 2 || Math.abs(movement[1]) == 2)) {
                    state = 0
                } else {
                    state = 1
                }
                break

            case (9, 10):
                break

            case (11, 12):
                break
        }
    } else {
        state = 2
    }
}

const move = function (gameID, player, move) {}

module.exports = {
    verifyMove: verifyMove,
    move: move
}
