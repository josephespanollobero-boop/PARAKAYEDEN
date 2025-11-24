// Simple magic word functionality with progressive clues
const correctMagicWord = "Pachini";
let wrongAttempts = 0;

const clues = [
    "Try again! 💖",
    "Clue: Its a nickname",
    "Clue: Naasar ka pag naririnig mo to",
    "Clue: Chimpanzini Bananini", 
    "Clue: One of my favorite body part mo and its a nickname"
];

const magicWordInput = document.getElementById('magicWordInput');

// Check magic word when Enter is pressed
magicWordInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkMagicWord();
    }
});

function checkMagicWord() {
    const inputValue = magicWordInput.value.trim();
    
    // Check if input is empty
    if (inputValue === "") {
        showWrongModal();
        return;
    }
    
    // Check if magic word is correct
    if (inputValue.toLowerCase() === correctMagicWord.toLowerCase()) {
        document.getElementById('welcomeModal').style.display = 'flex';
        magicWordInput.value = "";
        wrongAttempts = 0; // Reset attempts when correct
    } else {
        showWrongModal();
    }
}

function showWrongModal() {
    const clueIndex = Math.min(wrongAttempts, clues.length - 1);
    
    document.getElementById('wrongTitle').textContent = 'Oops! Wrong magic word, babi 😭';
    document.getElementById('wrongClue').textContent = clues[clueIndex];
    document.getElementById('wrongModal').style.display = 'flex';
    
    wrongAttempts++;
    magicWordInput.value = "";
}

function closeModal() {
    document.getElementById('wrongModal').style.display = 'none';
}

// ============ BACKGROUND MUSIC MANAGEMENT ============
const backgroundMusic = document.getElementById('backgroundMusic');
let backgroundMusicPosition = 0;

// Save background music position before pausing
backgroundMusic.addEventListener('pause', function() {
    backgroundMusicPosition = this.currentTime;
});

function startTicTacToe() {
    document.getElementById('welcomeModal').style.display = 'none';
    document.getElementById('page1').style.display = 'none';
    document.getElementById('ticTacToePage').style.display = 'flex';
    
    // Initialize Tic Tac Toe game
    initTicTacToe();
}

function continueToMainPage() {
    document.getElementById('winModal').style.display = 'none';
    document.getElementById('ticTacToePage').style.display = 'none';
    document.getElementById('page2').style.display = 'block';
    
    // Start background music
    backgroundMusic.currentTime = backgroundMusicPosition;
    backgroundMusic.play().catch(e => console.log('Autoplay prevented'));
    
    // Initialize floating images on Page 2 with higher z-index
    createFloatingImages();
}

