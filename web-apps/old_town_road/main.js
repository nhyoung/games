/*
  Name: Nicholas Young
  Date: 05/17/2019

  This is a page that provides the functionality for the random lyric generator for "Old Town Road".
*/
(function(){
  "use strict";

  const URL_BASE = "oldtownroad.php";
  let selectedLyric;
  window.addEventListener("load", init);

  /**
  initialize buttons
  */
  function init() {
    let buttons = document.querySelectorAll(".retrieve");
    buttons[0].addEventListener("click", getSingleLine);
    buttons[1].addEventListener("click", getAllLines)
  }

  /**
  * fetch a random single lyric from "Old Town Road"
  */
  function getSingleLine() {
    selectedLyric = "line" + Math.floor(Math.random() * 9);
    let url = URL_BASE + "?lyric=" + selectedLyric;
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(singleLineSuccess)
      .catch(handleRequestErrorSingle);
  }

  /**
  * @param {object} responseData JavaScript object in JSON notation representing one line of lyrics
  */
  function singleLineSuccess(responseData) {
    let result = document.getElementById("result");
    // remove all existing text
    result.innerHTML = '';
    result.innerText = responseData.result;
  }

  /**
  * fetch all lyrics from "Old Town Road"
  */
  function getAllLines() {
    let url = URL_BASE + "?lyric=all";
    fetch(url)
      .then(checkStatus)
      //.then(JSON.parse)
      .then(allLinesSuccess)
      .catch(handleRequestErrorAll);
  }

  /**
  * @param {object} responseData JavaScript object from the lyric fetch in plain text
  */
  function allLinesSuccess(responseData) {
    let result = document.getElementById("result");
    // remove all existing text
    result.innerHTML = '';
    result.innerText = responseData;
  }

  /**
  * displays an error message on the page when there is an error retrieving the random single line
  */
  function handleRequestErrorSingle() {
    let result = document.getElementById("result");
    // remove all existing text
    result.innerHTML = '';
    result.innerText = "There was an error getting a random line. Please check your connection";
  }

  /**
  * displays an error message on the page when there is an error retrieving all lyrics
  */
  function handleRequestErrorAll() {
    let result = document.getElementById("result");
    // remove all existing text
    result.innerHTML = '';
    result.innerText = "There was an error getting all of the lyrics. Please check your connection";
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
