const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');

const public_users = express.Router();

// Get all books using Axios and async/await
public_users.get('/', async (req, res) => {
  try {
    const response = await axios.get(
      'https://openlibrary.org/subjects/fiction.json?limit=10'
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books' });
  }
});

// Get a book by ISBN using Axios
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(
      `https://openlibrary.org/isbn/${encodeURIComponent(req.params.isbn)}.json`
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Error retrieving book by ISBN'
    });
  }
});

// Get books by author using Axios
public_users.get('/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      'https://openlibrary.org/search.json',
      {
        params: {
          author: req.params.author,
          limit: 10
        }
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books by author' });
  }
});

// Get books by title using Axios
public_users.get('/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      'https://openlibrary.org/search.json',
      {
        params: {
          title: req.params.title,
          limit: 10
        }
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving books by title' });
  }
});

// Get reviews from the local assignment database
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];

  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  res.status(200).json(book.reviews || {});
});

module.exports.general = public_users;