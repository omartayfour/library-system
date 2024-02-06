# Library Management System

This project is the back-end of a simple Library Management System.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Getting Started

To begin you must install the dependancies.
```bash
 npm i
```
Use npm i in the console.

### Prerequisites

- The user must have postgresql installed on their machine.
- The user must change the pool data to they used when installing postresql.
```node
 '/src/db.js'
 const pool = new Pool({
  user: "postgres", // username
  host: "localhost", // host
  database: "library", // database name
  password: "1234", // database password
  port: 5433, // port number
});
```

### Installation

Step-by-step guide on how to install and set up the project.