function restartTicTacToe() {
    document.getElementById('loseModal').style.display = 'none';
    restartGame();
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Remove active class from all nav buttons
    const navBtns = document.querySelectorAll('.nav-btn');
    navBtns.forEach(btn => btn.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Scroll to the section smoothly with offset
    setTimeout(() => {
        const yOffset = -20;
        const y = targetSection.getBoundingClientRect().top + window.pageYOffset + yOffset;
        
        window.scrollTo({
            top: y,
            behavior: 'smooth'
        });
    }, 100);
}

function showLoveMessage() {
    const message = document.getElementById('loveMessage');
    message.style.display = 'block';
    message.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============ IMPROVED MUSIC PLAYER ============
let currentSongAudio = null;
let currentPlayButton = null;

function toggleMusic(button) {
    const player = button.closest('.music-player');
    const songPath = player.dataset.song;
    
    // Check if this is the currently playing song
    const isCurrentSong = currentSongAudio && currentSongAudio.src === new URL(songPath, location.href).href;
    
    // If clicking on a different song
    if (currentSongAudio && !isCurrentSong) {
        // Pause current song and save position
        pauseCurrentSong();
        
        // Create new audio for the new song
        createNewAudioElement(songPath, button);
        return;
    }
    
    // If no song is loaded yet
    if (!currentSongAudio) {
        createNewAudioElement(songPath, button);
        return;
    }
    
    // Toggle play/pause for current song
    if (currentSongAudio.paused) {
        playCurrentSong(button);
    } else {
        pauseCurrentSong();
    }
}

function createNewAudioElement(songPath, button) {
    // Pause background music
    backgroundMusicPosition = backgroundMusic.currentTime;
    backgroundMusic.pause();
    
    // Create new audio element
    currentSongAudio = new Audio(songPath);
    currentPlayButton = button;
    
    const player = button.closest('.music-player');
    const progressBar = player.querySelector('.progress-bar');
    
    // Setup event listeners
    currentSongAudio.addEventListener('timeupdate', function() {
        if (currentSongAudio.duration) {
            const progress = (this.currentTime / this.duration) * 100;
            progressBar.style.width = progress + '%';
        }
    });
    
    currentSongAudio.addEventListener('ended', function() {
        button.textContent = '▶';
        button.classList.remove('playing');
        progressBar.style.width = '0%';
        currentSongAudio = null;
        currentPlayButton = null;
        
        // Resume background music
        resumeBackgroundMusic();
    });
    
    // Play the song
    currentSongAudio.play().catch(e => console.log('Play failed:', e));
    button.textContent = '⏸';
    button.classList.add('playing');
}

function playCurrentSong(button) {
    backgroundMusicPosition = backgroundMusic.currentTime;
    backgroundMusic.pause();
    
    currentSongAudio.play().catch(e => console.log('Play failed:', e));
    button.textContent = '⏸';
    button.classList.add('playing');
}

function pauseCurrentSong() {
    if (currentPlayButton) {
        currentPlayButton.textContent = '▶';
        currentPlayButton.classList.remove('playing');
    }
    
    if (currentSongAudio) {
        currentSongAudio.pause();
    }
    
    // Resume background music from where it was paused
    resumeBackgroundMusic();
}

function resumeBackgroundMusic() {
    backgroundMusic.currentTime = backgroundMusicPosition;
    backgroundMusic.play().catch(e => console.log('Background music resume failed'));
}

// ============ GALLERY IMAGE MODAL ============
function openImageModal(imageSrc, caption) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    
    modal.style.display = 'flex';
    modalImg.src = imageSrc;
    modalCaption.textContent = caption;
}

function closeImageModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// ============ GALLERY CAPTION EDITING ============
function editGalleryCaption(captionElement) {
    const currentText = captionElement.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'gallery-text-input';
    
    // Replace caption with input
    captionElement.textContent = '';
    captionElement.appendChild(input);
    captionElement.classList.add('editable');
    input.focus();
    input.select();
    
    function saveCaption() {
        const newText = input.value.trim() || currentText;
        captionElement.textContent = newText;
        captionElement.classList.remove('editable');
        
        // Save to localStorage
        const galleryId = captionElement.closest('.gallery-item').dataset.id;
        localStorage.setItem(`gallery_caption_${galleryId}`, newText);
    }
    
    input.addEventListener('blur', saveCaption);
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            saveCaption();
        }
    });
}

// Load saved gallery captions
function loadGalleryCaptions() {
    document.querySelectorAll('.gallery-item').forEach(item => {
        const galleryId = item.dataset.id;
        const savedCaption = localStorage.getItem(`gallery_caption_${galleryId}`);
        const captionElement = item.querySelector('.gallery-caption');
        
        if (savedCaption && captionElement) {
            captionElement.textContent = savedCaption;
        }
    });
}

// ============ FLOATING IMAGES ON PAGE 2 ============
function createFloatingImages() {
    const container = document.getElementById('floatingImages');
    
    // Clear existing images to prevent duplicates
    container.innerHTML = '';
    
    // Array of your imgur image links
    const imgurLinks = [
        'https://i.imgur.com/O8fXzXk.jpeg',
        'https://i.imgur.com/QmkSyUt.jpeg',
        'https://i.imgur.com/DY9WW9r.jpeg',
        'https://i.imgur.com/QmkSyUt.jpeg',
        'https://i.imgur.com/DY9WW9r.jpeg'
    ];
    
    // Make floating images appear on top
    container.style.zIndex = '100';
    
    // Create multiple floating images
    for (let i = 0; i < 8; i++) {
        const img = document.createElement('img');
        img.className = 'floating-img';
        img.src = imgurLinks[i % imgurLinks.length];
        img.alt = 'Floating image ' + (i + 1);
        
        // Random position
        img.style.left = Math.random() * 90 + '%';
        img.style.top = Math.random() * 90 + '%';
        
        // Random animation delay and duration
        img.style.animationDelay = Math.random() * 5 + 's';
        img.style.animationDuration = (Math.random() * 4 + 6) + 's';
        
        // Add swipe functionality
        let startX, startY;
        
        img.addEventListener('mousedown', (e) => {
            startX = e.clientX;
            startY = e.clientY;
        });
        
        img.addEventListener('mouseup', (e) => {
            const diffX = e.clientX - startX;
            const diffY = e.clientY - startY;
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);
            
            if (distance > 50) {
                img.classList.add('swiped');
                setTimeout(() => {
                    img.remove();
                }, 600);
            }
        });
        
        // Touch events for mobile
        img.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        img.addEventListener('touchend', (e) => {
            const diffX = e.changedTouches[0].clientX - startX;
            const diffY = e.changedTouches[0].clientY - startY;
            const distance = Math.sqrt(diffX * diffX + diffY * diffY);
            
            if (distance > 50) {
                img.classList.add('swiped');
                setTimeout(() => {
                    img.remove();
                }, 600);
            }
        });
        
        container.appendChild(img);
    }
}

