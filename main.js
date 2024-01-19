const icons = ['😈', '🐼', '🧝🏻‍♀️', '🪼', '🐲', '⛄️', '🧜🏻‍♀️', '💀', '🎃', '🦄'];
const icons2 = [...icons];

const grid = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const button = document.querySelector('.button');
const msgEl = document.querySelector(".msg");
const gameTimerEl = document.querySelector(".gameTimer");

let checkMatchTimer = null;
let gameTimer = null;

let totalGameTime = 35; //seconds
let cardViewSeconds = 5;

let cards = [];
let moves = 0;
let score = 0;
let flippedCards = [];

// Shuffle the icons array
const cardValues = [];
const shuffledIcons = shuffle(cardValues.concat(icons, icons2));

// This function shuffles an array using the Fisher-Yates algorithm. It takes an array as input and returns the shuffled array.
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Event listener for restart button
button.addEventListener('click', restartGame);

// This function is triggered when the player clicks the restart button. It asks for confirmation before restarting the game. If the player confirms, the function clears the game and starts a new one.
function restartGame() {
  let msg = `Do you want to start the game?`;
  if (cards.length > 0) {
    msg = `All current progress will be lost. Do you want to continue?`;
  }
  const res = window.confirm(msg);
  if (res) {
    clearGame();
    startGame();
  }
}

//This function initializes the game by creating the cards, resetting the moves and score, shuffling the cards, and showing a preview timer before starting the game.
function startGame() {
  createCards();
  moves = 0;
  score = 0;
  scoreElement.style.display = "block";
  scoreElement.textContent = 'Moves: 0';
  flippedCards = [];

  cards.forEach(card => {
    card.classList.remove('flipped');
    card.classList.remove('matched');
  });

  shuffleCards();
  showPreviewTimer();
}

// This function creates the cards for the game. It loops through the shuffled icons array and creates a card element for each icon. It also adds event listeners to the cards to handle the flipping logic.
function createCards() {
  for (let i = 0; i < shuffledIcons.length; i++) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = shuffledIcons[i];
    card.addEventListener('click', () => flipCard(card));
    grid.appendChild(card);
    cards.push(card);
  }
}

// This function shuffles the created cards and appends them to the grid element. It uses the shuffle function to shuffle the cards array.
function shuffleCards() {
  const shuffledCards = shuffle(cards);
  shuffledCards.forEach(card => grid.appendChild(card));
}

// This function displays a preview timer before starting the game. It counts down from a specified time and hides all the cards once the countdown is over.
function showPreviewTimer() {
  let timeToShowTheCard = cardViewSeconds;
  const timeMsgEl = msgEl.querySelector(".time");
  msgEl.style.display = "block";
  const timerInterval = setInterval(() => {
    timeMsgEl.innerHTML = timeToShowTheCard;
    timeToShowTheCard--;
    if (timeToShowTheCard < 0) {
      hideAllCards();
      clearInterval(timerInterval);
      msgEl.style.display = "none";
    }
  }, 1000);
}

// This function hides all the cards by adding the "flipped" class to them. It is called after the preview timer ends to start the game.
function hideAllCards() {
  cards.forEach(card => {
    card.classList.add('flipped');
  });
  startGameTimer();
}

//  This function starts the game timer. It counts down from a specified time and ends the game if the time runs out. It also asks for confirmation to start a new game if the time runs out.
function startGameTimer() {
  let gameTimeSeconds = totalGameTime;
  gameTimerEl.style.display = "block";
  const gameTimerMsgEl = gameTimerEl.querySelector(".time");
  gameTimer = setInterval(() => {
    gameTimerMsgEl.innerText = gameTimeSeconds;
    gameTimeSeconds--;
    if (gameTimeSeconds < 0) {
      clearInterval(gameTimer);
      const res = window.confirm("Game Over! Do you want to start a new game?");
      clearGame();
      if (res) {
        startGame();
      }
    }
  }, 1000);
}

// This function clears all the game variables and elements. It is called when the game needs to be reset or ended.
function clearGame() {
  scoreElement.style.display = "none";
  msgEl.style.display = "none";
  gameTimerEl.style.display = "none";
  grid.innerHTML = "";
  cards = [];
  flippedCards = [];
  clearInterval(checkMatchTimer);
  clearInterval(gameTimer);
}

// This function handles the flipping logic when a card is clicked. It checks if the card is already flipped and if there are less than two flipped cards. If both conditions are met, the card is flipped and added to the flipped cards array. If two cards are flipped, the checkMatch function is called.
function flipCard(card) {
  if (card.classList.contains('flipped') && flippedCards.length < 2) {
    card.classList.remove('flipped');
    flippedCards.push(card);
    if (flippedCards.length === 2) {
      checkMatchTimer = setTimeout(checkMatch, 1000);
    }
  }
}

// This function checks if the flipped cards match. It compares the icons on the flipped cards. If they match, the cards are marked as "matched" and the score is incremented. If all the pairs are found, the showFinalScore function is called. If the cards don't match, they are flipped back.
function checkMatch() {
  moves++;
  scoreElement.textContent = `Moves: ${moves}`;

  if (flippedCards[0].textContent === flippedCards[1].textContent) {
    flippedCards[0].classList.add('matched');
    flippedCards[1].classList.add('matched');
    score++;
    if (score === shuffledIcons.length / 2) {
      setTimeout(showFinalScore, 500);
    }
  } else {
    flippedCards.forEach(card => card.classList.add('flipped'));
  }
  flippedCards = [];
}

// This function shows the final score and asks for confirmation to start a new game. It is called when all the pairs are found.
function showFinalScore() {
  const res = window.confirm(`Congratulations! You have completed the game in ${moves} moves. Do you want to start a new game?`);
  clearGame();
  if (res) {
    startGame();
  }
}
