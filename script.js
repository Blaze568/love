const game = document.getElementById('game');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start');
const winPage = document.getElementById('winPage');
const losePage = document.getElementById('losePage');
const finalScoreDisplay = document.getElementById('finalScore');
const tryAgainButtons = document.querySelectorAll('.tryAgain');

let score = 0;
let timeLeft = 20;
let timer;
let gameActive = false;

startButton.addEventListener('click', startGame);
tryAgainButtons.forEach(button => {
    button.addEventListener('click', resetGame);
});

function startGame() {
    if (gameActive) return;
    gameActive = true;
    score = 0;
    timeLeft = 20;
    scoreDisplay.textContent = `Hearts: ${score}/20`;
    startButton.disabled = true;
    game.innerHTML = '';
    winPage.style.display = 'none';
    losePage.style.display = 'none';
    
    // Start timer
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        if (timeLeft <= 0) {
            endGame(false);
        }
    }, 1000);

    // Spawn hearts
    const heartInterval = setInterval(() => {
        if (!gameActive) {
            clearInterval(heartInterval);
            return;
        }
        createHeart();
    }, 500);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    heart.style.left = `${Math.random() * (game.offsetWidth - 30)}px`;
    heart.style.top = `${Math.random() * (game.offsetHeight - 30)}px`;
    
    // Make hearts move
    const moveX = (Math.random() - 0.5) * 5;
    const moveY = (Math.random() - 0.5) * 5;
    
    heart.addEventListener('click', () => {
        if (!gameActive) return;
        score++;
        scoreDisplay.textContent = `Hearts: ${score}/20`;
        heart.style.transform = 'scale(1.5)';
        setTimeout(() => heart.remove(), 200);
        if (score >= 20) {
            endGame(true);
        }
    });

    game.appendChild(heart);

    // Animate floating
    let posX = parseFloat(heart.style.left);
    let posY = parseFloat(heart.style.top);
    const floatHeart = setInterval(() => {
        posX += moveX;
        posY += moveY;
        heart.style.left = `${posX}px`;
        heart.style.top = `${posY}px`;

        // Bounce off walls
        if (posX <= 0 || posX >= game.offsetWidth - 30) moveX *= -1;
        if (posY <= 0 || posY >= game.offsetHeight - 30) moveY *= -1;
    }, 50);

    // Remove heart after 3 seconds if not clicked
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
            clearInterval(floatHeart);
        }
    }, 3000);
}

function endGame(win) {
    gameActive = false;
    clearInterval(timer);
    startButton.disabled = false;

    if (win) {
        winPage.style.display = 'flex';
    } else {
        finalScoreDisplay.textContent = score;
        losePage.style.display = 'flex';
    }
}

function resetGame() {
    winPage.style.display = 'none';
    losePage.style.display = 'none';
    startGame();
}