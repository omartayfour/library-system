const express = require("express");
const app = express();
const { createDatabaseAndTables } = require("./src/db/db");
const borrowerRoutes = require("./src/models/borrower/routes");
const bookRoutes = require("./src/models/book/routes")
const borrowedBooksRoutes = require("./src/models/borrowedbook/routes")

const port = 3000;

app.use(express.json());

app.use("/api/v1/borrowers", borrowerRoutes);
app.use("/api/v1/books", bookRoutes);
app.use("/api/v1/borrowedbooks", borrowedBooksRoutes)


app.get("/", (req, res) => {
  res.send("Hello ");
});



app.listen(port, async () => {
  console.log(`App is listening on port ${port}`);
  await createDatabaseAndTables();
});
