const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 400; // Set the new width
const canvasHeight = 500; // Set the new height
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const numColumns = 8; // Adjust the number of columns as needed
const blockWidth = canvasWidth / numColumns; // Width of each block
const blockHeight = 20; // Height of each block

let currentRow = canvasHeight - blockHeight; // Start from the bottom
let currentPosition = 1; // Start from column 1
let direction = 1; // Moving direction
let currentStackWidth = 3; // Stack width starts with 3 cubes
let speed = 200; // Speed of movement
let stack = [];
let score = 0; // Initialize score

const scoreHeight = 40; // Height reserved for score display

// Modified drawBlock function to create three separate cubes
function drawBlock(x, y, width) {
    ctx.fillStyle = 'red';
    const sectionWidth = blockWidth; // Each cube occupies the full width of one column

    for (let i = 0; i < width; i++) {
        ctx.fillRect(x + i * sectionWidth, y, sectionWidth, blockHeight);
    }

    // Draw black outlines for the cubes
    ctx.strokeStyle = 'black'; // Color for the outlines
    ctx.lineWidth = 2; // Width of the outlines

    for (let i = 0; i < width; i++) {
        ctx.strokeRect(x + i * sectionWidth, y, sectionWidth, blockHeight);
    }
}

// Function to display the score on the canvas
function drawScore() {
    // Clear the area where the score is displayed
    ctx.clearRect(0, 0, canvasWidth, scoreHeight); // Clear the score area

    ctx.fillStyle = 'white'; // Color for the score text
    ctx.font = '20px Arial'; // Font style
    ctx.textAlign = 'left'; // Align text to the left
    ctx.textBaseline = 'top'; // Align text to the top
    const scoreText = 'Score: ' + score;

    // Draw the score text with some padding
    ctx.fillText(scoreText, 10, 10); // Position the score text with padding
}

function clearRow(y) {
    ctx.clearRect(0, y, canvasWidth, blockHeight);
}

function moveBlock() {
    clearRow(currentRow); // Clear the row before moving

    if (currentPosition <= 0 || currentPosition + currentStackWidth > numColumns) {
        direction *= -1; // Change direction when hitting the edge
    }

    currentPosition += direction; // Move the block

    drawBlock(currentPosition * blockWidth, currentRow, currentStackWidth);
    drawScore(); // Draw the score after moving the block
}

function stackBlock() {
    stack.push({ x: currentPosition, width: currentStackWidth });
    if (stack.length > 1) {
        const lastStack = stack[stack.length - 2];
        if (currentPosition !== lastStack.x) {
            const overlap = Math.min(currentPosition + currentStackWidth, lastStack.x + lastStack.width) - Math.max(currentPosition, lastStack.x);
            if (overlap <= 0) {
                gameOver();
                return;
            }
            currentStackWidth = overlap;
            currentPosition = Math.max(currentPosition, lastStack.x);
        }
    }

    drawBlock(currentPosition * blockWidth, currentRow, currentStackWidth);
    
    // Increase score when a block is stacked successfully
    score += 10; // Adjust the score increment as needed
    
    // Set the maximum score to 220
    if (score > 220) {
        score = 220;
    }

    drawScore(); // Update the score display

    if (currentRow <= scoreHeight) { // Adjusted to account for the score area
        win();
        return;
    }

    currentRow -= blockHeight; // Move to the next row
}

function gameOver() {
    alert('Game Over! Your score: ' + score);
    resetGame();
}

function win() {
    alert('You Win! Your score: ' + score);
    resetGame();
}

function resetGame() {
    currentRow = canvasHeight - blockHeight;
    currentPosition = 1;
    currentStackWidth = 3; // Reset to 3 cubes
    stack = [];
    score = 0; // Reset the score
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawScore(); // Draw the initial score
}

document.addEventListener('keydown', (e) => {
    if (e.key === ' ') {
        stackBlock(); // Stack the block when spacebar is pressed
    }
});

function gameLoop() {
    moveBlock();
    setTimeout(gameLoop, speed);
}

drawScore(); // Initial score display
gameLoop();