// ============ TIC TAC TOE GAME ============

let boxEls;
let statusEl;
let restartBtnEl;

// Images stay the same, but names change
let eden = "<img src='https://i.imgur.com/QmkSyUt.jpeg'>";   // X = Eden
let joseph = "<img src='https://i.imgur.com/Hehe6OE.jpeg'>"; // O = Joseph

const win = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,5],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];

let options = ["","","","","","","","",""];

// Player logic
let currentPlayer = eden; 
let player = "Eden";  // YOU are controlling Eden (X)
let running = false;

function initTicTacToe() {
    boxEls = document.querySelectorAll('.box');
    statusEl = document.querySelector('.status');
    restartBtnEl = document.querySelector('.restartBtn');
    
    boxEls.forEach(box => box.addEventListener('click', boxClick));
    restartBtnEl.addEventListener('click', restartGame);
    statusEl.textContent = `Turn: ${player}`;
    running = true;
}

// MAIN CLICK HANDLER
function boxClick(e) {
    let box = e.target;

    // Fix: Always refer to .box
    if (box.tagName === "IMG") {
        box = box.parentElement;
    }

    const index = box.dataset.index;

    // Only allow user (Eden) to move
    if (options[index] !== "" || !running || player !== "Eden") return;

    updateBox(box, index);
    checkWinner();

    if (running) {
        setTimeout(aiMove, 300); // Joseph (AI) move
    }
}

function updateBox(box, index) {
    options[index] = player;
    box.innerHTML = currentPlayer;
}

function changePlayer() {
    if (player === "Eden") {
        player = "Joseph";
        currentPlayer = joseph;
    } else {
        player = "Eden";
        currentPlayer = eden;
    }

    statusEl.textContent = `Turn: ${player}`;
    statusEl.style.color = "#FF1493";
}

function restartGame() {
    options = ["","","","","","","","",""];
    currentPlayer = eden;
    player = "Eden";
    running = true;

    statusEl.textContent = `Turn: ${player}`;
    statusEl.style.color = "#FF1493";
    restartBtnEl.textContent = "Restart 🔁";

    boxEls.forEach(box => {
        box.innerHTML = "";
        box.classList.remove('win');
    });
}

// ---------------- AI SYSTEM ------------------

function aiMove() {
    if (!running || player !== "Joseph") return;

    const smart = Math.random() < 0.5;
    let moveIndex;

    if (smart) {
        moveIndex = findWinningMove("Joseph");
        if (moveIndex === null) moveIndex = findWinningMove("Eden");
        if (moveIndex === null) moveIndex = randomMove();
    } else {
        moveIndex = randomMove();
    }

    options[moveIndex] = "Joseph";
    boxEls[moveIndex].innerHTML = joseph;

    checkWinner();
}

function randomMove() {
    const empty = getEmptyIndexes();
    return empty[Math.floor(Math.random() * empty.length)];
}

function getEmptyIndexes() {
    return options
        .map((v, i) => v === "" ? i : null)
        .filter(v => v !== null);
}

function findWinningMove(name) {
    for (let combo of win) {
        const [a, b, c] = combo;
        const vals = [options[a], options[b], options[c]];

        const count = vals.filter(v => v === name).length;
        const emptySpot = vals.indexOf("");

        if (count === 2 && emptySpot !== -1) {
            return combo[emptySpot];
        }
    }
    return null;
}

// ---------------------------------------------

function checkWinner() {
    let isWon = false;
    let winnerName = null;

    for (let i = 0; i < win.length; i++) {
        const [a,b,c] = win[i];
        const v1 = options[a];
        const v2 = options[b];
        const v3 = options[c];

        if (v1 === "" || v2 === "" || v3 === "") continue;

        if (v1 === v2 && v2 === v3) {
            isWon = true;
            winnerName = v1;

            boxEls[a].classList.add('win');
            boxEls[b].classList.add('win');
            boxEls[c].classList.add('win');
        }
    }

    if (isWon) {
        running = false;

        if (winnerName === "Eden") {
            statusEl.textContent = `Eden wins! 💖`;
            statusEl.style.color = "green";

            setTimeout(() => {
                document.getElementById('winModal').style.display = 'flex';
            }, 1000);

        } else {
            statusEl.textContent = `Joseph wins 😢`;
            statusEl.style.color = "red";

            setTimeout(() => {
                document.getElementById('loseModal').style.display = 'flex';
            }, 1000);
        }
    } 
    
    else if (!options.includes("")) {
        statusEl.textContent = `Draw 💕`;
        statusEl.style.color = "#FF69B4";

        running = false;

        setTimeout(() => {
            document.getElementById('loseModal').style.display = 'flex';
        }, 1000);
    }
    
    else {
        changePlayer();
    }
}