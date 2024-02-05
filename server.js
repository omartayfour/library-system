const express = require("express");
const app = express();
const { createDatabaseAndTables } = require("./src/db/db");
const userRoutes = require("./src/models/borrower/routes");

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello ");
});

app.use("/api/v1/borrower", userRoutes);

app.listen(port, async () => {
  console.log(`App is listening on port ${port}`);
  await createDatabaseAndTables();
});
