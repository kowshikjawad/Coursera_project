const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();



public_users.post("/register", (req,res) => {
  const {username,password} = req.body;
  // check if username exists
  if(!username || !password){
    return res.status(400).json({message:'user and pass required'})
  }

  
  if(isValid(username)){
    return res.status(400).json({message:'Username already exists'})
  }

  
  const newUser = {
    username:username,
    password:password
  };

  users.push(newUser);

  return res.json(newUser)

});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // //Write your code her
  // // try {
  //    bookTitles = []
   
  //  for(let id in books){
     
  //      bookTitles.push(books[id].title)
     
  //  }

  //   res.status(400).json(bookTitles)
  // // } catch (error) {
  // //   console.log(error)
  // // }

  //       bookTitles = []
   
//         for(let id in books){
//         bookTitles.push(books[id])
        
//       }
//       res.json(bookTitles);
// });
      // bookTitles = []
   
      //   for(let id in books){
      //   bookTitles.push(books[id])
        
      // }
      // res.json(bookTitles);
  
      const titles = Object.values(books).map(book => book);
      res.json(titles);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = Object.values(books).map(book => book.isbn);
  res.json(isbn);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const titles = Object.values(books).map(book => book.author);
  res.json(titles);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const titles = Object.values(books).map(book => book.title);
  res.json(titles);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const review = Object.values(books).map(book => book.reviews);
  res.json(review);
});

public_users.get('/getbooks_async', async function (req, res) {
  try {
    const books = Object.values(books).map(book => book);
    res.json(books);;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.get('/getbooks_isbn_async', async function (req, res) {
  try {
    const isbn_num = Object.values(books).map(book => book.ISBN);
    res.json(isbn_num);;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.get('/getbooks_titles_async', async function (req, res) {
  try {
    const title = Object.values(books).map(book => book.title);
    res.json(title);;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.get('/getbooks_author_async', async function (req, res) {
  try {
    const author = Object.values(books).map(book => book.author);
    res.json(author);;
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.post("/addedreviews",(req,res) => {
  
  const isbn = req.query.isbn;
  const username = users.username;
  const review = req.query.review;

  // Check if the book exists in the 'books' object
  if (books.hasOwnProperty(isbn)) {
    const book = books[isbn];
    const existingReview = book.reviews[username];

    // If the same user already posted a review, modify it
    if (existingReview) {
      book.reviews[username] = review;
      res.send('Review modified successfully.');
    } else {
      // If a different user or a new review, add it under the same ISBN
      book.reviews[username] = review;
      res.send('Review added successfully.');
    }
  } else {
    res.status(404).send('Book not found.');
  }

  
})




module.exports.general = public_users;
