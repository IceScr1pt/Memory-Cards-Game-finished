/*Selectors*/
const elAllCards = document.querySelectorAll('.card');
const playBtn = document.querySelector('#play-game');
const playAgainContainer = document.querySelector('.play-again-container');
const elNameSpan = document.querySelector('#name');
const elTimeSpan = document.querySelector('#time');
const elBestScoreSpan = document.querySelector('#score');
const elWorstScoreSpan = document.querySelector('#worst-score');

/*Load music*/
const correctAudio = new Audio('sound/right.mp3');
const wrongAudio = new Audio('sound/wrong.mp3');
const winAudio = new Audio('sound/win.mp3');

//Number of card pairs
const TOTAL_CARD_PAIRS = 6;
let elPrevCard = null;
let flippedCards = 0;
//Control that only 2 cards can be flipped
let isCardProcessing = false;
//count seconds
let counter = 0;
let isGameStarted = false;
//interval for the timer
let interval = null;

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
      interval = setInterval(stopWatch, 10);
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

//Check if cards match and victory
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

//this function rest all the neccessary things of the game
function restartGame() {
  //Shuffle the cards
  shuffleCards();
  //Flip all the cards back
  elAllCards.forEach((card) => {
    card.classList.remove('flipped');
  });
  //rest flipped cards
  flippedCards = 0;
  //remove restart popup
  playAgainContainer.classList.remove('show');
  //set the game back to false
  isGameStarted = false;
  //update game stats
  gameStats(counter);
  counter = 0;
  //Rest the timer variables
  elTimeSpan.innerText = `Click a card to start`;
  seconds = 0;
  minutes = 0;
  hours = 0;
  miliSeconds = 0;
  formatted = null;
  //Restart cheat feature
  isCheated = false;
}

//set score and get stats from localStorage
function gameStats(score) {
  //formatb
  let formatted = formatCounterToTime(score);
  console.log(formatted);
  //check if there is a best score already, if not set a new best score
  if (localStorage.getItem('bestScore') === null) {
    localStorage.setItem('bestScore', score);
    elBestScoreSpan.innerText = `${formatted}`;
  } else {
    //if there is a best score, check if the new score is better than the current best score
    let currScore = localStorage.getItem('bestScore');
    if (score < currScore) {
      console.log(`${score} is quicker than ${currScore}`);
      //set a new best score
      localStorage.setItem('bestScore', score);
      elBestScoreSpan.innerText = `${formatted}`;
    } else {
      if (localStorage.getItem('worstScore') === null) {
        localStorage.setItem('worstScore', currScore);
      }
      let currWorstScore = localStorage.getItem('worstScore');
      if (score > currWorstScore) {
        localStorage.setItem('worstScore', score);
        elWorstScoreSpan.innerText = `${formatted}`;
      }
    }
  }
}

//I have a counter, this function format seconds to hours/minutues/seconds nicely in order to display best score/worst score
function formatCounterToTime(time) {
  let minutes = Math.floor(time / 60);
  let hours = Math.floor(time / 3600);
  let seconds = time - minutes * 60;
  if (seconds < 10) {
    seconds = `0${seconds}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (hours < 10) {
    hours = `0${hours}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}

//Original timer
// function startClock() {
//   let id = setInterval(() => {
//     if (flippedCards !== TOTAL_CARD_PAIRS) {
//       counter++;
//       elTimeSpan.innerText = `${counter} seconds`;
//     } else {
//       //set the game back
//       clearInterval(id);
//     }
//   }, 1000);
//   console.log(id);
// }

function changeUser() {
  let name = prompt(`Please Enter your name`);
  if (!name) {
    name = null;
  }
  localStorage.setItem('name', name);
  elNameSpan.innerText = `${
    name !== null
      ? `Welcome, ${localStorage.getItem('name')} 😜 !`
      : `Welcome,Anonymous! 💀`
  }`;
}

//load data from localStorage when page refreshes
function getLocalStorageData() {
  let user = localStorage.getItem('name');
  elNameSpan.innerText = `${
    user === null || user === ''
      ? 'Welcome Anonymous User!'
      : `Welcome, ${user} 😜!`
  }`;
  let bestScore = localStorage.getItem('bestScore');
  let formatBestScore = formatCounterToTime(bestScore);
  elBestScoreSpan.innerText = `${
    bestScore === null ? 'None' : `${formatBestScore}`
  }`;

  let worstScore = localStorage.getItem('worstScore');
  let formatWorstScore = formatCounterToTime(worstScore);
  elWorstScoreSpan.innerText = `${
    worstScore === null ? 'None' : `${formatWorstScore}`
  }`;
}

//check if we already have a name, if not we get the user name
if (localStorage.getItem('name') === null) {
  changeUser();
}

/*Shuffle all Cards in random positions!*/
function shuffleCards() {
  elAllCards.forEach((card) => {
    //generate a random num
    let randPosition = Math.floor(Math.random() * elAllCards.length);
    card.style.order = `${randPosition}`;
  });
}

//Stopwatch variables
let miliSeconds = 0;
let seconds = 0;
let minutes = 0;
let hours = 0;
function stopWatch() {
  //check if i flipped all cards, if so we stop the clock
  if (flippedCards === TOTAL_CARD_PAIRS) {
    clearInterval(interval);
    console.log('interval cleaned');
  }
  miliSeconds += 10;
  if (miliSeconds >= 1000) {
    miliSeconds = 0;
    counter++;
    console.log('counter is', counter);
    seconds++;
    //if seconds /60 is 1 then rest seconds
    if (seconds / 60 === 1) {
      seconds = 0;
      //start increment minutes
      minutes++;
      //if minutes / 60 is 1 then minutes also rest
      if (minutes / 60 === 1) {
        minutes = 0;
        hours++;
      }
    }
  }
  //add a leading 0 if seconds/minutes/hours is a 1 digit
  let displayMiliSeconds = `${
    miliSeconds > 90 ? miliSeconds : `0${miliSeconds}`
  }`;
  let displaySeconds = `${seconds < 10 ? `0${seconds}` : `${seconds}`}`;
  let displayMinutes = `${minutes < 10 ? `0${minutes}` : `${minutes}`}`;
  let displayHours = `${hours < 10 ? `0${hours}` : `${hours}`}`;

  //Display the stopwatch
  elTimeSpan.innerText = `${displayHours}:${displayMinutes}:${displaySeconds}.${displayMiliSeconds}`;
}

//This function handles the cheat feature
let isCheated = false;
function cheat(btn) {
  console.log(btn);
  console.log('You can cheat 1 time');
  //if the user didnt clicked on the cheat btn flip the cards for a little
  if (!isCheated) {
    isCheated = true;
    //fix the issue that the user can click again on the btn and because of the alert he can see the cards for a long time until he press ok;
    btn.disabled = true;
    elAllCards.forEach((card) => {
      card.classList.add('flipped');
    });
    setTimeout(() => {
      elAllCards.forEach((card) => {
        card.classList.remove('flipped');
        btn.disabled = false;
        console.log('cheat-over');
      });
    }, 800);
  } else {
    alert('You already used this feature  😭');
    return;
  }
}

//Load data from localStorage
document.addEventListener('DOMContentLoaded', getLocalStorageData);
shuffleCards();
