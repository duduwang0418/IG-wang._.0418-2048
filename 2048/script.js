const gridContainer = document.querySelector('.grid-container');
const scoreDisplay = document.querySelector('.score');
let score = 0;
let grid = [];
let previousGrid = [];
let previousScore = 0;

function initializeGrid() {
    grid = Array(4).fill(null).map(() => Array(4).fill(0));
    previousGrid = grid.map(row => [...row]);
    previousScore = score;
    addRandomTile();
    addRandomTile();
    renderGrid();
}

function addRandomTile() {
    let emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    if (emptyCells.length > 0) {
        const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        grid[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
    }
}

function renderGrid() {
    gridContainer.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const cellValue = grid[i][j];
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            if (cellValue > 0) {
                cell.textContent = cellValue;
                cell.classList.add(`value-${cellValue}`);
            }
            gridContainer.appendChild(cell);
        }
    }
    scoreDisplay.textContent = score;
}

function moveTiles(direction) {
    previousGrid = grid.map(row => [...row]);
    previousScore = score;
    let hasChanged = false;
    if (direction === 'up') {
        for (let j = 0; j < 4; j++) {
            const column = [];
            for (let i = 0; i < 4; i++) {
                if (grid[i][j] !== 0) {
                    column.push(grid[i][j]);
                }
            }
            const mergedColumn = mergeTiles(column);
            for (let i = 0; i < 4; i++) {
                grid[i][j] = mergedColumn[i] || 0;
            }
        }
    } else if (direction === 'down') {
        for (let j = 0; j < 4; j++) {
            const column = [];
            for (let i = 3; i >= 0; i--) {
                if (grid[i][j] !== 0) {
                    column.push(grid[i][j]);
                }
            }
            const mergedColumn = mergeTiles(column);
            for (let i = 3; i >= 0; i--) {
                grid[i][j] = mergedColumn[3 - i] || 0;
            }
        }
    } else if (direction === 'left') {
        for (let i = 0; i < 4; i++) {
            const row = [];
            for (let j = 0; j < 4; j++) {
                if (grid[i][j] !== 0) {
                    row.push(grid[i][j]);
                }
            }
            const mergedRow = mergeTiles(row);
            for (let j = 0; j < 4; j++) {
                grid[i][j] = mergedRow[j] || 0;
            }
        }
    } else if (direction === 'right') {
        for (let i = 0; i < 4; i++) {
            const row = [];
            for (let j = 3; j >= 0; j--) {
                if (grid[i][j] !== 0) {
                    row.push(grid[i][j]);
                }
            }
            const mergedRow = mergeTiles(row);
            for (let j = 3; j >= 0; j--) {
                grid[i][j] = mergedRow[3 - j] || 0;
            }
        }
    }
    
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] !== 0) {
                hasChanged = true;
                break;
            }
        }
        if (hasChanged) break;
    }

    if (hasChanged) {
        addRandomTile();
        renderGrid();
    }
    if (isGameOver()) {
        displayGameOver();
    }
}

function undoMove() {
    grid = previousGrid.map(row => [...row]);
    score = previousScore;
    renderGrid();
}

function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (grid[i][j] === 0) {
                return false;
            }
            if (i < 3 && grid[i][j] === grid[i + 1][j]) {
                return false;
            }
            if (j < 3 && grid[i][j] === grid[i][j + 1]) {
                return false;
            }
        }
    }
    return true;
}

function displayGameOver() {
    let gameOverDiv = document.querySelector('.game-over-dialog');
    if (!gameOverDiv) {
        gameOverDiv = document.createElement('div');
        gameOverDiv.classList.add('game-over-dialog');
        const gameOverText = document.createElement('p');
        gameOverText.textContent = 'Game Over!';
        gameOverDiv.appendChild(gameOverText);
        const restartButton = document.createElement('button');
        restartButton.textContent = 'Restart';
        restartButton.addEventListener('click', restartGame);
        gameOverDiv.appendChild(restartButton);
        document.body.appendChild(gameOverDiv);
    }
}

function restartGame() {
    const gameOverDiv = document.querySelector('.game-over-dialog');
    if (gameOverDiv) {
        gameOverDiv.remove();
    }
    document.removeEventListener('keydown', restartGame);
    initializeGrid();
}

function mergeTiles(line) {
    if (line.length < 2) return line;
    const mergedLine = [];
    let skip = false;
    for (let i = 0; i < line.length; i++) {
        if (skip) {
            skip = false;
            continue;
        }
        if (i < line.length - 1 && line[i] === line[i + 1]) {
            mergedLine.push(line[i] * 2);
            score += line[i] * 2;
            skip = true;
        } else {
            mergedLine.push(line[i]);
        }
    }
    while (mergedLine.length < 4) {
        mergedLine.push(0);
    }
    return mergedLine;
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            moveTiles('up');
            break;
        case 'ArrowDown':
            moveTiles('down');
            break;
        case 'ArrowLeft':
            moveTiles('left');
            break;
        case 'ArrowRight':
            moveTiles('right');
            break;
        case 'z':
            undoMove();
            break;
    }
});

initializeGrid();
