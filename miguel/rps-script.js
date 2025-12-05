// Ambil elemen HTML
const userScoreSpan = document.getElementById('user-score');
const computerScoreSpan = document.getElementById('computer-score');
const messageElement = document.getElementById('message');

const rockButton = document.getElementById('rock');
const paperButton = document.getElementById('paper');
const scissorsButton = document.getElementById('scissors');

const choicesContainer = document.querySelectorAll('.choice-container');

// Tombol Reset BARU
const resetButton = document.getElementById('reset-game-button'); 

// Ambil elemen Jumpscare
const jumpscareContainer = document.getElementById('jumpscare-container');
const jumpscareAudio = document.getElementById('jumpscare-audio');

// Inisialisasi skor dan konstanta
let userScore = 0;
let computerScore = 0;
// --- MODIFIKASI KONSTANTA ---
const WINNING_SCORE = 3; 
// Konstanta ini TIDAK DIGUNAKAN lagi untuk penentuan kemenangan
const SCORE_DIFFERENCE = 0; 
let hasInteracted = false; 

messageElement.setAttribute('data-text', messageElement.textContent); 

function cleanUpGlows() {
    choicesContainer.forEach(container => {
        container.classList.remove('green-glow', 'red-glow', 'gray-glow');
    });
}

function enableAudio() {
    if (hasInteracted) return;
    
    jumpscareAudio.volume = 0; 
    jumpscareAudio.play().then(() => {
        jumpscareAudio.pause();
        jumpscareAudio.currentTime = 0;
        jumpscareAudio.volume = 1; 
        hasInteracted = true;
    }).catch(error => {
        hasInteracted = true;
    });

    rockButton.removeEventListener('click', enableAudio);
    paperButton.removeEventListener('click', enableAudio);
    scissorsButton.removeEventListener('click', enableAudio);
}

function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    const randomIndex = Math.floor(Math.random() * 3);
    return choices[randomIndex];
}

// FUNGSI BARU: Reset Permainan
function resetGame() {
    userScore = 0;
    computerScore = 0;
    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;
    
    // Aktifkan kembali semua tombol
    rockButton.disabled = false;
    paperButton.disabled = false;
    scissorsButton.disabled = false;
    
    // Bersihkan efek akhir game
    document.body.classList.remove('win-background', 'system-failure'); 
    messageElement.classList.remove('glitch-text', 'win', 'lose', 'draw');
    messageElement.textContent = 'Pilih salah satu di bawah ini!'; 
    
    // Sembunyikan tombol reset
    resetButton.classList.remove('show');
    resetButton.classList.add('hide');

    cleanUpGlows();
}

// FUNGSI MODIFIKASI: Menangani akhir game
function endGame(status) {
    let finalMessage = '';
    const body = document.body;

    // Nonaktifkan semua tombol pilihan
    rockButton.disabled = true;
    paperButton.disabled = true;
    scissorsButton.disabled = true;
    
    // Tampilkan Tombol Reset
    resetButton.classList.remove('hide');
    resetButton.classList.add('show');


    if (status === 'win') {
        // ... Logika Kemenangan (Jumpscare, Confetti) ...
        
        // 1. Lakukan cleanup DULU
        body.classList.remove('corrupted-page', 'system-failure'); 
        body.classList.remove('win-background');
        messageElement.classList.remove('glitch-text');

        // 2. Tampilkan Jumpscare Visual
        jumpscareContainer.classList.add('show');
        
        // 3. Mainkan Suara
        jumpscareAudio.currentTime = 0;
        jumpscareAudio.play().catch(error => {}); 
        
        // 4. Hilangkan Jumpscare, tampilkan Konfeti, dan UBAH LATAR BELAKANG menjadi KUNING setelah 800ms
        setTimeout(() => {
            jumpscareContainer.classList.remove('show');
            
            body.classList.add('win-background');

            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 150, 
                    spread: 100,      
                    origin: { y: 0.6 } 
                });
            }

            finalMessage = 'ANDA MENANG! Kemenangan yang Mengejutkan. Klik "Mulai Game Baru".';
            messageElement.textContent = finalMessage;
            messageElement.className = 'message win';
        }, 800); 

        messageElement.textContent = 'MOMEN KRITIS...'; 
        
    } else {
        // KASUS KALAH: SYSTEM FAILURE (GLITCH)

        // 1. Lakukan cleanup DULU
        body.classList.remove('corrupted-page', 'system-failure'); 
        body.classList.remove('win-background');
        messageElement.classList.remove('glitch-text');

        finalMessage = 'ANDA DIKALAHKAN OLEH AI. SISTEM GAGAL. Klik "Mulai Game Baru" untuk me-reset.';
        
        // 2. Efek System Failure Diterapkan
        body.classList.add('system-failure'); 
        messageElement.classList.add('glitch-text'); 
        
        messageElement.textContent = finalMessage;
        messageElement.className = 'message lose';
    }
}

// --- MODIFIKASI FUNGSI INI ---
function checkWinCondition() {
    // Menang jika skor mencapai 3, tanpa melihat selisih skor
    if (userScore >= WINNING_SCORE) {
        endGame('win');
    } else if (computerScore >= WINNING_SCORE) {
        endGame('lose');
    }
}
// --- AKHIR MODIFIKASI FUNGSI INI ---

function game(userChoice) {
    if (rockButton.disabled) return; 

    cleanUpGlows(); 

    const computerChoice = getComputerChoice();
    const result = userChoice + computerChoice;

    let outcomeMessage = '';
    let messageClass = '';
    let userGlowClass = '';
    
    const userChoiceElement = document.getElementById(userChoice.charAt(0)); 

    switch (result) {
        case 'rockscissors':
        case 'paperrock':
        case 'scissorspaper':
            userScore++;
            outcomeMessage = `Anda menang! ${userChoice} mengalahkan ${computerChoice}.`;
            messageClass = 'win';
            userGlowClass = 'green-glow';
            break;
        
        case 'scissorsrock':
        case 'rockpaper':
        case 'paperscissors':
            computerScore++;
            outcomeMessage = `Anda kalah! ${computerChoice} mengalahkan ${userChoice}.`;
            messageClass = 'lose';
            userGlowClass = 'red-glow';
            break;
        
        case 'rockrock':
        case 'paperpaper':
        case 'scissorsscissors':
            outcomeMessage = `Seri! Keduanya memilih ${userChoice}.`;
            messageClass = 'draw';
            userGlowClass = 'gray-glow';
            break;
    }

    userScoreSpan.textContent = userScore;
    computerScoreSpan.textContent = computerScore;

    messageElement.textContent = outcomeMessage;
    messageElement.className = 'message ' + messageClass;
    
    userChoiceElement.classList.add(userGlowClass);

    checkWinCondition(); 
}

// Tambahkan event listener untuk interaksi pertama dan game utama
rockButton.addEventListener('click', enableAudio);
paperButton.addEventListener('click', enableAudio);
scissorsButton.addEventListener('click', enableAudio);

rockButton.addEventListener('click', () => game('rock'));
paperButton.addEventListener('click', () => game('paper'));
scissorsButton.addEventListener('click', () => game('scissors'));

// PENTING: Tambahkan event listener untuk Tombol Reset
resetButton.addEventListener('click', resetGame);