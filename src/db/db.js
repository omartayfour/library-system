const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "1234",
  port: 5432,
});

const createDatabase = async () => {
  const client = await pool.connect();

  try {
    await client.query(`CREATE DATABASE IF NOT EXISTS library`);
    console.log("DATABASE was created successfully!");
  } catch (e) {
    console.error("Error creating database!", e);
  } finally {
    client.release();
    await pool.end();
  }
};
async function createDatabaseAndTables() {
  const client = await pool.connect();
  try {
    const createDatabase = `CREATE DATABASE IF NOT EXISTS library`;
    await client.query(createDatabase);

    const createBorrowersTable = `
        CREATE TABLE IF NOT EXISTS borrowers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            registered_date DATE NOT NULL DEFAULT CURRENT_DATE
        );`;
    await client.query(createBorrowersTable);

    // isbn numbers are typically 13 digits(google searched)
    const createBooksTable = `
        CREATE TABLE IF NOT EXISTS books(
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            isbn VARCHAR(13) NOT NULL,
            total_quantity INT NOT NULL,
            available_quantity INT NOT NULL,
            shelf_location VARCHAR(255) NOT NULL
        );`;
    await client.query(createBooksTable);

    const createCheckedOutBooksTable = `
        CREATE TABLE IF NOT EXISTS checked_out_books (
            id SERIAL PRIMARY KEY,
            borrower_id INT REFERENCES borrowers(id),
            book_id INT REFERENCES books(id),
            checkout_date DATE NOT NULL DEFAULT CURRENT_DATE,
            return_date DATE,
            due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '7 days')
          );`;
    await client.query(createCheckedOutBooksTable);

    console.log("Database and tables have been created!");
  } catch (e) {
    console.error("Error in creating database", e);
  } finally {
    client.release();
    await pool.end();
  }
}

module.exports = { pool, createDatabaseAndTables };
