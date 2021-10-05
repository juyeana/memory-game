const currentScoreDiv = document.querySelector('#current-score');

let gameContainer,
  card1 = null,
  card2 = null,
  flipped = 0,
  currentScore = 0,
  match = 0,
  numberOfColors = 10;

let bestScore = localStorage.getItem('bestScore')
  ? localStorage.getItem('bestScore')
  : Infinity;
let newColors = makeColors(numberOfColors);
let shuffledColors = shuffle(newColors);

/**
 * @desc landing page to start the game. By clicking the play button, newly generated shuffled color cards display
 */
function startGame() {
  const heading = document.querySelector('#heading');
  const playButton = document.querySelector('#play');
  const game = document.querySelector('#game');

  playButton.addEventListener('click', (e) => {
    e.preventDefault();
    playButton.remove();
    heading.parentElement.insertBefore(game, heading.nextSibling);
    game.style.visibility = 'visible';
    currentScoreDiv.innerText = currentScore;
    createDivsForColors(shuffledColors);
  });
  replayForm();
}

/**
 * @desc this function loops over the array of colors
         it creates a new div and gives it a class with the value of the color
         it also adds an event listener for a click for each card
 * @param {Array} colorArray
 */

function createDivsForColors(colorArray) {
  gameContainer = document.createElement('div');
  const gameWrapper = document.createElement('div');

  gameContainer.className = 'game-container';
  gameWrapper.className = 'game-wrapper';

  for (let color of colorArray) {
    const card = document.createElement('div');

    // give it a class and id attribute for the value we are looping over
    card.id = color;
    card.classList.add('front');

    // call a function handleCardClick when a div is clicked on
    card.addEventListener('click', handleCardClick);

    // append the div to the element with an id of game
    if (gameWrapper) gameWrapper.append(card);
  }
  gameContainer.append(gameWrapper);
  game.append(gameContainer);
}

/**
 * @desc create a set of random Hex colors, store them in an array and make them pairs before return to the caller
 * @param {number} num
 * @return {array}
 */
function makeColors(num) {
  const colors = [];
  for (let i = 0; i < num; i++) {
    colors[i] = `#${generateRandomColors().join('')}`;
  }
  return colors.concat(...colors);
}

/**
 * @desc generate random colors and covert them to hex colors
 * @return {array} results
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
 * @shuffle shuffle cards
 * @param {array} cards
 * @return {array}
 */
function shuffle(cards) {
  let counter = cards.length;
  // While there are elements in the cards
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = cards[counter];
    cards[counter] = cards[index];
    cards[index] = temp;
  }
  return cards;
}

/**
 * @desc compare two cards and if they match, leave them face up, if not, flip them over after at least 1 second
 *      Allow to compare only two cards at a time.
 *      store best score to the localStorage
 * @param [Object] event
 */
function handleCardClick(e) {
  // variable 'flipped' keeps track of the number of cards and allows to compare only two cards at a time.
  if (flipped < 2) {
    // store event tartget to a empty variable card1 or card2 and keep track of the number of clicks from the player
    if (!card1) {
      card1 = setCardAttribute(card1, e.target);
      flipped++;
      currentScoreDiv.innerText = ++currentScore;
    } else if (!card2) {
      card2 = setCardAttribute(card2, e.target);
      flipped++;
      currentScoreDiv.innerText = ++currentScore;
    }

    if (flipped === 2) {
      // if two cards match, remove event listener on both matching cards
      if (card1.id === card2.id) {
        match++;
        card1.removeEventListener('click', handleCardClick);
        card2.removeEventListener('click', handleCardClick);
        card1 = null;
        card2 = null;
        flipped = 0;
      } else {
        // if two cards don't match, both cards get flipped over
        setTimeout(() => {
          card1.style.transform = 'rotateY(0deg)';
          card2.style.transform = 'rotateY(0deg)';
          card1.style.backgroundColor = 'white';
          card2.style.backgroundColor = 'white';
          card1.addEventListener('click', handleCardClick);
          card2.addEventListener('click', handleCardClick);

          card1 = null;
          card2 = null;
          flipped = 0;
        }, 1000);
      }
    }
  }
  // when the player won, prompt shows the best score and ask to replay or not
  if (match === numberOfColors) {
    bestScore = Math.min(currentScore, bestScore);
    setTimeout(() => {
      let replay = window.prompt(
        `You Rock! Your best score so far is ${bestScore}. Do you want to play again?`,
        'Yes'
      );
      // update localStorage with the best score
      localStorage.setItem('bestScore', bestScore);

      if (replay && replay.toUpperCase() === 'YES') {
        replayGame();
      }
    }, 1000);
  }
}

/**
 * @desc set attrubutes of incoming event target and store them in a card
 * @param {object} card
 * @param {object} target
 * @return {object}
 */
function setCardAttribute(card, target) {
  card = target;
  card.style.transform = 'rotateY(180deg)';
  card.style.backgroundColor = card.id;
  card.removeEventListener('click', handleCardClick);

  return card;
}

/**
 * @desc replay game when the player entered 'Y' in the prompt window
 */

function replayGame() {
  match = 0;
  currentScore = 0;
  currentScoreDiv.innerText = currentScore;
  gameContainer.remove();
  createDivsForColors(shuffledColors);
}

/**
 * @desc when the player clicks on the 'replay' button on the game
 */
function replayForm() {
  const formContainer = document.querySelector('.form-container');

  formContainer.addEventListener('submit', (e) => {
    e.preventDefault();
    let input = parseInt(document.querySelector('#cards-to-play').value);
    input = input && typeof input === 'number' ? input : 10;
    match = 0;
    currentScore = 0;
    currentScoreDiv.innerText = currentScore;

    numberOfColors = input;

    gameContainer.remove();
    newColors = makeColors(numberOfColors);
    shuffledColors = shuffle(newColors);
    createDivsForColors(shuffledColors);
  });
}

startGame();
