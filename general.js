const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Task 10: Get all books using Async/Await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = new Promise((resolve) => {
      resolve(books);
    });
    const bookList = await getBooks;
    return res.status(200).json(bookList);
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving books", error: error.message });
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  
  new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  })
  .then((book) => res.status(200).json(book))
  .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on Author using Async/Await
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const matchingBooks = [];
      const keys = Object.keys(books);
      
      keys.forEach((key) => {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          matchingBooks.push({ isbn: key, ...books[key] });
        }
      });
      
      if (matchingBooks.length > 0) {
        resolve(matchingBooks);
      } else {
        reject("No books found by this author");
      }
    });

    const result = await getBooksByAuthor;
    return res.status(200).json(result);
  } catch (error) {
    return res.status(404).json({ message: error });
  }
});

// Task 13: Get book details based on Title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;

  new Promise((resolve, reject) => {
    const matchingBooks = [];
    const keys = Object.keys(books);
    
    keys.forEach((key) => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        matchingBooks.push({ isbn: key, ...books[key] });
      }
    });

    if (matchingBooks.length > 0) {
      resolve(matchingBooks);
    } else {
      reject("No books found with this title");
    }
  })
  .then((result) => res.status(200).json(result))
  .catch((err) => res.status(404).json({ message: err }));
});

module.exports.general = public_users;
