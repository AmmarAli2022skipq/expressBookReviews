const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  
  res.send(books[ISBN])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let ans = []
    for(const [key, values] of Object.entries(books)){
        const book = Object.entries(values);
        for(let i = 0; i < book.length ; i++){
            if(book[i][0] == 'author' && book[i][1] == req.params.author){
                ans.push(books[key]);
            }
        }
    }
    if(ans.length == 0){
        return res.status(300).json({message: "Author not found"});
    }
    res.send(ans);
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const ans = Object.values(books).filter(book => book.title === req.params.title);
  if (ans.length === 0) {
    return res.status(300).json({ message: "Title not found" });
  }
  res.send(ans);
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  res.send(books[isbn]?.reviews || []);
});

// Task 10 
// Get the book list available in the shop

public_users.get('/', async (req, res) => {
  try {
    const bk = await getBookList();
    res.send(JSON.stringify(bk, null, 4));
  } catch (error) {
    res.send("denied");
  }
});



// Task 11
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  const result = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(JSON.stringify(books[isbn], null, 4));
    }, 3000);
  });

  try {
    res.send(result);
  } catch (error) {
    res.send("Error occurred while retrieving book details.");
  }
});



// Task 12
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  const size = Object.keys(books).length;
  let book;

  for (let i = 1; i <= size; i++) {
    if (books[i].author == author) {
      book = books[i];
      break;
    }
  }

  if (book) {
    res.send(book);
  } else {
    res.send("Book not found");
  }
});




// Task 13
// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
  const title = req.params.title;
  const size = Object.keys(books).length;
  let book;

  for (let i = 1; i <= size; i++) {
    if (books[i].title == title) {
      book = books[i];
      break;
    }
  }

  if (book) {
    res.send(book);
  } else {
    res.send("Book not found");
  }
});

module.exports.general = public_users;