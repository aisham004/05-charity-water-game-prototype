// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');
const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const livesDisplay = document.querySelectorAll('.life');

let score = 0;
let timeLeft = 30;
let lives = 3;
let gameInterval;
let countdownInterval;

// Function to create confetti effect
function createConfetti() {
  // Create confetti container
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';
  
  // Create 15 confetti pieces
  for (let i = 0; i < 15; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confettiContainer.appendChild(confetti);
  }
  
  // Add confetti to the page
  document.body.appendChild(confettiContainer);
  
  // Remove confetti after animation completes (3 seconds)
  setTimeout(() => {
    document.body.removeChild(confettiContainer);
  }, 3000);
}

function startGame() {
  score = 0;
  timeLeft = 30;
  lives = 3;

  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  updateLivesDisplay();

  clearInterval(gameInterval);
  clearInterval(countdownInterval);

  gameInterval = setInterval(showItem, 800);
  countdownInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      endGame('Time’s up!');
    }
  }, 1000);
}

function updateLivesDisplay() {
  livesDisplay.forEach((life, index) => {
    life.style.visibility = index < lives ? 'visible' : 'hidden';
  });
}

function endGame(message) {
  clearInterval(gameInterval);
  clearInterval(countdownInterval);

  // Hide any visible items
  holes.forEach(hole => {
    hole.querySelector('.drop').style.display = 'none';
    hole.querySelector('.trash').style.display = 'none';
  });

  setTimeout(() => {
    // Check if the player won by reaching 10 points
    if (score >= 10) {
      // Special celebratory message for winning
      if (confirm(`${message}\n\nYou helped save water by collecting ${score} drops!\n\nWould you like to play again?`)) {
        startGame();
      }
    } else {
      // Regular game over message
      if (confirm(`${message} You scored ${score} points!\nPlay again?`)) {
        startGame();
      }
    }
  }, 100);
}

function showItem() {
  // Hide all drops and trash
  holes.forEach(hole => {
    hole.querySelector('.drop').style.display = 'none';
    hole.querySelector('.trash').style.display = 'none';
  });

  const randomHole = holes[Math.floor(Math.random() * holes.length)];

  // Decide randomly to show drop or trash (70% drop, 30% trash)
  const showDrop = Math.random() < 0.7;

  if (showDrop) {
    const drop = randomHole.querySelector('.drop');
    drop.style.display = 'block';

    drop.onclick = () => {
      score++;
      scoreDisplay.textContent = score;
      drop.style.display = 'none';
      
      // Check if player has won (reached 10 points)
      if (score >= 10) {
        // Trigger confetti effect
        createConfetti();
        endGame('🎉 Congratulations! You WIN! 🎉\nYou reached 10 points and helped save water!');
      }
    };
  } else {
    const trash = randomHole.querySelector('.trash');
    trash.style.display = 'block';

    trash.onclick = () => {
      lives--;
      updateLivesDisplay();
      trash.style.display = 'none';
      if (lives <= 0) {
        endGame('No lives left!');
      }
    };
  }
}
