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
    // Assuming you have an object containing book data, change variable names
    const booksData = Object.values(books).map(book => book);
    res.json(booksData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

public_users.get('/getbooks_isbn_async', async function (req, res) {
  try {
    const isbn_num = Object.values(books).map(book => book.isbn);
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

public_users.post("/addedreviews", async function (req, res) {
  const isbn = req.body.isbn;
  const username = "jawad";
  const review = req.body.review;

  try {
    // Find the book by ISBN
    const findBookByISBN = (isbn)=>{
      for(const bookIndex in books){
        const book = books[bookIndex]
        console.log("bookIndex",bookIndex)
        console.log("book",book)
        console.log("book isbn",book.isbn)
        console.log("isbn",isbn)
        if(book.isbn=== isbn )
        return book
        else return null
      }
    };

    const book = findBookByISBN(isbn)

    console.log("book at line 156", findBookByISBN(isbn))

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




module.exports.general = public_users;
