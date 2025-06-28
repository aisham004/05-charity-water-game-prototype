// Log a message to the console to ensure the script is linked correctly
console.log('JavaScript file is linked correctly.');

const holes = document.querySelectorAll('.hole');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');
const livesDisplay = document.querySelectorAll('.life');
const difficultySelect = document.getElementById('difficulty');

const modal = document.getElementById('endModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');

const pauseBtn = document.getElementById('pauseBtn');

let score = 0;
let timeLeft = 30;
let lives = 3;
let gameInterval;
let countdownInterval;
let itemSpeed = 800;
let timeLimit = 30;
let winScore = 10;

let isPaused = false;

function createConfetti() {
  const confettiContainer = document.createElement('div');
  confettiContainer.className = 'confetti-container';

  for (let i = 0; i < 15; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confettiContainer.appendChild(confetti);
  }

  document.body.appendChild(confettiContainer);

  setTimeout(() => {
    document.body.removeChild(confettiContainer);
  }, 3000);
}

function startGame() {
  isPaused = false;
  pauseBtn.textContent = 'Pause';
  pauseBtn.disabled = false;

  score = 0;
  lives = 3;

  const difficulty = difficultySelect.value;
  if (difficulty === 'easy') {
    itemSpeed = 1000;
    timeLimit = 40;
    winScore = 7;
  } else if (difficulty === 'normal') {
    itemSpeed = 800;
    timeLimit = 30;
    winScore = 10;
  } else if (difficulty === 'hard') {
    itemSpeed = 600;
    timeLimit = 20;
    winScore = 15;
  }

  timeLeft = timeLimit;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  updateLivesDisplay();
  closeModal();

  clearInterval(gameInterval);
  clearInterval(countdownInterval);

  gameInterval = setInterval(showItem, itemSpeed);
  countdownInterval = setInterval(() => {
    if (!isPaused) {
      timeLeft--;
      timeDisplay.textContent = timeLeft;
      if (timeLeft <= 0) {
        endGame("⏰ Time's up!");
      }
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

  holes.forEach(hole => {
    hole.querySelector('.drop').style.display = 'none';
    hole.querySelector('.trash').style.display = 'none';
  });

  pauseBtn.disabled = true;

  let title, msg;
  if (score >= winScore) {
    createConfetti();
    title = "🎉 You Win!";
    msg = `${message}\nYou reached ${score} points and helped save water!`;
  } else {
    title = "💧 Game Over";
    msg = `${message}\nYou scored ${score} points. Try again?`;
  }

  showModal(title, msg);
}

function showItem() {
  if (isPaused) return;

  holes.forEach(hole => {
    hole.querySelector('.drop').style.display = 'none';
    hole.querySelector('.trash').style.display = 'none';
  });

  const randomHole = holes[Math.floor(Math.random() * holes.length)];
  const showDrop = Math.random() < 0.7;

  if (showDrop) {
    const drop = randomHole.querySelector('.drop');
    drop.style.display = 'block';
    drop.onclick = () => {
      drop.onclick = null;
      score++;
      scoreDisplay.textContent = score;
      drop.style.display = 'none';

      if (score >= winScore) {
        createConfetti();
        endGame('🎉 Congratulations!');
      }
    };
  } else {
    const trash = randomHole.querySelector('.trash');
    trash.style.display = 'block';
    trash.onclick = () => {
      trash.onclick = null;
      lives--;
      updateLivesDisplay();
      trash.style.display = 'none';

      if (lives <= 0) {
        endGame('💥 No lives left!');
      }
    };
  }
}

function showModal(title, message) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

function togglePause() {
  if (!isPaused) {
    isPaused = true;
    pauseBtn.textContent = 'Resume';
  } else {
    isPaused = false;
    pauseBtn.textContent = 'Pause';
  }
}
