/*
  Name: Nicholas Young
  Date: 04.26.2019
  This is the JavaScript file that provides the interaction and functionality of the SET! game.
*/

(function() {
  "use strict";

  let seconds = 0;
  let timer = null;
  let textTimer = null;

  const STYLE = ["solid", "outline", "striped"];
  const COLOR = ["green", "purple", "red"];
  const SHAPE = ["diamond", "oval", "squiggle"];
  const COUNT = [1, 2, 3];
  let selectedCards = [];
  let score = 0;
  let clickedCard;

  window.addEventListener("load", init);


  // runs when the page is loaded, and initializes the interactivity for the buttons
  function init() {
    // This code is run when the page is loaded
    let startButton = document.getElementById("start");
    startButton.addEventListener("click", clickStart);
    let refreshBoard = document.getElementById("refresh");
    refreshBoard.addEventListener("click", newBoard);
    let backToMain = document.getElementById("main-btn");
    backToMain.addEventListener("click", returnMain);
  }

  // starts a new game and switches to the game view with a new board
  function clickStart() {
    startGame();
    // hide main menu
    let menu = document.getElementById("menu-view");
    menu.classList.add("hidden");

    // show game
    let game = document.getElementById("game-view");
    game.classList.remove("hidden");

    genBoard();
  }

  // sets "sets found" to 0, initializes/resets to the correct timer
  function startGame() {
    let refreshBoard = document.getElementById("refresh");
    refreshBoard.addEventListener("click", newBoard);
    // set count to 0
    score = 0;
    let setCount = document.getElementById("set-count");
    setCount.innerText = 0;

    //initialize timer
    let getTimer = document.getElementsByTagName("select")[0].value; // get desired time
    let time = document.getElementById("time");
    if (getTimer === "none") {
      seconds = 0;
      time.innerText = formatTime(seconds);
      timer = setInterval(countUp, 1000);
    } else {
      seconds = getTimer;
      time.innerText = formatTime(seconds);
      seconds--;
      timer = setInterval(function() {
        function currentClick() {
          clickCard(cardID);
        }
        if (seconds <= 0) {
          clearInterval(timer);
          timer = null;
          time.innerText = "00:00";
          endGame();
        } else {
          time.innerText = formatTime(seconds);
          seconds--;
        }
      }, 1000);
    }

    selectedCards = [];
  }

  // begins the timer counting up
  function countUp() {
    seconds++;
    time.innerText = formatTime(seconds);
  }

  /**
   * converts seconds into a correct format with minutes and seconds
   * @param {integer} time - the time in seconds
   * @return {string} returns a string with the time formatted into MM:SS
   */
  function formatTime(time) {
    let minutes = parseInt(time / 60, 10);
    let seconds = parseInt(time % 60, 10);
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (seconds < 10) {
      seconds = "0" + seconds;
    }
    return minutes + ":" + seconds;
  }

  // ends the game, erases the current board, and starts a new game with a new board
  function newBoard() {
    selectedCards = [];
    clearBoard();
    genBoard();
  }

  // clears the board
  function clearBoard() {
    let oldCards = document.getElementById("game");
    while (oldCards.firstChild) {
      oldCards.removeChild(oldCards.firstChild);
    }
  }

  // generates a new random board
  function genBoard() {
    let game = document.getElementById("game");
    let numCards;
    if (document.getElementsByTagName("input")[0].checked) {
      numCards = 9;
    } else {
      numCards = 12;
    }

    // number of cards to generate
    for (let i = 0; i < numCards; i++) {
      let currentCard = genCard();
      game.appendChild(currentCard);
    }
  }

  /*
  * @return {div} a div that represents a card with shapes inside
  */
  function genCard() {
    let unique = false;
    let currentCard;
    while (!unique) {
      // determine card attributes
      let selectedStyle;
      if (document.getElementsByTagName("input")[0].checked) {
        selectedStyle = "solid";
      } else {
        selectedStyle = STYLE[Math.floor(Math.random() * STYLE.length)];
      }
      let selectedColor = COLOR[Math.floor(Math.random() * COLOR.length)];
      let selectedShape = SHAPE[Math.floor(Math.random() * SHAPE.length)];
      let selectedCount = COUNT[Math.floor(Math.random() * COUNT.length)];

      currentCard = document.createElement("div");
      currentCard.classList.add("card");
      let cardID =
        selectedStyle +
        "-" +
        selectedShape +
        "-" +
        selectedColor +
        "-" +
        selectedCount;
      let checkExists = document.getElementById(cardID);
      let text = document.createTextNode("Not a Set :(");
      let cardText = document.createElement("p");
      cardText.appendChild(text);
      cardText.classList.add("hidden");
      currentCard.appendChild(cardText);
      if (checkExists === null) {
        unique = true;
        currentCard.id = cardID;
        // generate images in card
        for (let j = 0; j < selectedCount; j++) {
          let img = document.createElement("img");
          img.src =
            "img/" +
            selectedStyle +
            "-" +
            selectedShape +
            "-" +
            selectedColor +
            ".png";
          currentCard.appendChild(img);
        }
        function currentClick() {
          clickCard(cardID);
        }
        currentCard.addEventListener("click", currentClick);
      }
    }
    return currentCard;
  }

  /**
   * adds the clicked card to the current selected cards
   * @param {string} cardID - the ID of the clicked card
   */
  function clickCard(cardID) {
    if (seconds > 0) {
      if (selectedCards[0] !== cardID && selectedCards[1] !== cardID) {
        selectedCards[selectedCards.length] = cardID;
        document.getElementById(cardID).style.boxShadow = "6px 6px #636363";
      }
      if (selectedCards.length >= 3) {
        let traits1 = selectedCards[0].split("-");
        let traits2 = selectedCards[1].split("-");
        let traits3 = selectedCards[2].split("-");
        let passed = [];
        passed[0] = checkStyle(traits1, traits2, traits3);
        passed[1] = checkShape(traits1, traits2, traits3);
        passed[2] = checkColor(traits1, traits2, traits3);
        passed[3] = checkCount(traits1, traits2, traits3);
        if (passed[0] === true &&
            passed[1] === true &&
            passed[2] === true &&
            passed[3] === true) { // is a set
          score++;
          let setCount = document.getElementById("set-count");
          setCount.innerText = score;
          for(let i = 0; i < 3; i++) { // hide shapes and show "SET" text
            let currentCard = document.getElementById(selectedCards[i]);
            let shapes = currentCard.getElementsByTagName("img");
            for (let j = 0; j < shapes.length; j++) {
              shapes[j].classList.add("hidden");
            }
            let text = document.createTextNode("SET!");
            let cardText = document.createElement("p");
            cardText.appendChild(text);
            currentCard.appendChild(cardText);
          }
          removeShadow();
          // replace cards with new cards after 1 second
          textTimer = setTimeout(replaceCards, 1000);
        } else { // not a set
          for(let i = 0; i < 3; i++) { // hide shapes and replace with text
            let currentCard = document.getElementById(selectedCards[i]);
            let shapes = currentCard.getElementsByTagName("img");
            for (let j = 0; j < shapes.length; j++) {
              shapes[j].classList.add("hidden");
            }
            let cardText = currentCard.getElementsByTagName("p");
            for (let j = 0; j < cardText.length; j++) {
              cardText[j].classList.remove("hidden");
            }
          }
          // change time for incorrect sets
          let getTimer = document.getElementsByTagName("select")[0].value; // get desired time
          if (getTimer !== "none") {
            seconds = seconds - 15;
          } else {
            seconds = seconds + 15;
          }
          removeShadow();
          // restore shapes after 1 second
          textTimer = setTimeout(restoreShapes, 1000);
        }
      }
    }
  }

  // afer incorrect set, restores the shapes and removes the "not a set" text
  function restoreShapes() {
    for (let i = 0; i < selectedCards.length; i++) {
      removeShadow();
      let currentCard = document.getElementById(selectedCards[i]);
      let shapes = currentCard.getElementsByTagName("img");

      // show shape
      for (let j = 0; j < shapes.length; j++) {
        shapes[j].classList.remove("hidden");
      }

      // hide text
      let cardText = currentCard.getElementsByTagName("p");
      for (let j = 0; j < cardText.length; j++) {
        cardText[j].classList.add("hidden");
      }
    }
    selectedCards = []; // reset clicked cards
  }

  // removes boxShadow once cards become unselected
  function removeShadow() {
    for (let i = 0; i < selectedCards.length; i++) {
      document.getElementById(selectedCards[i]).style.boxShadow = "none";
    }
  }

  // after correct set, replace new cards after 1 set
  function replaceCards() {
    let game = document.getElementById("game");
    removeShadow();
    for (let i = 0; i < selectedCards.length; i++) {
      let newCard = genCard();
      let oldCard = document.getElementById(selectedCards[i]);
      game.replaceChild(newCard, oldCard);
    }
    selectedCards = []; // reset clicked cards
  }


  /**
   * adds the clicked card to the current selected cards
   * @param {string} traits1 - the ID of the first clicked card
   * @param {string} traits2 - the ID of the second clicked card
   * @param {string} traits3 - the ID of the third clicked card
   * @return {boolean} boolean that tells whether all 3 cards or none share the same style
   */
  function checkStyle(traits1, traits2, traits3, passed) {
    if (traits1[0] === traits2[0] && traits1[0] === traits3[0]) {
      return true;
    } else if (
      traits1[0] !== traits2[0] &&
      traits1[0] !== traits3[0] &&
      traits2[0] !== traits3[0]
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * adds the clicked card to the current selected cards
   * @param {string} traits1 - the ID of the first clicked card
   * @param {string} traits2 - the ID of the second clicked card
   * @param {string} traits3 - the ID of the third clicked card
   * @return {boolean} boolean that tells whether all 3 cards or none share the same shape
   */
  function checkShape(traits1, traits2, traits3, passed) {
    if (traits1[1] === traits2[1] && traits1[1] === traits3[1]) {
      return true;
    } else if (
      traits1[1] !== traits2[1] &&
      traits1[1] !== traits3[1] &&
      traits2[1] !== traits3[1]
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * adds the clicked card to the current selected cards
   * @param {string} traits1 - the ID of the first clicked card
   * @param {string} traits2 - the ID of the second clicked card
   * @param {string} traits3 - the ID of the third clicked card
   * @return {boolean} boolean that tells whether all 3 cards or none share the same color
   */
  function checkColor(traits1, traits2, traits3, passed) {
    if (traits1[2] === traits2[2] && traits1[2] === traits3[2]) {
      return true;
    } else if (
      traits1[2] !== traits2[2] &&
      traits1[2] !== traits3[2] &&
      traits2[2] !== traits3[2]
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * adds the clicked card to the current selected cards
   * @param {string} traits1 - the ID of the first clicked card
   * @param {string} traits2 - the ID of the second clicked card
   * @param {string} traits3 - the ID of the third clicked card
   * @return {boolean} boolean that tells whether all 3 cards or none share the same count
   */
  function checkCount(traits1, traits2, traits3, passed) {
    if (traits1[3] === traits2[3] && traits1[3] === traits3[3]) {
      return true;
    } else if (
      traits1[3] !== traits2[3] &&
      traits1[3] !== traits3[3] &&
      traits2[3] !== traits3[3]
    ) {
      return true;
    } else {
      return false;
    }
  }

  // ends the current game and clears the board, and returns to the main menu
  function returnMain() {
    removeShadow();
    clearInterval(timer);
    timer = null;
    seconds = 0;
    score = 0;
    selectedCards = [];
    clearBoard();
    // show main menu
    let menu = document.getElementById("menu-view");
    menu.classList.remove("hidden");

    // hide game
    let game = document.getElementById("game-view");
    game.classList.add("hidden");
  }

  // ends the current game
  function endGame() {
    let refreshBoard = document.getElementById("refresh");
    refreshBoard.removeEventListener("click", newBoard);
    removeShadow();
    clearInterval(timer);
    timer = null;
    seconds = 0;
    restoreShapes();
    selectedCards = [];
  }
})();
