/*

    Baseline score starts at 50.
    If we get above 50, player X is winning
    If we get below 50, player O is winning

    Defensive Zones
    - If player X is at or above 70, O should priortize defense
        - look for any move that will let X win and block it
    - If player X is at 60
        - look for a move that will decrease this move by at least
          10. If there is a move that will decrease it by more than 20,
          prioritize that


    Offensenive Zones
    - If score is at 50 or below, look for a move that will decrease
     this score
        - If score is at 50, we can make any random move
        - If score is below 50, look for a move that will decrease this score


*/
class AI {
    constructor() {

        this.score = 50; // baseline. > 50 O is winning. < 50 x is winning
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ]
        this.mode = "neutral"; // "neutral" | "defense" | "attack"
        this.turnCount = 0;
        this.decisions = { tempScore: 50, attack: {}, defense: {} }
    }


    /*

        let board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]

    */


    makeMove() {
        const possibleRoutes = [
            [[0, 0], [0, 1], [0, 2]], // Top Row - 0
            [[1, 0], [1, 1], [1, 2]], // Middle Row - 1
            [[2, 0], [2, 1], [2, 2]], // Bottom Row - 2
            [[0, 0], [1, 0], [2, 0]],// Left Column - 3
            [[0, 1], [1, 1], [2, 1]], // Middle Column - 4
            [[0, 2], [1, 2], [2, 2]], // Right Column - 5
            [[0, 0], [1, 1], [2, 2]], // Top Left diagonal - 6
            [[0, 2], [1, 1], [2, 0]] // Top Right Diagonal - 7
        ];


        //  0       1     2      3      4       5      6     7
        // TRows, MRows, BRows, LCols, MCols, RCols, LDiag, RDiag,

        // if we are in defense mode, get the direction we care about
        if (this.mode === "defense") {
            let posibilities = [];
            for (let option of possibleRoutes[this.decisions.defense.index]) {
                let [x, y] = option;
                if (this.board[x][y] === null) {
                    posibilities.push([x, y])
                }
            }
            return this.getRandomItem(posibilities);
        }
        // if we are in attack mode, get the directions we care about
        if (this.mode === "attack") {
            let posibilities = [];
            for (let option of possibleRoutes[this.decisions.attack.index]) {
                let [x, y] = option;
                if (this.board[x][y] === null) {
                    posibilities.push([x, y])
                }
            }
            return this.getRandomItem(posibilities);
        }
        // if we are in neutral mode, get a random open space
        if (this.mode === "neutral") {
            let possibleSelections = [];
            for (let i = 0; i < this.board.length; i++) {
                for (let j = 0; j < this.board[i].length; j++) {
                    if (this.board[i][j] === null) {
                        possibleSelections.push([i, j]);
                    }
                }
            }
            return this.getRandomItem(possibleSelections);

        }


    }

    analyzeMove(player, board) {
        this.turnCount++;
        this.board = board; // updates the AI's knowledge
        if (player === 1) {
            // update the score
            let decisions = this.scoreCheck();
            // check how player 1's move affected the score
            if (this.turnCount > 2) { // starts the game off in neutral
                if (decisions.tempScore > this.score) {
                    this.mode = "defense";
                } else if (decisions.tempScore < this.score) {
                    this.mode = "attack";
                } else {
                    this.mode = "neutral";
                }
                this.decisions = decisions;
            }

        }

    }

    scoreCheck() {

        let b = this.board;

        let rowScores = [];

        // checks rows
        for (let row of b) {
            let rowScore = 0;
            let filled = true;
            for (let el of row) {
                if (el === 1) rowScore += 10;
                if (el === 2) rowScore -= 10;
                if (el === null) filled = false;
            }
            let scoreObj = {
                score: rowScore,
                filled
            }
            rowScores.push(scoreObj);
        }


        let colScores = [
            { score: 0, filled: true },
            { score: 0, filled: true },
            { score: 0, filled: true },
        ];


        // checks cols
        for (let i = 0; i < b.length; i++) {
            for (let j = 0; j < b[i].length; j++) {
                if (b[j][i] === null) colScores[i].filled = false;
                if (b[j][i] === 1) colScores[i].score += 10;
                if (b[j][i] === 2) colScores[i].score -= 10;

            }
        }

        // check leftDiagonal
        let leftDiagonal = { score: 0, filled: true };

        for (let i = 0; i < b.length; i++) {

            if (b[i][i] === null) leftDiagonal.filled = false;
            if (b[i][i] === 1) leftDiagonal.score += 10;
            if (b[i][i] === 2) leftDiagonal.score -= 10;

        }

        // check rightDiagonal
        let rightDiagonal = { score: 0, filled: true };

        let j = b.length - 1;
        for (let i = 0; i < b.length; i++) {
            if (b[i][j] === null) rightDiagonal.filled = false;
            if (b[i][j] === 1) rightDiagonal.score += 10;
            if (b[i][j] === 2) rightDiagonal.score -= 10;
            j--;

        }

        // TRows, MRows, BRows, LCols, MCols, RCols, LDiag, RDiag,
        const bData = [...rowScores, ...colScores, leftDiagonal, rightDiagonal]

        let tempScore = 50;
        for (let data of bData) {
            if (!data.filled) tempScore += data.score;
        }



        const decisions = { tempScore };

        let minAttack = Infinity;
        let maxDef = -Infinity;
        for (let i = 0; i < bData.length; i++) {
            let data = bData[i];
            if (data.score >= maxDef) {
                maxDef = data.score;
                decisions.defense = { score: maxDef, index: i }
            }
            if (data.score <= minAttack) {
                minAttack = data.score;
                decisions.attack = { score: minAttack, index: i }
            }
        }

        return decisions;

    }

    // random functionality
    getRandomItem(el, el2) {
        if (el instanceof Array) {
            return el[Math.floor(Math.random() * el.length)];
        } else if (typeof el === 'string') {
            return el[Math.floor(Math.random() * el.length)];
        } else if (el instanceof Object) {
            const keys = Object.keys(el);

            const key = keys[Math.floor(Math.random() * keys.length)];

            return el[key];
        } else if (el2) {
            if (el2 > el) {
                return Math.floor(Math.random() * (el2 - el + 1) + el);
            } else {
                return Math.floor(Math.random() * (el - el2 + 1) + el2);
            }
        }
        else if (!el) {
            return Math.floor(Math.random() * 100);
        }
    }


}

class Match {
    constructor(){
        this.board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];

        this.winner = null;

        this.moves = [];
    }

    addMove(move, player){
        let moveObj = {
            coord: move.coord,
            player,
        }
        this.moves.push(moveObj);
        this.board = move.board;
    }

    addWinner(player, board, bot){
        this.winner = player;
        this.board = board;

    }

    getOutCome(){
        return {
            board: this.board,
            winner: this.winner,
            moves: this.moves
        };
    }
}


class Move {
    constructor(player, placementLocation){
        this.player = player;
        this.coord = this.makeCoordinate(placementLocation);
    }

    makeCoordinate(num){
        if (num === 0) return [0,0];
        if (num === 1) return [0,1];
        if (num === 2) return [0,2];
        if (num === 3) return [1,0];
        if (num === 4) return [1,1];
        if (num === 5) return [1,2];
        if (num === 6) return [2,0];
        if (num === 7) return [2,1];
        if (num === 8) return [2,2];
    }

    getCoordinate(){
        return this.coord;
    }


}

export  {AI, Match, Move};
