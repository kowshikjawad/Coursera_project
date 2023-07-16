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
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.session.username;

  // Find the book in the 'books' database based on ISBN
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Check if the user has already posted a review for the book
  const existingReview = book.reviews[username];

  if (existingReview) {
    // Modify the existing review
    existingReview.review = review;
    return res.status(200).json({ message: "Review modified successfully" });
  }

  // Add a new review for the book
  book.reviews[username] = { review };
  return res.status(200).json({ message: "Review added successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
