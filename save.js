/*Selectors*/
const elAllCards = document.querySelectorAll('.card');
const playBtn = document.querySelector('#play-game');
const playAgainContainer = document.querySelector('.play-again-container');
const elNameSpan = document.querySelector('#name');
const elTimeSpan = document.querySelector('#time');
const elBestScoreSpan = document.querySelector('#score');
const elWorstScoreSpan = document.querySelector('#worst-score');
const elTest = document.querySelector('#timer');

/*Load music*/
const correctAudio = new Audio('sound/right.mp3');
const wrongAudio = new Audio('sound/wrong.mp3');
const winAudio = new Audio('sound/win.mp3');

const TOTAL_CARD_PAIRS = 6;
let elPrevCard = null;
let flippedCards = 0;
//Control that only 2 cards can be flipped
let isCardProcessing = false;
let counter = 0;
let isGameStarted = false;

function cardClicked(elCard) {
  //Check if card is still flipped
  if (isCardProcessing) return;
  //Check if card is flipped, if it is i dont want to let the users to click on this card again
  if (elCard.classList.contains('flipped')) return;

  elCard.classList.add('flipped');
  if (elPrevCard === null) {
    //start the clock when the user clicks on the first card
    if (!isGameStarted) {
      isGameStarted = true;
      startClock();
    }
    console.log('first card');
    elPrevCard = elCard;
    //Todo: Timer starts
  } else {
    console.log('second card');
    checkCardsMatch(elPrevCard, elCard);
    //rest the prevCard back to null;
    elPrevCard = null;
  }
}

function checkCardsMatch(card1, card2) {
  let firstCard = +card1.getAttribute('data-card');
  let secondCard = +card2.getAttribute('data-card');
  //if the cards data-card matches
  if (firstCard === secondCard) {
    console.log('cards match');
    flippedCards++;
    if (flippedCards !== TOTAL_CARD_PAIRS) {
      correctAudio.play();
    }
    if (flippedCards === TOTAL_CARD_PAIRS) {
      console.log('You won!');
      winAudio.play();
      //Show restart game container
      playAgainContainer.classList.add('show');
    }
  } else {
    wrongAudio.play();
    //as long as this var is true we can't click on other cards
    isCardProcessing = true;
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      //only after we remove the flipped class from both cards set this var to be false and then user can click on cards again
      isCardProcessing = false;
    }, 1500);
  }
}

function restartGame() {
  //Shuffle the cards
  shuffleCards();
  //Flip all the cards back
  elAllCards.forEach((card) => {
    card.classList.remove('flipped');
  });
  flippedCards = 0;
  playAgainContainer.classList.remove('show');
  isGameStarted = false;
  checkBestScore(counter);
  counter = 0;
  elTimeSpan.innerText = 0;
}

function checkBestScore(score) {
  //check if there is a best score already, if not set a new best score
  if (localStorage.getItem('bestScore') === null) {
    localStorage.setItem('bestScore', score);
    elBestScoreSpan.innerText = `${localStorage.getItem('bestScore')} seconds`;
  } else {
    //if there is a best score, check if the new score is better than the current best score
    let currScore = localStorage.getItem('bestScore');
    if (score < currScore) {
      console.log(`${score} is quicker than ${currScore}`);
      //set a new best score
      localStorage.setItem('bestScore', score);
      elBestScoreSpan.innerText = `${score} seconds`;
    } else {
      if (localStorage.getItem('worstScore') === null) {
        localStorage.setItem('worstScore', currScore);
      }
      let currWorstScore = localStorage.getItem('worstScore');
      if (score > currWorstScore) {
        localStorage.setItem('worstScore', score);
        elWorstScoreSpan.innerText = `${score} seconds`;
      }
    }
  }
}

function startClock() {
  let id = setInterval(() => {
    if (flippedCards !== TOTAL_CARD_PAIRS) {
      counter++;
      elTimeSpan.innerText = `${counter} seconds`;
    } else {
      //set the game back
      clearInterval(id);
    }
  }, 1000);
  console.log(id);
}

function changeUser() {
  const name = prompt(`Please Enter your name`);
  localStorage.setItem('name', name);
  elNameSpan.innerText = `Welcome!, ${localStorage.getItem('name')}`;
}
function saveData() {
  let user = localStorage.getItem('name');
  elNameSpan.innerText = `${
    user === null || user === ''
      ? 'Welcome Anonymous User!'
      : `Welcome, ${user}!`
  }`;
  let bestScore = localStorage.getItem('bestScore');
  elBestScoreSpan.innerText = `${
    bestScore === null ? 'None' : `${bestScore} seconds`
  }`;

  let worstScore = localStorage.getItem('worstScore');
  elWorstScoreSpan.innerText = `${
    worstScore === null ? 'None' : `${worstScore} seconds`
  }`;
}

//check if we already have a name, if not we get the user name
if (localStorage.getItem('name') === null) {
  changeUser();
}

/*Shuffle all Cards*/
function shuffleCards() {
  elAllCards.forEach((card) => {
    //generate a random num
    let randPosition = Math.floor(Math.random() * elAllCards.length);
    card.style.order = `${randPosition}`;
  });
}

//Load data from localStorage
document.addEventListener('DOMContentLoaded', saveData);
shuffleCards();

let seconds = 0;
let minutes = 0;
let hours = 0;
function stopWatch() {
  seconds++;
  if (seconds / 60 === 1) {
    seconds = 0;
    minutes++;
    if (minutes / 60 === 1) {
      minutes = 0;
      hours++;
    }
  }
  //Display updated time
  elTest.innerText = `${hours}:${minutes}:${seconds}`;
}
