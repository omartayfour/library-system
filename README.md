# Library Management System

This project is the back-end of a simple Library Management System.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
- [APIs](#apis)
  - [Borrowers](#borrowers)
  - [Books](#books)
  - [Borrowed Books](#borrowed-books)

## Getting Started

To begin you must install the dependancies.
```bash
 npm i
```
Use npm i in the console.

### Prerequisites

- The user must have postgresql installed on their machine.
- The user must change the pool data to the one they used when installing postresql.
```node
 '/src/db.js'
 const pool = new Pool({
  user: "postgres", // username
  host: "localhost", // host
  database: "library", // database name
  password: "1234", // database password
  port: 5433, // port number of postregsql server
});
```
- To start the server the user must run the following command
```
npm run dev
```
- Make sure that you have the correct information and a database created with the same database name as the one you wrote in your pool variable above. The tables will be automatically created when you first run the server.



## APIs
#### Borrowers
##
###### Get all borrowers
```GET
GET('localhost:3000/api/v1/borrowers/')
```
###### Get borrower by ID
```GET
GET('localhost:3000/api/v1/borrowers/:id')
```
```
Required: req.params = { id: Int }
```

###### Add borrower
```POST
POST('localhost:3000/api/v1/borrowers/')
```
```
Required: req.body = { name: String, email: String }
```
###### Update borrower by id
```PUT
PUT('localhost:3000/api/v1/borrowers/:id')
```
```
Required: req.params = { id: Int }
          req.body = { name: String, email: String }
          req.body must have one or both to update.
```
###### Delete borrower by ID
```DELETE
DELETE('localhost:3000/api/v1/borrowers/:id')
```
```
Required: req.params = { id: Int }
```

#### Books
##
###### Get all books
```GET
GET('localhost:3000/api/v1/books/')
```
###### Get book by ID
```GET
GET('localhost:3000/api/v1/books/:id')
```
```
Required: req.params = { id: Int }
```
###### Add book
```POST
POST('localhost:3000/api/v1/books/')
```
```
Required: req.body = { title, author, isbn, total_quantity, available_quantity, shelf_location }
```
###### Update book by id
```PUT
PUT('localhost:3000/api/v1/books/:id')
```
```
Required: req.params = { id: Int }
          req.body = const { title, author, isbn, total_quantity, available_quantity, shelf_location }
          req.body must have one or more to update.
```
###### Delete book by ID
```DELETE
DELETE('localhost:3000/api/v1/books/:id')
```
```
Required: req.params = { id: Int }
```
###### Find books by title, ISBN, or Author
```GET
GET('localhost:3000/api/v1/books/:id')
```
```
Required: req.query = { title, author, isbn }
          one query parameter only is required.
          priority is title -> author -> isbn
```

#### Borrowed Books
##
###### Borrow Book
```POST
POST('localhost:3000/api/v1/borrowedbooks/:borrowerId/checkout/:bookId')
```
```
Required: req.params = { borrowerId, bookId }
```
###### Return Book
```POST
POST('localhost:3000/api/v1/borrowedbooks/:borrowerId/return/:bookId')
```
```
Required: req.params = { borrowerId, bookId }
```
###### Check Borrowed Books
```GET
GET('localhost:3000/api/v1/borrowedbooks/:borrowerId/checkedout')
```
```
Required: req.params = { borrowerId }
```
###### Check Overdue Books
```GET
GET('localhost:3000/api/v1/borrowedbooks/overdue')
```

