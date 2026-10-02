const playBoard = document.getElementById("playBoard");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const restartBtn = document.getElementById("restartBtn");

const gameOverBox = document.getElementById("gameOver");
const finalScore = document.getElementById("finalScore");
const playAgainBtn = document.getElementById("playAgainBtn");

let foodX, foodY;
let snakeX = 5;
let snakeY = 10;

let velocityX = 0;
let velocityY = 0;

let snakeBody = [];
let gameInterval = null;
let score = 0;
let gameRunning = false;
let paused = false;

let highScore = localStorage.getItem("snakeHighScore") || 0;
highScoreElement.innerText = highScore;

// Food Position
function changeFoodPosition() {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Direction Change
function changeDirection(e) {

    const key = e.key || e;

    if (key === "ArrowUp" && velocityY !== 1) {
        velocityX = 0;
        velocityY = -1;
    }

    else if (key === "ArrowDown" && velocityY !== -1) {
        velocityX = 0;
        velocityY = 1;
    }

    else if (key === "ArrowLeft" && velocityX !== 1) {
        velocityX = -1;
        velocityY = 0;
    }

    else if (key === "ArrowRight" && velocityX !== -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

// Game Over
function gameOver() {

    clearInterval(gameInterval);
    gameRunning = false;

    finalScore.innerText = score;
    gameOverBox.style.display = "block";
}

// Main Game
function initGame() {

    if (paused) return;

    // Food Eat
    if (snakeX === foodX && snakeY === foodY) {

        changeFoodPosition();

        snakeBody.push([foodX, foodY]);

        score++;
        scoreElement.innerText = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("snakeHighScore", highScore);
            highScoreElement.innerText = highScore;
        }
    }

    // Move Body
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX += velocityX;
    snakeY += velocityY;

    // Wall Collision
    if (
        snakeX <= 0 ||
        snakeX > 30 ||
        snakeY <= 0 ||
        snakeY > 30
    ) {
        return gameOver();
    }

    let html = `<div class="food" style="grid-area:${foodY}/${foodX};"></div>`;

    // Snake Head
    html += `<div class="head" style="grid-area:${snakeY}/${snakeX};"></div>`;

    // Snake Body
    for (let i = 0; i < snakeBody.length; i++) {

        if (
            i !== 0 &&
            snakeBody[0][0] === snakeBody[i][0] &&
            snakeBody[0][1] === snakeBody[i][1]
        ) {
            return gameOver();
        }

        html += `<div class="body" style="grid-area:${snakeBody[i][1]}/${snakeBody[i][0]};"></div>`;
    }

    playBoard.innerHTML = html;
}

// Start Game
function startGame() {

    if (gameRunning) return;

    gameRunning = true;

    velocityX = 1;
    velocityY = 0;

    changeFoodPosition();

    gameInterval = setInterval(initGame, 120);
}

// Pause Game
function pauseGame() {

    if (!gameRunning) return;

    paused = !paused;

    pauseBtn.innerText = paused ? "Resume" : "Pause";
}

// Restart Game
function restartGame() {

    clearInterval(gameInterval);

    snakeX = 5;
    snakeY = 10;

    velocityX = 1;
    velocityY = 0;

    snakeBody = [];

    score = 0;

    scoreElement.innerText = score;

    paused = false;

    pauseBtn.innerText = "Pause";

    gameOverBox.style.display = "none";

    changeFoodPosition();

    gameRunning = true;

    gameInterval = setInterval(initGame, 120);
}

// Keyboard Controls
document.addEventListener("keydown", changeDirection);

// Mobile Controls
document.querySelectorAll(".mobile-controls button").forEach(btn => {

    btn.addEventListener("click", () => {
        changeDirection(btn.dataset.key);
    });

});

// Buttons
startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", pauseGame);
restartBtn.addEventListener("click", restartGame);
playAgainBtn.addEventListener("click", restartGame);