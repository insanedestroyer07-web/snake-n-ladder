// Game Constants
const BOARD_SIZE = 100;
const WINNING_POSITION = 100;

// Snakes: key is head, value is tail
const snakes = {
    17: 4,
    54: 31,
    62: 19,
    87: 48,
    93: 73,
    99: 79
};

// Ladders: key is base, value is top
const ladders = {
    3: 22,
    5: 14,
    9: 31,
    20: 38,
    32: 42,
    51: 67,
    72: 91,
    78: 98
};

// Game State
let player1Pos = 1;
let player2Pos = 1;
let currentPlayer = 1;
let gameActive = true;
let diceRolled = false;

// Initialize the game
function initGame() {
    createBoard();
    updatePlayerPositions();
    updateMessage();
}

// Create the game board
function createBoard() {
    const board = document.getElementById('gameBoard');
    board.innerHTML = '';

    // Create cells in reverse order for proper board layout
    for (let i = 100; i >= 1; i--) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = `cell-${i}`;

        let cellContent = i;
        if (snakes[i]) {
            cell.classList.add('snake');
            cellContent = `🐍${i}→${snakes[i]}`;
        } else if (ladders[i]) {
            cell.classList.add('ladder');
            cellContent = `🪜${i}→${ladders[i]}`;
        }

        cell.innerHTML = cellContent;
        board.appendChild(cell);
    }
}

// Roll the dice
function rollDice() {
    if (!gameActive || diceRolled) return;

    const diceValue = Math.floor(Math.random() * 6) + 1;
    diceRolled = true;

    // Animate dice
    const diceDisplay = document.getElementById('diceDisplay');
    diceDisplay.style.animation = 'none';
    setTimeout(() => {
        diceDisplay.style.animation = 'roll-animation 0.6s ease';
    }, 10);

    // Update dice display
    document.getElementById('diceValue').textContent = `Rolled: ${diceValue}`;

    // Move player
    setTimeout(() => {
        movePlayer(diceValue);
        diceRolled = false;
        checkWin();
        switchPlayer();
        updateMessage();
        updatePlayerButtons();
    }, 600);
}

// Move player to new position
function movePlayer(diceValue) {
    const currentPos = currentPlayer === 1 ? player1Pos : player2Pos;
    let newPos = currentPos + diceValue;

    // Check if move is valid (can't go beyond 100)
    if (newPos > BOARD_SIZE) {
        document.getElementById('diceValue').textContent += ' - Cannot move beyond 100, stay at ' + currentPos;
        return;
    }

    // Check for snake
    if (snakes[newPos]) {
        const tail = snakes[newPos];
        document.getElementById('diceValue').textContent += ` 🐍 Snake! Move from ${newPos} to ${tail}`;
        newPos = tail;
    }

    // Check for ladder
    if (ladders[newPos]) {
        const top = ladders[newPos];
        document.getElementById('diceValue').textContent += ` 🪜 Ladder! Move from ${newPos} to ${top}`;
        newPos = top;
    }

    // Update player position
    if (currentPlayer === 1) {
        player1Pos = newPos;
    } else {
        player2Pos = newPos;
    }

    updatePlayerPositions();
}

// Update player positions on board
function updatePlayerPositions() {
    // Clear all player markers
    document.querySelectorAll('.cell').forEach(cell => {
        cell.classList.remove('player1', 'player2');
    });

    // Place players
    const cell1 = document.getElementById(`cell-${player1Pos}`);
    const cell2 = document.getElementById(`cell-${player2Pos}`);

    if (cell1) cell1.classList.add('player1');
    if (cell2) cell2.classList.add('player2');

    // Update position display
    document.getElementById('player1Pos').textContent = player1Pos;
    document.getElementById('player2Pos').textContent = player2Pos;
}

// Check if a player has won
function checkWin() {
    if (player1Pos === WINNING_POSITION) {
        document.getElementById('message').textContent = '🎉 Player 1 Wins! 🎉';
        gameActive = false;
        return true;
    }

    if (player2Pos === WINNING_POSITION) {
        document.getElementById('message').textContent = '🎉 Player 2 Wins! 🎉';
        gameActive = false;
        return true;
    }

    return false;
}

// Switch to next player
function switchPlayer() {
    if (!gameActive) return;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
}

// Update message display
function updateMessage() {
    const messageEl = document.getElementById('message');
    if (gameActive) {
        messageEl.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Update button states
function updatePlayerButtons() {
    const player1Btn = document.getElementById('player1Btn');
    const player2Btn = document.getElementById('player2Btn');

    player1Btn.disabled = currentPlayer !== 1 || !gameActive;
    player2Btn.disabled = currentPlayer !== 2 || !gameActive;

    document.getElementById('player1Info').classList.toggle('active', currentPlayer === 1);
    document.getElementById('player2Info').classList.toggle('active', currentPlayer === 2);

    if (currentPlayer === 1) {
        player1Btn.classList.add('btn-active');
        player2Btn.classList.remove('btn-active');
    } else {
        player1Btn.classList.remove('btn-active');
        player2Btn.classList.add('btn-active');
    }
}

// Reset the game
function resetGame() {
    player1Pos = 1;
    player2Pos = 1;
    currentPlayer = 1;
    gameActive = true;
    diceRolled = false;
    document.getElementById('diceValue').textContent = 'Roll the dice!';
    document.getElementById('diceDisplay').textContent = '🎲';
    updatePlayerPositions();
    updateMessage();
    updatePlayerButtons();
}

// Event listeners
document.getElementById('player1Btn').addEventListener('click', rollDice);
document.getElementById('player2Btn').addEventListener('click', rollDice);

// Initialize game on page load
window.addEventListener('load', initGame);
