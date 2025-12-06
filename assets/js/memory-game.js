document.addEventListener('DOMContentLoaded', () => {
    // --- DOM ELEMENTS ---
    const boardContainer = document.getElementById('game-board');
    const difficultySelector = document.getElementById('difficulty-selector');
    const movesCount = document.getElementById('moves-count');
    const matchesCount = document.getElementById('matches-count');
    const startGameBtn = document.getElementById('start-game-btn');
    const restartGameBtn = document.getElementById('restart-game-btn');
    const winMessage = document.getElementById('win-message');
    const finalMovesSpan = document.getElementById('final-moves');

    // --- GAME DATA (USING RELIABLE BOOTSTRAP SYMBOLS) ---
    const cardIcons = [
        'bi-hammer', 
        'bi-wrench-adjustable', 
        'bi-compass', 
        'bi-rulers', 
        'bi-gear', 
        'bi-thermometer-half',
        'bi-diagram-3',
        'bi-lightning'
    ];
    
    // --- GAME STATE VARIABLES ---
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard = null;
    let secondCard = null;
    let totalMoves = 0;
    let matchedPairs = 0;
    let totalPairs = 0;
    
    // --- CONFIGURATION ---
    const difficultyConfigs = {
        'easy': { totalUniqueCards: 6, gridSize: '4x3', cardClass: 'easy-mode' }, // 12 cards
        'hard': { totalUniqueCards: 8, gridSize: '4x4', cardClass: 'hard-mode' }  // 16 cards
    };

    // --- HELPER FUNCTION: SHUFFLE ARRAY ---
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; 
        }
        return array;
    }

    // --- GAME INITIALIZATION ---
    function initializeGame() {
        const difficulty = difficultySelector.value;
        const config = difficultyConfigs[difficulty];
        const uniqueCards = cardIcons.slice(0, config.totalUniqueCards);
        
        cards = [...uniqueCards, ...uniqueCards];
        cards = shuffleArray(cards);
        totalPairs = config.totalUniqueCards;
        
        totalMoves = 0;
        matchedPairs = 0;
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        
        updateStats();
        winMessage.style.display = 'none';
        
        // Render the board
        renderBoard(config.cardClass);
        
        // Initial state: Disable cards until 'Start' is pressed
        disableAllCards(true); 
    }
    
    // --- RENDER THE GAME BOARD (SIMPLIFIED FOR ICONS) ---
    function renderBoard(cardClass) {
        boardContainer.innerHTML = ''; 
        boardContainer.style.display = 'grid'; 
        
        cards.forEach((icon, index) => { 
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card', cardClass);
            cardElement.setAttribute('data-value', icon); 
            cardElement.id = `card-${index}`;
            
            // Always render an icon tag for the front face
            const frontContent = `<i class="bi ${icon}"></i>`;

            cardElement.innerHTML = `
                <div class="card-inner">
                    <div class="card-front card-face">${frontContent}</div>
                    <div class="card-back card-face">
                    <i class="bi bi-question-lg"></i>
                    </div>
                </div>
            `;
            boardContainer.appendChild(cardElement);
        });
        
        document.querySelectorAll('.memory-card').forEach(card => card.addEventListener('click', flipCard));
    }

    // --- CARD FLIPPING LOGIC ---
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return; 
        
        this.classList.add('flip');
        
        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        secondCard = this;
        totalMoves++;
        updateStats();
        
        checkForMatch();
    }
    
    // --- MATCH CHECK LOGIC (Using data-value) ---
    function checkForMatch() {
        const isMatch = firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value');
        
        isMatch ? disableCards() : unflipCards();
    }
    
    // --- MATCH FOUND ---
    function disableCards() {
        firstCard.classList.add('match', 'disabled');
        secondCard.classList.add('match', 'disabled');
        
        resetBoard();
        
        matchedPairs++;
        updateStats();
        
        if (matchedPairs === totalPairs) {
            finalMovesSpan.textContent = totalMoves;
            winMessage.style.display = 'block';
            disableAllCards(true);
        }
    }

    // --- NO MATCH (FIXED) ---
    function unflipCards() {
        lockBoard = true; // LOCK the board so user cannot click while cards flip back
        
        setTimeout(() => {
            // 1. Remove the flip class to hide the cards
            firstCard.classList.remove('flip');
            secondCard.classList.remove('flip');
            
            // 2. Reset turn state and unlock the board
            resetBoard();
        }, 1000); // 1 second delay
    }
    
    // --- RESET TURN STATE (FIXED) ---
    function resetBoard() {
        // 1. Reset card variables
        [hasFlippedCard, firstCard, secondCard] = [false, null, null];
        
        // 2. UNLOCK the board (MUST happen after the flip classes are removed in unflipCards)
        lockBoard = false;
    }
    
    // --- DISABLE/ENABLE ALL CARDS (for start/win) ---
    function disableAllCards(isDisabled) {
        document.querySelectorAll('.memory-card').forEach(card => {
            if (isDisabled) {
                card.classList.add('disabled');
            } else {
                if (!card.classList.contains('match')) {
                     card.classList.remove('disabled');
                }
            }
        });
    }

    // --- UPDATE STATS PANEL ---
    function updateStats() {
        movesCount.textContent = totalMoves;
        matchesCount.textContent = matchedPairs;
    }

    // --- EVENT LISTENERS ---
    
    // Start Game Button 
    startGameBtn.addEventListener('click', () => {
        initializeGame(); 
        
        lockBoard = true;
        disableAllCards(true); 

        // Show all cards for 2 seconds
        document.querySelectorAll('.memory-card').forEach(card => card.classList.add('flip'));
        
        // Hide them and enable play
        setTimeout(() => {
            document.querySelectorAll('.memory-card').forEach(card => card.classList.remove('flip'));
            lockBoard = false;
            disableAllCards(false); 
        }, 2000); 

        startGameBtn.style.display = 'none';
        restartGameBtn.textContent = 'Restart Game';
    });

   
 // Restart Game Button 
    restartGameBtn.addEventListener('click', () => {
        initializeGame();
        
        lockBoard = true;
        disableAllCards(true); 
        
        document.querySelectorAll('.memory-card').forEach(card => card.classList.add('flip'));
        
        setTimeout(() => {
            document.querySelectorAll('.memory-card').forEach(card => card.classList.remove('flip'));
            lockBoard = false;
            disableAllCards(false); 
        }, 2000); 
    });

    // Difficulty Change
    difficultySelector.addEventListener('change', () => {
        initializeGame();
        startGameBtn.style.display = 'inline-block';
        restartGameBtn.textContent = 'Reset Game';
        boardContainer.innerHTML = '<p class="text-center text-muted mt-5">Press \'Start Game\' to begin!</p>';
        boardContainer.style.display = 'block';
    });
    
    // --- Initial setup on load ---
    initializeGame();
});
