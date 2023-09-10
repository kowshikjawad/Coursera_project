const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  username:'al',
  password:'bal'
}];


const isValid = (username)=>{ 
  const existingUser = users.find(user => user.username === username);
  return existingUser
}

const authenticatedUser = (username,password)=>{ 
  //console.log(username,password) 
  //console.log(users[0].username,users[0].password)
  if (username === users[0].username && password === users[0].password){
    return true;
  }
  else {
    return false;
  }
};

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {username,password} = req.body;

  if(!authenticatedUser(username,password)){
    return res.status(401).json({ message: "Invalid username or password" });
  }

  console.log(users)
  const token = jwt.sign({username},'secret-key', {expiresIn:'1h'});
  return res.status(200).json({token});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const  isbn  = req.body;
  const { review } = req.body;
  const username = 'jawad';

  try {
    // Find the book by ISBN
    const findBookByISBN = (isbn) => {
      for (const bookIndex in books) {
        const book = books[bookIndex];
        console.log(bookIndex);
        console.log(book);
        if (book.isbn === isbn) {
          return book;
        }
      }
      return null; // Move the return statement outside the loop
    };

    const book = findBookByISBN(isbn)

    console.log(book)

    if (book) {
      console.log('book', book);
      const existingReviews = book.reviews;
      console.log(existingReviews);

      // If the same user already posted a review, modify it
      let reviewFound = false;
      for (const reviewIndex in existingReviews) {
        const userReview = existingReviews[reviewIndex];
        if (userReview.name === username) {
          // Update the review score
          userReview.review = review;
          reviewFound = true;
          break;
        }
      }

      if (reviewFound) {
        res.send('Review modified successfully.');
      } else {
        const newReview = {
          name: username,
          review: review
        };

        const newIndex = Object.keys(existingReviews).length;
        existingReviews[newIndex] = newReview;
        res.send(review);
      }
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json(error);
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
