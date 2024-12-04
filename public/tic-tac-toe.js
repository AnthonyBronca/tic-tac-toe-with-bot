window.addEventListener("DOMContentLoaded", () => {

    // Globals
    let currentTurn = 1; // 1 -> X, 2 -> O
    let hasWinner = false;
    let startingTurn = 1;
    let hasTie = false;
    let insertCount = 0;
    let xWinCount = 0;
    let oWinCount = 0;
    let tieCount = 0;


    let board = [
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ]

    // Selectors
    const squares = document.getElementsByClassName("square");
    const newGameBtn = document.getElementById("new-game-btn");
    const giveUpBtn = document.getElementById("give-up-btn");
    const resetBtn = document.getElementById("reset-btn");

    const xWins = document.getElementById("x-wins");
    const oWins = document.getElementById("o-wins");
    const ties = document.getElementById("ties");
    const gameStatus = document.getElementById("game-status");



    // functions

    const setLeaderBoardOnLoad = () => {
        if(sessionStorage.getItem("leaderboard")){
            let leaderBoard = sessionStorage.getItem("leaderboard");
            // set scores
            const leaderBoardArr = leaderBoard.split("-");
            const [x,o,t] = leaderBoardArr;
            xWins.innerText = `X Wins: ${x[1]}`;
            oWins.innerText = `O Wins: ${o[1]}`;
            ties.innerText = `Ties: ${t[1]}`;
            xWinCount = x[1];
            oWinCount = o[1];
            tieCount = t[1];


        } else {
            sessionStorage.setItem("leaderboard", "x0-o0-t0");
        }
    }

    const insertIntoBoard = (i) => {
        insertCount++;
        if (i === 0) {
            board[0][0] = currentTurn;
            return checkWinCondition(board, [0, 0]);
        }
        if (i === 1) {
            board[0][1] = currentTurn;
            return checkWinCondition(board, [0, 1]);
        }
        if (i === 2) {
            board[0][2] = currentTurn;
            return checkWinCondition(board, [0, 2]);
        }
        if (i === 3) {
            board[1][0] = currentTurn;
            return checkWinCondition(board, [1, 0]);
        }
        if (i === 4) {
            board[1][1] = currentTurn;
            return checkWinCondition(board, [1, 1]);
        }
        if (i === 5) {
            board[1][2] = currentTurn;
            return checkWinCondition(board, [1, 2]);
        }
        if (i === 6) {
            board[2][0] = currentTurn;
            return checkWinCondition(board, [2, 0]);
        }
        if (i === 7) {
            board[2][1] = currentTurn;
            return checkWinCondition(board, [2, 1]);
        }
        if (i === 8) {
            board[2][2] = currentTurn;
            return checkWinCondition(board, [2, 2]);
        }
    }

    const getBoardItem = (i) => {
        if (i === 0) return board[0][0];
        if (i === 1) return board[0][1];
        if (i === 2) return board[0][2];
        if (i === 3) return board[1][0];
        if (i === 4) return board[1][1];
        if (i === 5) return board[1][2];
        if (i === 6) return board[2][0];
        if (i === 7) return board[2][1];
        if (i === 8) return board[2][2];
    }


    const checkWinCondition = (board) => {


        // check rows
        if (board[0][0] === currentTurn && board[0][1] === currentTurn && board[0][2] === currentTurn) { // check top
            return true;
        } else if (board[1][0] === currentTurn && board[1][1] === currentTurn && board[1][2] === currentTurn) { // check middle
            return true;
        } else if (board[2][0] === currentTurn && board[2][1] === currentTurn && board[2][2] === currentTurn) { // check bottom
            return true;
        }

        // check cols
        if (board[0][0] === currentTurn && board[1][0] === currentTurn && board[2][0] === currentTurn) {
            return true;
        } else if (board[0][1] === currentTurn && board[1][1] === currentTurn && board[2][1] === currentTurn) {
            return true;
        } else if (board[0][2] === currentTurn && board[1][2] === currentTurn && board[2][2] === currentTurn) {
            return true;
        }


        // check right diagonal

        if (board[0][0] === currentTurn && board[1][1] === currentTurn && board[2][2] === currentTurn) {
            return true;
        }

        // check left diagonal
        if (board[0][2] === currentTurn && board[1][1] === currentTurn && board[2][0] === currentTurn) {
            return true;
        }
        if(insertCount === 9){
            hasTie = true;
            return false;
        }


        // check if there are any ties
        return false;

    }

    const changeTurn = () => {
        const gameStatus = document.getElementById("game-status");
        if (currentTurn === 1) {
            gameStatus.innerText = "O to Move";
            currentTurn = 2;
        } else {
            gameStatus.innerText = "X to Move";
            currentTurn = 1;
        }
    }


    // Event Listeners

    resetBtn.addEventListener("click", ()=> {
        // reset storage
        sessionStorage.setItem("leaderboard", "x0-o0-t0");
        currentTurn = 1;
        hasWinner = false;
        startingTurn = 1;
        insertCount = 0;
        xWinCount = 0;
        oWinCount = 0;
        tieCount = 0;
        xWins.innerText = "X Wins: 0";
        oWins.innerText = "O Wins: 0";
        ties.innerText = "Ties: 0";
        board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];

        gameStatus.innerText = "X to Move";



    })

    giveUpBtn.addEventListener("click", () => {
        if(!hasWinner && !hasTie){
            hasWinner = true;
            const gameStatus = document.getElementById("game-status");
            if (currentTurn === 1) {
                gameStatus.innerText = "O is the winner!";
                const oldText = oWins.innerText;
                const oldTextArr = oldText.split(": ");
                oldTextArr[1] =  parseInt(oldTextArr[1]) + 1;
                const newText = oldTextArr.join(": ");
                oWins.innerText = newText;
                oWinCount++;
            } else {
                gameStatus.innerText = "X is the winner!";
                const oldText = xWins.innerText;
                const oldTextArr = oldText.split(": ");
                oldTextArr[1] = parseInt(oldTextArr[1]) + 1;
                const newText = oldTextArr.join(": ");
                xWins.innerText = newText;
                xWinCount++;
            }
            sessionStorage.setItem("leaderboard", `x${xWinCount}-o${oWinCount}-t${tieCount}`);
        }

    })

    newGameBtn.addEventListener("click", () => {
        // reset board
        board = [
            [null, null, null],
            [null, null, null],
            [null, null, null],
        ];
        // reset win status
        hasWinner = false;

        // reset and flip the starter turn
        if (startingTurn === 1){
            startingTurn = 2;
            currentTurn = 2;
        } else {
            startingTurn = 1;
            currentTurn = 1;
        }


        // reset the squares to be empty
        for (let i = 1; i < 10; i++) {
            let square = document.querySelector(`.board-square-${i}`);
            // make sure to only remove children from the nodes that have children
            if (square.children.length) {
                square.removeChild(square.children[0]);
            }
        }

        // reset insertCounter
        insertCount = 0;
        // reset tie text
        hasTie = false;
        const gameStatus = document.getElementById("game-status");
        if(startingTurn === 1 ){
            gameStatus.innerText = "X to Move";
        } else {
            gameStatus.innerText = "O to Move";
        }


    })



    for (let i = 0; i < squares.length; i++) {
        const square = squares[i];


        square.addEventListener("click", () => {
            if (!hasWinner) {
                if (getBoardItem(i) === null) { // checks if we have a playable square
                    const newSpan = document.createElement("span");
                    newSpan.id = "game-status";
                    if (currentTurn === 2) {
                        newSpan.innerText = "O";
                    }
                    if (currentTurn === 1) {
                        newSpan.innerText = "X";
                    }
                    const didWin = insertIntoBoard(i);
                    square.appendChild(newSpan);
                    if (didWin) {
                        hasWinner = true;
                        if (currentTurn === 2) {
                            const oldText = oWins.innerText;
                            const oldTextArr = oldText.split(": ");
                            oldTextArr[1] = parseInt(oldTextArr[1]) + 1;
                            const newText = oldTextArr.join(": ");
                            oWins.innerText = newText;
                        }

                        if(currentTurn === 1){
                                const oldText = xWins.innerText;
                                const oldTextArr = oldText.split(": ");
                                oldTextArr[1] = parseInt(oldTextArr[1]) + 1;
                                const newText = oldTextArr.join(": ");
                                xWins.innerText = newText;
                        }
                        const gameStatus = document.getElementById("game-status");
                        if (currentTurn === 2) {
                            gameStatus.innerText = "O is the winner!";
                            oWinCount++;
                        } else {
                            xWinCount++;
                            gameStatus.innerText = "X is the winner!";
                        }

                        sessionStorage.setItem("leaderboard", `x${xWinCount}-o${oWinCount}-t${tieCount}`);


                    } else {
                        if(hasTie){
                            tieCount++;
                            const gameStatus = document.getElementById("game-status");
                            gameStatus.innerText = "There was a tie!!"
                            const oldText = ties.innerText;
                            const oldTextArr = oldText.split(": ");
                            oldTextArr[1] = parseInt(oldTextArr[1]) + 1;
                            const newText = oldTextArr.join(": ");
                            ties.innerText = newText;
                            hasWinner = true;
                            sessionStorage.setItem("leaderboard", `x${xWinCount}-o${oWinCount}-t${tieCount}`);
                        } else{
                            changeTurn();
                        }
                    }
                }
            }
        });

    }

    // runs on start
    setLeaderBoardOnLoad();

})
