var userChoice;
var computerChoice;

document.getElementById("toggle").addEventListener("change", function () {
    userChoice = document.getElementById("toggle").checked ? "O" : "X";
    if (userChoice == "O"){
        computerChoice = "X";
    }else{
        computerChoice = "O";    
    }
})

let user = new Image();
user.src ="images/${userChoice}.png";

let computer = new Image();
computer.src ="images/${computerChoice}.png";

let board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

const cells = document.querySelectorAll(".grid-item");
const restartButton = document.querySelector(".restart");

cells.forEach((cell, index) => {
    cell.addEventListener("click", () => {
        let row = Math.floor(index / 3);
        let col = index % 3;
        playerMove(row, col, cell);
    });
});

restartButton.addEventListener("click", restartGame);

function checkWinner() {
    let winningCombos = [
        [[0, 0], [0, 1], [0, 2]], [[1, 0], [1, 1], [1, 2]], [[2, 0], [2, 1], [2, 2]],
        [[0, 0], [1, 0], [2, 0]], [[0, 1], [1, 1], [2, 1]], [[0, 2], [1, 2], [2, 2]],
        [[0, 0], [1, 1], [2, 2]], [[0, 2], [1, 1], [2, 0]]
    ];
    
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a[0]][a[1]] && board[a[0]][a[1]] === board[b[0]][b[1]] && board[a[0]][a[1]] === board[c[0]][c[1]]) {
            return board[a[0]][a[1]];
        }
    }
    
    if (board.flat().every(cell => cell !== '')) return 'draw';
    return null;
}

function minimax(board,depth,alpha,beta,isMaximizing){
    let result = checkWinner();
    if (result !== null) {
        if (result === computerChoice) return 10 - depth;
        if (result === userChoice) return depth - 10;
        return 0;
    }
    if (isMaximizing) {
        let maxEval = -Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = computerChoice;
                    let eval = minimax(board, depth + 1, alpha, beta, false);
                    board[i][j] = '';
                    maxEval = Math.max(maxEval, eval);
                    alpha = Math.max(alpha, eval);
                    if (beta <= alpha) break;
                }
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] === '') {
                    board[i][j] = userChoice;
                    let eval = minimax(board, depth + 1, alpha, beta, true);
                    board[i][j] = '';
                    minEval = Math.min(minEval, eval);
                    beta = Math.min(beta, eval);
                    if (beta <= alpha) break;
                }
            }
        }
        return minEval;
    }
}

function bestMove() {
    let bestScore = -Infinity;
    let move;
    
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] === '') {
                board[i][j] = computerChoice;
                let score = minimax(board, 0, -Infinity, Infinity, false);
                board[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = { i, j };
                }
            }
        }
    }
    
    if (move) {
        board[move.i][move.j] = computerChoice;
        updateBoard();
    }
}

function playerMove(row, col, cell) {
    if (board[row][col] === '') {
        board[row][col] = userChoice;
        updateBoard();
        let winner = checkWinner();
        if (winner) return endGame(winner);
        
        setTimeout(() => {
            bestMove();
            winner = checkWinner();
            if (winner) return endGame(winner);
        }, 500);
    }
}

function updateBoard() {
    cells.forEach((cell, index) => {
        let row = Math.floor(index / 3);
        let col = index % 3;
        let value = board[row][col];
        
        cell.innerHTML = '';
        if (value !== '') {
            let img = new Image();
            img.src = `images/${value}.png`;
            img.style.width = "100%";
            img.style.height = "100%";
            cell.appendChild(img);
        }
    });
}

function endGame(winner) {
    setTimeout(() => {
        alert(winner === 'draw' ? "It's a draw!" : `${winner} wins!`);
        restartGame();
    }, 100);
}

function restartGame() {
    board = [['', '', ''], ['', '', ''], ['', '', '']];
    updateBoard();
}

restartGame();
