
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');

const public_users = express.Router();

// Get all books using async/await and Axios
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://openlibrary.org/subjects/fiction.json?limit=10'
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get book by ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  Promise.resolve(books[req.params.isbn])
    .then((book) => {
      if (!book) {
        return res.status(404).json({ message: 'Book not found' });
      }
      return res.status(200).json(book);
    })
    .catch(() => {
      return res.status(500).json({ message: 'Error retrieving book' });
    });
});

// Get books by author using async/await
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();
    const result = await Promise.resolve(
      Object.values(books).filter(
        (book) => book.author &&
          book.author.toLowerCase() === author
      )
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get books by title using async/await
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();
    const result = await Promise.resolve(
      Object.values(books).filter(
        (book) => book.title &&
          book.title.toLowerCase().includes(title)
      )
    );
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get reviews for a book
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  return res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;
