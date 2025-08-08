// --- Get HTML Elements ---
// The canvas is where the game is drawn
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI elements for score and game over screen
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

// --- Game Constants (you can tweak these to change difficulty) ---
const FISH_WIDTH = 60;
const FISH_HEIGHT = 40;
const GRAVITY = 0.35;       // How fast the fish falls
const LIFT = -7;            // How high the fish "wiggles" up on a click/press
const OBSTACLE_WIDTH = 80;
const OBSTACLE_GAP = 220;   // The vertical gap between the coral pipes
const OBSTACLE_SPEED = 3.5;   // How fast the obstacles move to the left
const OBSTACLE_INTERVAL = 100; // How often new obstacles are created (in frames)

// --- Game State Variables ---
// The fish object holds its position and velocity
let fish = {
    x: 150,
    y: canvas.height / 2,
    velocityY: 0
};

let obstacles = [];      // An array to hold all the on-screen obstacles
let score = 0;           // The player's current score
let frameCount = 0;      // A counter that increases every frame, used for timing
let gameIsOver = false;  // A flag to check if the game is running or over

// --- Core Game Functions ---

// Function to draw the fish on the canvas
function drawFish() {
    ctx.fillStyle = '#FFD700'; // Goldfish color
    ctx.beginPath();
    // Use ellipse to create a simple, cute fish shape
    ctx.ellipse(fish.x, fish.y, FISH_WIDTH / 2, FISH_HEIGHT / 2, 0, 0, 2 * Math.PI);
    ctx.fill();

    // Add a simple eye
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(fish.x + 15, fish.y - 5, 4, 0, 2 * Math.PI);
    ctx.fill();
}

// Function to draw all the coral obstacles
function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.fillStyle = '#228B22'; // ForestGreen for the coral
        // Draw the top coral pipe (pointing down)
        ctx.fillRect(obstacle.x, 0, OBSTACLE_WIDTH, obstacle.topHeight);
        // Draw the bottom coral pipe (pointing up)
        ctx.fillRect(obstacle.x, canvas.height - obstacle.bottomHeight, OBSTACLE_WIDTH, obstacle.bottomHeight);
    });
}

// Function to create a new pair of obstacles at the edge of the screen
function createObstacle() {
    // Randomly calculate the height of the top pipe
    const topHeight = Math.random() * (canvas.height - OBSTACLE_GAP - 100) + 50;
    // The bottom pipe's height is determined by the top one and the gap
    const bottomHeight = canvas.height - topHeight - OBSTACLE_GAP;

    obstacles.push({
        x: canvas.width,
        topHeight: topHeight,
        bottomHeight: bottomHeight,
        passed: false // A flag to check if the fish has passed this obstacle for scoring
    });
}

// Function to update the game state on each new frame
function update() {
    if (gameIsOver) return; // If the game is over, stop updating

    // --- Apply Physics to the Fish ---
    fish.velocityY += GRAVITY; // Apply gravity to make the fish fall
    fish.y += fish.velocityY;    // Update the fish's vertical position

    // --- Manage Obstacles ---
    frameCount++;
    // Every `OBSTACLE_INTERVAL` frames, create a new obstacle
    if (frameCount % OBSTACLE_INTERVAL === 0) {
        createObstacle();
    }

    // Move every obstacle to the left
    obstacles.forEach(obstacle => {
        obstacle.x -= OBSTACLE_SPEED;
    });
    // Remove obstacles that have moved off-screen to save memory
    obstacles = obstacles.filter(obstacle => obstacle.x + OBSTACLE_WIDTH > 0);

    // --- Collision Detection ---
    // Check for collision with the floor or ceiling
    if (fish.y + FISH_HEIGHT / 2 > canvas.height || fish.y - FISH_HEIGHT / 2 < 0) {
        endGame();
    }

    // Check for collision with any of the obstacles
    obstacles.forEach(obstacle => {
        if (
            // The fish is within the horizontal bounds of the obstacle
            fish.x + FISH_WIDTH / 2 > obstacle.x &&
            fish.x - FISH_WIDTH / 2 < obstacle.x + OBSTACLE_WIDTH &&
            // And the fish is hitting either the top OR bottom pipe
            (fish.y - FISH_HEIGHT / 2 < obstacle.topHeight || fish.y + FISH_HEIGHT / 2 > canvas.height - obstacle.bottomHeight)
        ) {
            endGame();
        }
    });

    // --- Update Score ---
    // Check if the fish has successfully passed an obstacle
    obstacles.forEach(obstacle => {
        if (!obstacle.passed && obstacle.x + OBSTACLE_WIDTH < fish.x) {
            score++;
            obstacle.passed = true;
            scoreDisplay.textContent = `Score: ${score}`;
        }
    });
}

// Function to draw everything onto the canvas
function draw() {
    // Clear the entire canvas on each frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw the fish and the obstacles
    drawFish();
    drawObstacles();
}

// The main game loop that runs continuously
function gameLoop() {
    update(); // Update game logic
    draw();   // Draw the result
    if (!gameIsOver) {
        // If the game isn't over, request the next frame to continue the loop
        requestAnimationFrame(gameLoop);
    }
}

// Function to handle what happens when the game ends
function endGame() {
    gameIsOver = true;
    gameOverScreen.classList.remove('hidden'); // Show the game over screen
    finalScoreDisplay.textContent = score;     // Display the final score
}

// Function to reset the game to its starting state
function resetGame() {
    // Reset all state variables to their initial values
    fish.y = canvas.height / 2;
    fish.velocityY = 0;
    obstacles = [];
    score = 0;
    frameCount = 0;
    gameIsOver = false;

    // Update the UI
    scoreDisplay.textContent = 'Score: 0';
    gameOverScreen.classList.add('hidden'); // Hide the game over screen
    
    // Start the game loop again
    gameLoop();
}

// --- Event Listeners for Player Input ---
function handlePlayerInput() {
    if (!gameIsOver) {
        fish.velocityY = LIFT; // Give the fish an upward boost
    }
}

// Listen for a spacebar press
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        handlePlayerInput();
    }
});

// Listen for a mouse click or a screen tap
canvas.addEventListener('mousedown', handlePlayerInput);

// Listen for a click on the restart button
restartButton.addEventListener('click', resetGame);


// --- Start the game! ---
// The initial call to start the game loop
gameLoop();