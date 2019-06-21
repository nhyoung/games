/*
  Name: Nicholas Young
  Date: 05/21/2019

  This is a page that provides the functionality for the program to retrieve data about different
  books and populate the page with books
*/
(function(){
  "use strict";

  const URL_BASE = "bestreads.php";
  window.addEventListener("load", init);

  /**
  * initialize home and back buttons and display book-list view
  */
  function init() {
    requestBooks();
    document.getElementById("home").addEventListener("click", clickHome);
    document.getElementById("back").addEventListener("click", clickBack);
    document.getElementById("search-btn").addEventListener("click", searchBook);
  }

  /**
  * when home button clicked, disable it, clear search box, hide back button
  * and display book-list view after requesting all books
  */
  function clickHome() {
    document.getElementById("home").disabled = true;
    document.getElementById("search-term").value = "";
    document.getElementById("back").classList.add("hidden");
    showBookList();
    requestBooks();
  }

  /**
  * when back button clicked, hide back button and display book-list view
  */
  function clickBack() {
    document.getElementById("back").classList.add("hidden");
    showBookList();
  }

  /**
  * displays the book list view and hides error and single book views
  */
  function showBookList() {
    document.getElementById("book-list").classList.remove("hidden");
    document.getElementById("error-text").classList.add("hidden");
    document.getElementById("single-book").classList.add("hidden");
  }

  /**
  * request all books from bestreads.php web service
  */
  function requestBooks() {
    let url = URL_BASE + "?mode=books";
    fetch(url)
      .then(checkStatusText)
      .then(JSON.parse)
      .then(fillAllBooks)
      .catch(handleRequestError);
  }

  /**
  * @param {JSON} responseData JSON response from the API with book title and folder
  */
  function fillAllBooks(responseData) {
    let bookList = document.getElementById("book-list");
    bookList.innerHTML = "";
    let books = responseData.books;
    for (let i = 0; i < books.length; i++) {
      bookList.appendChild(createBookCard(books[i]));
    }
  }

  /**
  * @param {JSON} book JSON response from the API
  * @return {object} clickable HTML div "card" including the title and cover image of the
  *  current book
  */
  function createBookCard(book) {
    let currentCard = document.createElement("div");
    let cardImage = document.createElement("img");
    cardImage.src = "books/" + book.folder + "/cover.jpg";
    cardImage.alt = "cover image";
    currentCard.appendChild(cardImage);
    let cardTitle = document.createElement("p");
    cardTitle.appendChild(document.createTextNode(book.title));
    currentCard.appendChild(cardTitle);
    currentCard.classList.add("selectable");
    currentCard.id = book.folder;
    currentCard.addEventListener("click", clickBook);
    return currentCard;
  }

  /**
  * @param {string} title string of the title of the current book
  * @return {promise} response from the API
  */
  function getBookInfo(title) {
    let url = URL_BASE + "?mode=info&title=" + title;
    return fetch(url)
      .then(checkStatusJSON)
      .then(function(response) {
        return response;
      })
      .catch(handleRequestError);
  }

  /**
  * @param {string} title string of the title of the current book
  * @return {promise} response from the API
  */
  function getBookDescription(title) {
    let url = URL_BASE + "?mode=description&title=" + title;
    return fetch(url)
      .then(checkStatusText)
      .then(function(response) {
        return response;
      })
      .catch(handleRequestError);
  }

  /**
  * @param {string} title string of the title of the current book
  */
  function getBookReviews(title) {
    let url = URL_BASE + "?mode=reviews&title=" + title;
    fetch(url)
      .then(checkStatusText)
      .then(fillReviews)
      .catch(handleRequestError);
  }

  /**
  * after clicking book card, populate single book view with book details (review, rating, title,
  * author, description, etc.)
  */
  function clickBook() {
    document.getElementById("book-list").classList.add("hidden");
    let single = document.getElementById("single-book");
    single.classList.remove("hidden");
    document.getElementById("back").classList.remove("hidden");
    let img = single.getElementsByTagName("IMG")[0];
    img.src = "books/" + this.id + "/cover.jpg";
    img.alt = "cover image";
    getBookInfo(this.id).then(function(responseData) {
      fillInfo(responseData);
    });
    getBookDescription(this.id).then(function(responseData) {
      fillDescription(responseData);
    });
    getBookReviews(this.id);
  }

  /**
  * @param {promise} responseData JSON representing current book title and author
  */
  function fillInfo(responseData) {
    let bookTitle = document.getElementById("book-title");
    bookTitle.innerHTML = "";

    let bookAuthor = document.getElementById("book-author");

    let dataTitle = responseData.title;
    let titleNode = document.createTextNode(dataTitle);
    bookTitle.appendChild(titleNode);

    let dataAuthor = responseData.author;
    let authorNode = document.createTextNode(dataAuthor);
    bookAuthor.innerHTML = "";
    bookAuthor.appendChild(authorNode);
  }

  /**
  * @param {promise} responseData text representing description of current book
  */
  function fillDescription(responseData) {
    let bookDescription = document.getElementById("book-description");
    bookDescription.innerHTML = "";

    let descriptionNode = document.createTextNode(responseData);
    bookDescription.appendChild(descriptionNode);
  }

  /**
  * @param {promise} responseData JSON representing current book reviews and ratings
  */
  function fillReviews(responseData) {
    let bookReviews = document.getElementById("book-reviews");
    bookReviews.innerHTML = "";

    let data = JSON.parse(responseData);

    for(let i = 0; i < data.length; i++) {
      let reviewerName = document.createElement("h3");
      reviewerName.appendChild(document.createTextNode(data[i].name));
      bookReviews.appendChild(reviewerName);

      let rating = document.createElement("h4");
      rating.appendChild(document.createTextNode("Rating: " + data[i].rating));
      bookReviews.appendChild(rating);

      let reviewText = document.createElement("p");
      reviewText.appendChild(document.createTextNode(data[i].text));
      bookReviews.appendChild(reviewText);
    }

    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].rating;
    }
    total = total / data.length;
    let finalRating = total.toFixed(1);
    let overall = document.getElementById("book-rating");
    overall.innerHTML = "";
    overall.appendChild(document.createTextNode(finalRating));
  }

  /**
  * search for a specific book in search box,
  */
  function searchBook() {
    let search = document.getElementById("search-term").value.trim();
    if (search !== "") {
      let url = URL_BASE + "?mode=books&search=" + search;
      fetch(url)
        .then(checkStatusText)
        .then(JSON.parse)
        .then(fillSearch)
        .catch(handleRequestError);
    }
  }

  /**
  * @param {promise} responseData JSON representing current book title and folder
  */
  function fillSearch(responseData) {
    document.getElementById("back").classList.add("hidden");
    document.getElementById("home").disabled = false;
    if (responseData.books.length === 0) {
      showError();
    } else {
      fillAllBooks(responseData);
      showBookList();
    }
  }

  /**
  * display error text telling user that searched book cannot be found
  */
  function showError() {
    document.getElementById("book-list").classList.add("hidden");
    document.getElementById("error-text").classList.remove("hidden");
    document.getElementById("single-book").classList.add("hidden");
    document.getElementById("back").classList.add("hidden");
    let error = document.getElementById("error-text");
    error.innerHTML = "";
    let errorText = document.createTextNode("No books found that match the search string '"
        + document.getElementById("search-term").value.trim() + "', please try again.");
    error.appendChild(errorText);
    document.getElementById("home").disabled = false;
  }

  /**
  * display error text telling user something went wrong with request
  */
  function handleRequestError() {
    let result = document.getElementById("error-text");
    // remove all existing text
    result.innerHTML = '';
    result.innerText = "Something went wrong with the request. Please try again later.";
  }

  /**
  * @param {promise} response response from the API
  * @return {promise} error message telling status of request
  */
  function checkStatusText(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.text();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }

  /**
  * @param {promise} response response from the API
  * @return {promise} error message telling status of request
  */
  function checkStatusJSON(response) {
    if (response.status >= 200 && response.status < 300) {
      return response.json();
    } else {
      return Promise.reject(new Error(response.status + ": " + response.statusText));
    }
  }
})();
