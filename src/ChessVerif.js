const verifyPiece = function (gameID, player, move) {
    let verif = 0
    movement = [move[2] - move[0], move[3] - move[1]]
    switch (games.games[gameID].board[move[1][move[0]]]) {
        case (1, 2): //pion
            verif = verifPion(gameID, player, move, movement)
            break

        case (3, 4): //fou
            verif = verifFou(gameID, player, move, movement)
            break

        case (5, 6): //tour
            verif = verifTour(gameID, player, move, movement)
            break
        case (7, 8): //cavalier
            verif = verifCavalier(gameID, player, move, movement)
            break

        case (9, 10): //dame
            verif = verifDame(gameID, player, move, movement)
            break

        case (11, 12): //roi
            verif = verifRoi(gameID, player, move, movement)
            break
    }
}

const verifPion = function (gameID, player, move, movement) {

}

const verifFou = function (gameID, player, move, movement) {
    let fou = 0
    if (Math.abs(movement[0]) == Math.abs(movement[1])) {
        for (let i = 1; i < Math.abs(movement[0]); i++) {
            if (games.games[gameID].board[move[1] + i * Math.sign(movement[1])][move[0] + i * Math.sign(movement[0])] != 0) {
                fou = 5
            }
        }
    } else {
        fou = 4
    }
    return fou
}

const verifTour = function (gameID, player, move, movement) {
    let tour = 0
    if (Math.abs(movement[0]) == 0 || Math.abs(movement[1]) == 0) {
        for (let i = 1; i < Math.abs(movement[0]) + Math.abs(movement[1]); i++) {
            if (games.games[gameID].board[move[1] + i * Math.sign(movement[1])][move[0] + i * Math.sign(movement[0])] != 0) {
                tour = 5
            }
        }
    } else {
        tour = 4
    }
    return tour
}

const verifCavalier = function (gameID, player, move, movement) {
    let cavalier = 0
    if (!(Math.abs(movement[0]) + Math.abs(movement[1]) == 3 && (Math.abs(movement[0]) == 2 || Math.abs(movement[1]) == 2))) {
        cavalier = 4
    }
    return cavalier
}

const verifDame = function (gameID, player, move, movement) {
    let dame, tour = verifTour(gameID, player, move, movement), fou = verifFou(gameID, player, move, movement)
    if (!tour || !fou) {
        dame = 0
    } else if (tour > fou) {
        dame = tour
    } else dame = fou
    return dame
}

const verifRoi = function (gameID, player, move, movement) {
    let roi = 0
    if (!(Math.abs(movement[0]) <= 1 && Math.abs(movement[1]) <= 1)) {
        roi = 4
    }
    return roi
}

