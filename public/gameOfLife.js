const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 15;
const rows = 60;
const cols = 60;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

let grid = createGrid(rows, cols);
initializeGrid(grid);

function createGrid(rows, cols) {
    return new Array(rows).fill(null).map(() => new Array(cols).fill(0));
}

function initializeGrid(grid) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Randomly set cells to be alive
            grid[row][col] = Math.random() > 0.7 ? 1 : 0; // Adjust the threshold to change the density of alive cells
        }
    }
}

function drawGrid(grid) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            ctx.beginPath();
            ctx.rect(col * cellSize, row * cellSize, cellSize, cellSize);
            ctx.fillStyle = grid[row][col] ? 'black' : 'white';
            ctx.fill();
        }
    }
}

function updateGrid(grid) {
    const newGrid = grid.map(arr => [...arr]);
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const neighbors = countNeighbors(grid, row, col);
            if (grid[row][col] === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[row][col] = 0;
            } else if (grid[row][col] === 0 && neighbors === 3) {
                newGrid[row][col] = 1;
            }
        }
    }
    return newGrid;
}

function countNeighbors(grid, x, y) {
    let count = 0;
    for (let row = -1; row <= 1; row++) {
        for (let col = -1; col <= 1; col++) {
            if (row === 0 && col === 0) continue;
            const newRow = x + row;
            const newCol = y + col;
            if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
                count += grid[newRow][newCol];
            }
        }
    }
    return count;
}

function gameLoop() {
    grid = updateGrid(grid);
    drawGrid(grid);
    setTimeout(gameLoop, 110); // Adjust the delay (in milliseconds) to control the speed of the game
}

drawGrid(grid);
setTimeout(gameLoop, 300); // Start the game loop with an initial delay
