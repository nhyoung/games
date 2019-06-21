<?php
/*
  Name: Nicholas Young
  Date: 05/21/2019
  This is is a web service that allows a user to get data about different books.Based on the
  input parameters supplied using GET requests, the API outputs different details about puppies
  Web Service details:
  =====================================================================
  Required GET parameters:
  - mode
    - if mode is "books", parameter "search" is optional
    - if mode is "description," "info," or "reviews," parameter "title" also required
  Output formats:
  - Plain text and JSON
  Output Details:
  - If the type parameter is passed and set to "description", the API
    will take in the title of a book and output the description of the book as plain text.
  - If the type parameter is passed and set to "books," "info," or "reviews," the respective
    information is returned as JSON.
  - Else outputs 400 error message as plain text.
 */

  requestBooks();

  /*
  * requests books with parameter "mode", which can be set to "books," "description," "info," or
  * "reviews"
  */
  function requestBooks() {
    if (isset($_GET["mode"])) {
      $mode = $_GET["mode"];

      if ($mode === "books") {
        mode_books();
      } else if ($mode === "description") {
        mode_description();
      } else if ($mode === "info") {
        mode_info();
      } else if ($mode === "reviews") {
        mode_reviews();
      } else  {
        header("Content-type: text/plain");
        header("HTTP/1.1 400 Invalid Request");
        echo "Please provide a mode of description, info, reviews, or books.";
      }
    } else {
      header("Content-type: text/plain");
      header("HTTP/1.1 400 Invalid Request");
      echo "Please provide a mode of description, info, reviews, or books.";
    }
  }

  /*
  * - if the "mode" parameter is passed as "books," and optional "search" parameter not passed,
  * will return the title and folder location of each book
  * - if the "mode" parameter is passed as "books," and optional "search" parameter IS passed,
  * will return the title and folder location of each book that contains the search term in its
  * title in JSON form
  */
  function mode_books() {
    $output = array();
    $all_books = array_diff(scandir("books"), array(".", ".."));
    $books = array();
    foreach ($all_books as $path) {
      $current = array();
      $current["title"] = trim(file("books/" . $path . "/info.txt" , FILE_IGNORE_NEW_LINES)[0]);
      $current["folder"] = $path;
      if (isset($_GET["search"])) {
        $search = $_GET["search"];
        if (strpos($current["title"], $search) !== false) {
          array_push($books, $current);
        }
      } else {
        array_push($books, $current);
      }
    }
    $output["books"] = $books;
    header("Content-type: application/json");
    echo json_encode($output, JSON_PRETTY_PRINT);
  }

  /*
  * - if the "mode" parameter is passed as "description," and required "title" parameter not passed,
  * gives a 400 error
  * - if the "mode" parameter is passed as "description," and required "title" parameter IS passed,
  * will return the description of the given book in plain text form
  */
  function mode_description() {
    if (isset($_GET["title"])) {
      $title = $_GET["title"];
      $current_book = glob("books/" . $title);
      if ($current_book === false) {
        header("Content-type: text/plain");
        echo "No description for " . $title ." was found.";
      } else {
        header("Content-type: text/plain");
        echo file_get_contents("books/" . $title . "/description.txt");
      }
    } else {
      header("Content-type: text/plain");
      header("HTTP/1.1 400 Invalid Request");
      echo "Please remember to add the title parameter when using mode=description.";
    }
  }

  /*
  * - if the "mode" parameter is passed as "info," and required "title" parameter not passed,
  * gives a 400 error
  * - if the "mode" parameter is passed as "info," and required "title" parameter IS passed,
  * will return the title and author of the given book in JSON form
  */
  function mode_info() {
    if (isset($_GET["title"])) {
      $title = $_GET["title"];
      $current_book = glob("books/" . $title);
      if ($current_book === false) {
        header("Content-type: text/plain");
        echo "No info for " . $title ." was found.";
      } else {
        $output = array();
        $output["title"] = trim(file("books/" . $title . "/info.txt" , FILE_IGNORE_NEW_LINES)[0]);
        $output["author"] = trim(file("books/" . $title . "/info.txt" , FILE_IGNORE_NEW_LINES)[1]);
        header("Content-type: application/json");
        echo json_encode($output, JSON_PRETTY_PRINT);
      }
    } else {
      header("Content-type: text/plain");
      header("HTTP/1.1 400 Invalid Request");
      echo "Please remember to add the title parameter when using mode=info.";
    }
  }

  /*
  * - if the "mode" parameter is passed as "reviews," and required "title" parameter not passed,
  * gives a 400 error
  * - if the "mode" parameter is passed as "reviews," and required "title" parameter IS passed,
  * will return the reviews, rating, and their authors about the given book in JSON form
  */
  function mode_reviews() {
    if (isset($_GET["title"])) {
      $title = $_GET["title"];
      $output = array();
      $current_book = glob("books/" . $title . "/*");
      if ($current_book === false) {
        header("Content-type: text/plain");
        echo "No info for " . $title ." was found.";
      } else {
        $reviews = array();
        for ($i = 0; $i < count($current_book); $i++) {
          if (strpos($current_book[$i], "review") !== false) {
            array_push($reviews, $current_book[$i]);
          }
        }
        for ($i = 0; $i < count($reviews); $i++) {
          $current = array();
          $current["name"] = trim(file("books/" . $title . "/review" . ($i + 1) . ".txt" , FILE_IGNORE_NEW_LINES)[0]);
          $current["rating"] = (int)trim(file("books/" . $title . "/review" . ($i + 1). ".txt" , FILE_IGNORE_NEW_LINES)[1]);
          $current["text"] = trim(file("books/" . $title . "/review" . ($i + 1). ".txt" , FILE_IGNORE_NEW_LINES)[2]);
          array_push($output, $current);
        }
        header("Content-type: application/json");
        echo json_encode($output, JSON_PRETTY_PRINT);
      }
    } else {
      header("Content-type: text/plain");
      header("HTTP/1.1 400 Invalid Request");
      echo "Please remember to add the title parameter when using mode=info.";
    }
  }
?>
