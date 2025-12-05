const board = document.getElementById('game-board');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const messageDisplay = document.getElementById('game-message');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
// Variabel countdown telah DIHAPUS

const EMOJIS = ['🐹', '🐭', '🐰', '🦊', '🐻', '🐼'];
const TOTAL_TIME = 30;
const HOLE_COUNT = 9; 

let score = 0;
let timeLeft = TOTAL_TIME;
let timerId = null;
let popTimerId = null;
let gameActive = false;

// --- FUNGSI UTAMA ---

function initBoard() {
    board.innerHTML = '';
    for (let i = 0; i < HOLE_COUNT; i++) {
        const hole = document.createElement('div');
        hole.classList.add('mole-hole');
        
        const mole = document.createElement('div');
        mole.classList.add('mole');
        mole.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        mole.addEventListener('click', whack); 

        hole.appendChild(mole);
        board.appendChild(hole);
    }
}

function randomTime(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function randomHole() {
    const holes = document.querySelectorAll('.mole-hole');
    const randomIndex = Math.floor(Math.random() * holes.length);
    return holes[randomIndex].querySelector('.mole');
}

function popUpMole() {
    if (!gameActive) return;

    const mole = randomHole();
    
    if (mole.classList.contains('up')) {
        setTimeout(popUpMole, 100); 
        return;
    }

    mole.classList.add('up');

    const time = randomTime(500, 1500); 
    
    setTimeout(() => {
        mole.classList.remove('up');
        mole.classList.remove('hit');
        
        if (gameActive) {
            popTimerId = setTimeout(popUpMole, randomTime(500, 1000));
        }
    }, time);
}

function startTimer() {
    timeLeft = TOTAL_TIME;
    timeDisplay.textContent = timeLeft;
    
    timerId = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerId);
            clearTimeout(popTimerId);
            gameOver();
        }
    }, 1000);
}

function whack(event) {
    if (!gameActive || event.target.classList.contains('hit')) return;
    
    score++;
    scoreDisplay.textContent = score;
    
    event.target.classList.add('hit');
    event.target.classList.remove('up'); 
    
    event.target.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
}

function gameOver() {
    gameActive = false;
    messageDisplay.textContent = `WAKTU HABIS! Skor Akhir Anda: ${score}`;
    restartButton.classList.remove('hide');
    
    document.querySelectorAll('.mole').forEach(mole => {
        mole.classList.remove('up');
        mole.classList.remove('hit');
    });
}

// FUNGSI INI KEMBALI MENGGANTIKAN startGameCountdown()
function startGame() {
    if (gameActive) return;

    initBoard(); 
    score = 0;
    scoreDisplay.textContent = score;
    messageDisplay.textContent = "PUKUL MEREKA SEBANYAK MUNGKIN!";
    
    startButton.classList.add('hide');
    restartButton.classList.add('hide');
    
    gameActive = true;
    startTimer();
    popUpMole();
}


// --- EVENT LISTENERS ---
// Tombol Mulai/Main Lagi sekarang memanggil startGame()
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

// Inisialisasi awal
initBoard();