/*
  Name: Nicholas Young
  Date: 05/01/2019

  This is a page that provides the functionality for the random dog getter.
*/
(function(){
  "use strict";

  window.addEventListener("load", init);
  const URL_BASE = "https://dog.ceo";

  /**
  initialize get doge button
  */
  function init() {
    let button = document.getElementById("get-doge");
    button.addEventListener("click", callAJAX);
  }

  /**
  * fetch a random dog image
  */
  function callAJAX() {
    let url = URL_BASE + "/api/breeds/image/random";
    fetch(url)
      .then(checkStatus)
      .then(JSON.parse)
      .then(successFunction)
      .catch(console.log);
  }


  /**
  * @param {object} responseData JavaScript object from the Dog API fetch
  */
  function successFunction(responseData) {
    let main = document.getElementById("result");
    // remove all existing images
    let checkImages = main.getElementsByTagName("img");
    for(let i = 0; i < checkImages.length; i++) {
      checkImages[i].remove();
    }

    /**
     add image
    */
    let image = document.createElement("img");
    image.src = responseData.message;
    main.appendChild(image);
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
