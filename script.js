
/**
 * This page was for experimental purposes
 */
const gameContainer = document.getElementById('game');
const heading = document.querySelector('h1');
let bestScore;

// const COLORS = [
//   '#ff0000',
//   'blue',
//   'green',
//   'orange',
//   'purple',
//   '#ff0000',
//   'blue',
//   'green',
//   'orange',
//   'purple',
// ];

//  here is a helper function to shuffle an array
//  it returns the same array with values shuffled
//  it is based on an algorithm called Fisher Yates if you want to research more

function shuffle(array) {
  let counter = array.length;
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

// let shuffledColors = shuffle(COLORS);

let shuffledColors = [];

/**
 * @desc this function loops over the array of colors
         it creates a new div and gives it a class with the value of the color
         it also adds an event listener for a click for each card
 * @param {Array} colorArray 
 */

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement('div');

    // give it a class and id attribute for the value we are looping over
    newDiv.id = color;
    newDiv.classList.add('back');

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener('click', handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

// TODO: Implement this function!

// Part One - Reading the code
// Take a look at the starter code provided.
// We have an array of colors which we shuffle and then loop over to create 10 <div> elements on the page and give them a class of the color we loop over.
// We then append the <div> elements to the DOM and add an event listener for a “click” for each of the elements.
// Make sure to read through the code before continuing on!

// Part Two - Implementing clicks and matches
// Clicking a card should change the background color to be the color of the class it has.
// Users should only be able to change at most two cards at a time.
// Clicking on two matching cards should be a “match” — those cards should stay face up.
// When clicking two cards that are not a match, they should stay turned over for at least 1 second before they hide the color again. You should make sure to use a setTimeout so that you can execute code after one second.

// Part Three - Gotchas
// Make sure this works only if you click on two different cards — clicking the same card twice shouldn’t count as a match!)
// Make sure that you can not click too quickly and guess more than two cards at a time.

// Further Study
// Add a button that when clicked will start the game
// Add a button that when clicked will restart the game once it has ended
// For every guess made, increment a score variable and display the score while the game is played
// Store the lowest-scoring game in local storage, so that players can see a record of the best game played.
// Allow for any number of cards to appear
// Instead of hard-coding colors, try something different like random colors or even images!

/**
 * @desc landing page to start the game
 */
let numberOfCards;
let newCards = [];

function startGame() {
  const startBtnWrapper = document.createElement('div');
  const startBtn = document.createElement('button');
  startBtn.innerText = 'Start the Game!!';
  startBtn.id = 'start-game';

  startBtnWrapper.append(startBtn);
  heading.parentNode.insertBefore(startBtnWrapper, heading.nextSibling);

  // ask the player a number of cards to play
  // default = 10
  startBtn.addEventListener('click', (e) => {
    numberOfCards = parseInt(
      window.prompt('How many cards do you want to play?')
    );

    if (numberOfCards && numberOfCards >= 2)
      newCards = makeCards(numberOfCards);
    else newCards = makeCards(10);

    shuffledColors = shuffle(newCards);

    gameUI();
    createDivsForColors(shuffledColors);
  });
}

/**
 * @desc create a set of cards with random colors
 * @param {number} numberOfCards
 * @return {array}
 */
function makeCards(numberOfCards) {
  const cards = [];
  let numberOfColors = Math.floor(numberOfCards / 2);

  // random colors
  for (let i = 0; i < numberOfColors; i++) {
    cards[i] = `#${generateRandomColors().join('')}`;
  }

  return cards.concat(...cards);
}

/**
 * @desc generate hex color
 * @return {array}
 */
function generateRandomColors() {
  const HEX = {
    0: '0',
    1: '1',
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: 'A',
    11: 'B',
    12: 'C',
    13: 'D',
    14: 'E',
    15: 'F',
  };

  const results = [];
  let random;

  for (let i = 0; i < 6; i++) {
    random = Math.round(Math.random() * 15);
    results[i] = HEX[random % 16];
  }

  return results;
}

/**
 * @desc compare two cards and if they match, leave them face up, if not, flip them over after at least 1 second
 *      Allow to compare only two cards at a time.
 *      store best score to the localStorage
 * @param [Object] event
 */

let selectedTarget = [];
let selectedTargetIndex = 0;
let clickCounter = 0;
let matchCount = 0;
let score;

function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  // console.log('you just clicked', event.target);

  // keep track of number of clicks and display on the page
  const clickCount = document.querySelector('#click-count');
  const progress = document.querySelector('#score');
  let targetScore = shuffledColors.length / 2;
  clickCounter++;
  clickCount.innerText = `Clicks: ${clickCounter}`;

  let color = event.target.id;

  // get the index number of target from parentNode > HTMLCollection
  let index = getCardIndex(event.target);

  // setTimeout() to prevent too many click events from firing and allow only two cards open up at a time
  setTimeout(() => {
    if (selectedTarget.length < 2) {
      // change the corresponding background of the card
      event.target.style.backgroundColor = color;

      // store card info [index, color, event.target] into the selectedTarget array
      // only the cards with a different index number will be stored
      if (
        selectedTargetIndex === 0 ||
        selectedTarget[selectedTargetIndex - 1][0] !== index
      ) {
        selectedTarget[selectedTargetIndex] = [index, color, event.target];
        selectedTargetIndex++;
      }

      // when the length of the seletedColors === 2
      // 1. compare two colors
      // 2. if they match, leave them face up
      // 3. otherwise turn them over after 1 second
      // 4. when player reaches target score 100%, prompt to ask replay or not
      if (selectedTarget.length === 2) {
        if (selectedTarget[0][1] !== selectedTarget[1][1]) {
          setTimeout(() => {
            for (let i = 0; i < selectedTarget.length; i++) {
              selectedTarget[i][2].style.backgroundColor = '#ffffff';
              // selectedTarget[i][2].className = 'front';
              // console.log(selectedTarget[i][2].className)
            }
            selectedTarget = [];
          }, 1000);
        } else {
          selectedTarget[0][2].classList = 'flipped';
          selectedTarget[0][2].removeEventListener('click', handleCardClick);

          selectedTarget[1][2].classList = 'flipped';
          selectedTarget[1][2].removeEventListener('click', handleCardClick);

          selectedTarget = [];
          matchCount++;

          score = Math.ceil((matchCount / targetScore) * 100);
          progress.innerText = `Score: ${score} %`;

          setTimeout(() => {
            if (score === 100) {
              // find the best score and update the local storage
              bestScore = localStorage.getItem('bestScore')
                ? Math.min(localStorage.getItem('bestScore'), clickCounter)
                : clickCounter;

              localStorage.setItem('bestScore', bestScore);

              // prompt to the user to replay
              // yes: restart the game
              let input = window.prompt(
                'Excellent! Do you want to replay? Y/N'
              );
              if (input.toUpperCase() === 'Y') {
                gameUI();
                createDivsForColors(shuffledColors);
              }
            } else clickCounter++;
          }, 1000);
        }
        selectedTargetIndex = 0;
      }
    }
  }, 500);
}

/**
 * @desc find the index number of just clicked element
 * @pram {object} selectedElement
 * @return {number} index
 */
function getCardIndex(selectedElement) {
  for (let i = 0; i < gameContainer.children.length; i++) {
    if (gameContainer.children[i] === selectedElement) return i;
  }
}

/**
 * @desc build UI of replay button, click count, score, best score
 */
function gameUI() {
  resetGame();

  const div = document.createElement('div');
  const clickStatus = document.createElement('span');
  const scoreStatus = document.createElement('span');
  const btnRestart = document.createElement('button');
  const bestScore = document.createElement('span');

  div.id = 'game-ui';

  btnRestart.innerText = 'Replay';
  btnRestart.id = 'replay';
  btnRestart.style.margin = '0px 80px 0px 10px';

  clickStatus.innerText = `Clicks: 0`;
  clickStatus.id = 'click-count';
  clickStatus.style.marginRight = '80px';

  scoreStatus.id = 'score';

  scoreStatus.innerText = 'Score: 0 %';
  scoreStatus.style.marginRight = '80px';
  bestScore.id = 'best-score';
  bestScore.innerText = `You best Score: ${
    localStorage.getItem('bestScore') || 0
  }`;

  div.append(btnRestart);
  div.append(clickStatus);
  div.append(scoreStatus);
  div.append(bestScore);
  heading.parentNode.insertBefore(div, heading.nextSibling);

  const replay = document.querySelector('#replay');
  replay.addEventListener('click', replayGame);
}

/**
 * @desc replay game
 */
function replayGame() {
  gameUI();
  createDivsForColors(shuffle(newCards));
}

/**
 * @desc reset values and DOM elements
 */
function resetGame() {
  if (document.querySelector('#start-game'))
    document.querySelector('#start-game').remove();
  if (document.querySelector('#game-ui'))
    document.querySelector('#game-ui').remove();

  gameContainer.innerHTML = '';

  clickCounter = 0;
  score = 0;
  matchCount = 0;
}

startGame();
