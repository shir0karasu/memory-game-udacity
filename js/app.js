/*
 * Create a list that holds all of your cards
 */
//const myCards = ["fa-diamond", "fa-paper-plane-o", "fa-bolt", "fa-cube", "fa-anchor", "fa-leaf", "fa-bicycle", "fa-bomb",
//                "fa-diamond", "fa-paper-plane-o", "fa-bolt", "fa-cube", "fa-anchor", "fa-leaf", "fa-bicycle", "fa-bomb"];
const cards = document.querySelectorAll('.card');
const deck = document.querySelector('.deck');
let openedCards = [];
let moves = 0;
let time = 0;
let clockOn = true;
let myTime;
let matched = 0;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/* Listen to the click
the click is valid when:
- within the 'card' area
- not the matched cards
- not the same card that opened at first
*/
shuffleCards();

deck.addEventListener('click', event => {
  const clickTarget = event.target;

  if (clickTarget.classList.contains('card') &&
      !clickTarget.classList.contains('match') &&
      openedCards.length < 2 &&
      !openedCards.includes(clickTarget)){
        //if satisfied all condition, open and show the card
        toggleCard(clickTarget);
        addToggleCard(clickTarget);
        countingTime(clockOn);
        clockOn = false;
        //once 2 cards are opened, check if they are matched and
        //and increase number of moves
        if (openedCards.length == 2){
          checkifMatched(clickTarget);
          addMoves();
          checkMovetoRemoveStar();
          checkifALLMatched();
        }
      }
});


//show the card anytime card is clicked
function toggleCard(clickTarget){
  clickTarget.classList.toggle('open');
  clickTarget.classList.toggle('show');
}

//add opened card in the list
function addToggleCard(clickTarget){
  openedCards.push(clickTarget);
}

/* Check if cards are matched
- if matched, remove open and show classes, add match class in the HTML (clear the opened cards list)
- if not, hide the cards (by removing open and show classes).
  set timeout so that user can see the cards before it's being hidden.
  (clear the opened cards list)
*/
function checkifMatched(clickTarget){
  if (openedCards[0].firstElementChild.className === openedCards[1].firstElementChild.className){
    for (let card of openedCards){
      toggleCard(card);
      card.classList.toggle('match');
    }
    openedCards = [];
    matched++;
  } else {
    setTimeout(() => {
      for (let card of openedCards){
      toggleCard(card);
      }
    openedCards = [];
  }, 1000);
  }
}

//Shuffle cards
function shuffleCards(){
  const myCards = Array.from(document.querySelectorAll('.deck li'));
  const shuffled = shuffle(myCards);
  for (let card of shuffled){
    deck.appendChild(card);
  }
}

//Add moves
function addMoves(){
  moves++;
  document.querySelector('.moves').innerHTML = moves;
}

//Remove stars
function removeStar(){
  let allStars = document.querySelector('.stars');
  let star = document.querySelector('.stars li');
  //allStars.classList.toggle('hide');
  allStars.removeChild(star);
}

//Check number of moves to remove star
function checkMovetoRemoveStar(){
  if (moves == 12){
    removeStar(); //remove 1 star when user finishes 12 moves
  }
  if (moves == 16){
    removeStar(); //remove 1 star when user finishes 16 moves
  }
  if (moves == 20){
    removeStar(); //remove 1 star when user finishes 20 moves
  }
};

/* -----Score panel----- */

//Timer function: counting time
function countingTime(clockOn){
  if (clockOn) {
    myTime = setInterval(function(){
      time++
      displayTime(time);
    }, 1000)
  }
}

//Stop counting time
function stopTimer(){
  clearInterval(myTime);
}
//Convert number to time (m:ss) format and display time
function displayTime(time){
  let m = Math.floor(time/60);
  let s = Math.floor(time % 60);

  if (time = 0){
    document.querySelector('.clock').innerHTML = '0:00';
  }
  if (s < 10){
    document.querySelector('.clock').innerHTML = m+':0'+s;
  } else {
    document.querySelector('.clock').innerHTML = m+':'+s;
  }
}

/* ----End game greeting---- */

//Display summary
function displaySummary(){
  const smy = document.querySelector('.display-summary');
  smy.classList.toggle('hide');
  writeSummary();
}

//Write summary information on the summary box
function writeSummary(){
  const sTime = document.querySelector('.summary-time');
  const clock = document.querySelector('.clock').innerHTML;
  const sMoves = document.querySelector('.summary-moves');
  const sStars = document.querySelector('.summary-stars');

  sTime.innerHTML = 'Time: ' + clock;
  sMoves.innerHTML = 'Moves: ' + moves;
  sStars.innerHTML = 'Stars: ' + getStars();
}

//Get remaining stars after the game
function getStars(){
  const remainingStars = document.querySelectorAll('.stars li');
  let count = 0;
  for (let star of remainingStars){
    count++;
  }
  return count;
}

//Activate cancel button
document.querySelector('.cancel-button').addEventListener('click', displaySummary)

//Activate replay button
document.querySelector('.replay-button').addEventListener('click', event =>{
  displaySummary();
  restartGame();
})

document.querySelector('.restart').addEventListener('click', restartGame)

//Check if all cards are matched
function checkifALLMatched(){
  if (matched == 8){
    stopTimer();
    displaySummary();
  }
}

/* -----Reset game-----*/

function restartGame(){
  resetMoves();
  resetTimer();
  resetStars();
  shuffleCards();
  resetCards();
}

//Reset time
function resetTimer(){
  stopTimer();
  time = 0;
  clockOn = true;
  displayTime(time);
}

//Reset moves
function resetMoves(){
  moves = 0;
  matched = 0;
  document.querySelector('.moves').innerHTML = moves;
}

//Reset stars
function resetStars(){
  let i = getStars();
  while (i < 3){
    document.querySelector('.stars').innerHTML += '<li><i class="fa fa-star"></i></li>';
    i++;
  }
}

//Reset cards
function resetCards(){
  const rcards = document.querySelectorAll('.deck li');
  openedCards = [];
  for (let card of rcards){
    card.className = 'card';
  }
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
