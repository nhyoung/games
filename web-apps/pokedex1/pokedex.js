/*
  Name: Nicholas Young
  Date: 05/07/2019

  This is a page that provides the functionality for the pokedex.
*/
(function(){
  "use strict";
  let myPokemon;
  let guid;
  let pid;

  window.addEventListener("load", init);
  const URL_BASE = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/";

  /**
  initialize get doge button
  */
  function init() {
    getInitSprites();
  }

  /**
  * fetch a random dog image
  */
  function getInitSprites() {
    let url = URL_BASE + "pokedex.php?pokedex=all";
    fetch(url)
      .then(checkStatus)
      //.then(JSON.parse)
      .then(initializeSprites)
      .catch(console.error);
  }

  /**
  * @param {object} responseData JavaScript object from the Dog API fetch
  * @return {array} array of long and short names of all pokemon
  */
  function initializeSprites(responseData) {
    let pokedex = document.getElementById("pokedex-view");
    let pokemon = responseData.split("\n");
    let spriteURL = URL_BASE + "sprites/";
    for (let i = 0; i < pokemon.length; i++) {
      let current = pokemon[i].split(":");
      let short = current[1];
      let image = document.createElement("img");
      image.src = spriteURL + short + ".png";
      image.alt = short;
      image.id = short;
      image.classList.add("sprite");
      pokedex.appendChild(image);
    }
    let bulbasaur = document.getElementById("bulbasaur");
    let charmander = document.getElementById("charmander");
    let squirtle = document.getElementById("squirtle");
    pokemonFound(bulbasaur);
    pokemonFound(charmander);
    pokemonFound(squirtle);
    return pokemon;
  }

  /**
  * @param {object} name pokemon to "find"
  */
  function pokemonFound(name) {
    name.classList.add("found");
    name.addEventListener("click", getPlayerInfo);
  }

  /**
  * fetch info about given pokemon
  */
  function getPlayerInfo() {
    myPokemon = this.id;
    let infoURL = URL_BASE + "pokedex.php?pokemon=" + this.id;
    fetch(infoURL)
      .then(checkStatus)
      .then(JSON.parse)
      .then(fillCardP1)
      .catch(console.error);
  }

  /**
  * @param {promise} responseData response data from web api with data about specific pokemon
  */
  function fillCardP1(responseData) {
    let card = document.getElementById("p1");
    fill(responseData, card);
    // show start button
    let start = document.getElementById("start-btn");
    start.classList.remove("hidden");
    start.addEventListener("click", initializeGame);

    // allow user to click and use moves
    let buttons = card.querySelector(".moves").getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener("click", useMove);
    }
  }

  /**
  * uses a move by clicking on move button and sends POST request to API for web service to handle
  * move and battle sequence
  */
  function useMove() {
    document.getElementById("loading").classList.remove("hidden");
    const API_URL = "game.php";
    // Create a new "FormData" object
    let data =  new FormData();
    // Add the various parameters to the FormData object
    data.append("guid", guid);
    data.append("pid", pid);
    let selectedMove = this.querySelector(".move").innerText.toLowerCase().replace(/\s+/, "");
    data.append("movename", selectedMove);
    // // Fetch now with a method of Post and the data in the body
    fetch(URL_BASE + API_URL, {method: "POST", body: data})
      .then(checkStatus)
      .then(JSON.parse)
      .then(postMove)
      .catch(console.error);
  }

  /**
  * @param {object} responseData JavaScript object from the Pokedex API fetch
  */
  function postMove(responseData) {
    // console.log(responseData);
    let resultsContainer = document.getElementById("results-container");
    let p1Results = document.getElementById("p1-turn-results");
    let p2Results = document.getElementById("p2-turn-results");
    p1Results.innerHTML = "";
    p2Results.innerHTML = "";
    resultsContainer.classList.remove("hidden");
    p1Results.classList.remove("hidden");
    p2Results.classList.remove("hidden");
    p1Results.innerText = "Player 1 played " + responseData.results["p1-move"] + " and "
      + responseData.results["p1-result"] + "!";
    if (responseData.p2["current-hp"] !== 0
        && (responseData.results["p2-move"] !== null
        && responseData.results["p2-result"] !== null)) {
        p2Results.innerText = "Player 2 played " + responseData.results["p2-move"] + " and "
          + responseData.results["p2-result"] + "!";
    } else {
      p2Results.classList.add("hidden");
    }

    updateHP(responseData);
    applyBuffs(responseData);

    if (responseData.p1["current-hp"] === 0 || responseData.p2["current-hp"] === 0) {
      endGame(responseData);
    }
    document.getElementById("loading").classList.add("hidden");
  }

  /**
  * @param {object} responseData JavaScript object from the Pokedex API fetch
  */
  function updateHP(responseData) {
    let healthBars = document.querySelectorAll(".health-bar");
    let p1Health = responseData.p1["current-hp"] / responseData.p1["hp"] * 100;
    let p2Health = responseData.p2["current-hp"] / responseData.p2["hp"] * 100;
    healthBars[0].style.width = p1Health + "%";
    healthBars[1].style.width = p2Health + "%";
    if (p1Health < 20) {
      healthBars[0].classList.add("low-health");
    }

    if (p2Health < 20) {
      healthBars[1].classList.add("low-health");
    }
    document.getElementById("p1").querySelector(".hp").innerText
      = responseData.p1["current-hp"] + "HP";
    document.getElementById("p2").querySelector(".hp").innerText
      = responseData.p2["current-hp"] + "HP";
  }

  /**
  * @param {object} responseData JavaScript object from the Pokedex API fetch
  */
  function applyBuffs(responseData) {
    let p1Buffs = document.getElementById("p1").querySelector(".buffs");
    let p2Buffs = document.getElementById("p2").querySelector(".buffs");
    p1Buffs.innerHTML = "";
    p2Buffs.innerHTML = "";
    for (let i  = 0; i < responseData.p1.buffs.length; i++) {
      let buff = document.createElement("DIV");
      buff.classList.add("buff");
      let currentType = responseData.p1.buffs[i];
      buff.classList.add(currentType);
      p1Buffs.appendChild(buff);
    }

    for (let i  = 0; i < responseData.p1.debuffs.length; i++) {
      let debuff = document.createElement("DIV");
      debuff.classList.add("debuff");
      let currentType = responseData.p1.debuffs[i];
      debuff.classList.add(currentType);
      p1Buffs.appendChild(debuff);
    }
    for (let i  = 0; i < responseData.p2.buffs.length; i++) {
      let buff = document.createElement("DIV");
      buff.classList.add("buff");
      let currentType = responseData.p2.buffs[i];
      buff.classList.add(currentType);
      p2Buffs.appendChild(buff);
    }

    for (let i  = 0; i < responseData.p2.debuffs.length; i++) {
      let debuff = document.createElement("DIV");
      debuff.classList.add("debuff");
      let currentType = responseData.p2.debuffs[i];
      debuff.classList.add(currentType);
      p1Buffs.appendChild(debuff);
    }
  }

  /**
  * @param {object} responseData JavaScript object from the Pokedex API fetch
  */
  function endGame(responseData) {
    if (responseData.p1["current-hp"] === 0) {
      document.getElementsByTagName("h1")[0].innerText = "You lost!";
    } else {
      document.getElementsByTagName("h1")[0].innerText = "You won!";
    }
    let endButton = document.getElementById("endgame");
    endButton.classList.remove("hidden");
    document.getElementById("flee-btn").classList.add("hidden");
    let p1 = document.getElementById("p1");
    let p1Buttons = p1.getElementsByClassName("moves")[0].getElementsByTagName("button");
    for (let i = 0; i < p1Buttons.length; i++) {
      p1Buttons[i].disabled = true;
    }
    /**
    * upon clicking return button, ends the game and reverts the view back to its original view
    */
    function clickEnd() {
      let endButton = document.getElementById("endgame");
      endButton.classList.add("hidden");
      let p1Results = document.getElementById("p1-turn-results");
      let p2Results = document.getElementById("p2-turn-results");
      p1Results.classList.add("hidden");
      p2Results.classList.add("hidden");
      document.getElementById("results-container").classList.add("hidden");
      document.getElementById("p2").classList.add("hidden");
      document.getElementById("start-btn").classList.remove("hidden");
      document.getElementById("pokedex-view").classList.remove("hidden");
      document.getElementsByTagName("h1")[0].innerText = "Your Pokedex";
      let buffs = document.getElementsByClassName("buffs");
      for (let i = 0; i < buffs.length; i++) {
        buffs[i].classList.add("hidden");
      }
      p1.querySelector(".hp").innerText = responseData.p1["hp"] + "HP";
      document.querySelector(".hp-info").classList.add("hidden");
      if (responseData.p2["current-hp"] === 0) {
        pokemonFound(document.getElementById(responseData.p2.shortname));
      }
    }
    endButton.addEventListener("click", clickEnd);
  }



  /**
  * @param {promise} responseData response data from web api with data about specific pokemon
  * @param {object} card current card to fill
  */
  function fill(responseData, card) {
    let cardName = card.querySelector(".name");
    cardName.innerText = responseData.name;

    let pokePic = card.querySelector(".pokepic");
    pokePic.src = URL_BASE + responseData.images.photo;
    pokePic.alt = responseData.shortname;

    let type = card.querySelector(".type");
    type.src = URL_BASE + responseData.images.typeIcon;

    let weakness = card.querySelector(".weakness");
    weakness.src = URL_BASE + responseData.images.weaknessIcon;

    let hp = card.querySelector(".hp");
    hp.innerText = responseData.hp + "HP";

    let info = card.querySelector(".info");
    info.innerText = responseData.info.description;

    let buttons = card.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("hidden");
    }

    let move = card.querySelectorAll(".move");
    let currentMoves = responseData.moves;
    for (let i = 0; i < currentMoves.length; i++) {
      move[i].innerText = currentMoves[i].name;
    }

    let moveTypes = card.querySelector(".moves").getElementsByTagName("img");
    for (let i = 0; i < currentMoves.length; i++) {
      moveTypes[i].src = URL_BASE + "icons/" + responseData.moves[i].type + ".jpg";
    }

    let dp = card.querySelectorAll(".dp");
    for (let i = 0; i < dp.length; i++) {
      dp[i].innerHTML = "";
    }
    for (let i = 0; i < currentMoves.length; i++) {
      if (currentMoves[i].hasOwnProperty("dp")) {
        dp[i].innerText = currentMoves[i].dp + "DP";
      }
    }

    for (let i = currentMoves.length; i < buttons.length; i++) {
      buttons[i].classList.add("hidden");
    }
  }


  /**
  starts the game after clicking the start button
  */
  function initializeGame() {
    let pokedexView = document.getElementById("pokedex-view");
    pokedexView.classList.add("hidden");
    let p2 = document.getElementById("p2");
    p2.classList.remove("hidden");
    let p1Results = document.getElementById("p1-turn-results");
    let p2Results = document.getElementById("p2-turn-results");
    p1Results.innerHTML = "";
    p2Results.innerHTML = "";
    let healthBars = document.querySelectorAll(".hp-info");
    for (let i = 0; i < healthBars.length; i++) {
      healthBars[i].querySelector(".health-bar").style.width = "100%";
      healthBars[i].querySelector(".health-bar").classList.remove("low-health");
      healthBars[i].classList.remove("hidden");
    }
    let results = document.getElementById("results-container");
    results.classList.remove("hidden");
    let flee = document.getElementById("flee-btn");
    flee.classList.remove("hidden");
    flee.addEventListener("click", fleeBattle);
    let start = document.getElementById("start-btn");
    start.classList.add("hidden");
    let moves = document.getElementsByTagName("button");
    let p1Buffs = document.getElementById("p1").querySelector(".buffs");
    let p2Buffs = document.getElementById("p2").querySelector(".buffs");
    p1Buffs.innerHTML = "";
    p2Buffs.innerHTML = "";
    for (let i = 0; i < moves.length; i++) {
      moves[i].disabled = false;
    }
    requestGame();
  }

  /**
  * upon clicking flee button, sends POST request wih move "flee"
  */
  function fleeBattle() {
    document.getElementById("loading").classList.remove("hidden");
    const API_URL = "game.php";
    // Create a new "FormData" object
    let data =  new FormData();
    // Add the various parameters to the FormData object
    data.append("guid", guid);
    data.append("pid", pid);
    data.append("movename", "flee");
    // // Fetch now with a method of Post and the data in the body
    fetch(URL_BASE + API_URL, {method: "POST", body: data})
      .then(checkStatus)
      .then(JSON.parse)
      .then(postMove)
      .catch(console.error);
  }

  /**
  sends POST request to game.php
  */
  function requestGame() {
    const API_URL = "game.php";
    // Create a new "FormData" object
    let data =  new FormData();
    // Add the various parameters to the FormData object
    data.append("startgame", "true");
    data.append("mypokemon", myPokemon);
    // Fetch now with a method of Post and the data in the body
    fetch(URL_BASE + API_URL, {method: "POST", body: data})
      .then(checkStatus)
      .then(JSON.parse)
      .then(handleGame)
      .catch(console.error);
  }

  /**
  * @param {promise} responseData response from the pokedex API
  */
  function handleGame(responseData) {
    guid = responseData.guid;
    pid = responseData.pid;
    let buffs = document.getElementsByClassName("buffs");
    for (let i = 0; i < buffs.length; i++) {
      buffs[i].classList.remove("hidden");
    }
    let opponent = responseData.p2.name;
    getOpponentInfo(opponent);
  }

  /**
  * @param {object} opponent JavaScript object representing the name of the opposing pokemon
  */
  function getOpponentInfo(opponent) {
    let infoURL = URL_BASE + "pokedex.php?pokemon=" + opponent;
    fetch(infoURL)
      .then(checkStatus)
      .then(JSON.parse)
      .then(fillCardP2)
      .catch(console.error);
  }

  /**
  * @param {object} responseData JavaScript object from the Pokedex API fetch
  */
  function fillCardP2(responseData) {
    let card = document.getElementById("p2");
    fill(responseData, card);
  }

  /**
  * @param {promise} response response from the API
  * @return {promise} error message telling status of request
  */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();
