const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres", // username
  host: "localhost", // host
  database: "library", // database name
  password: "1234", // database password
  port: 5433, // port number
});

async function createDatabaseAndTables() {
  const client = await pool.connect();
  try {

    const databaseExistsQuery = await client.query("SELECT datname FROM pg_database WHERE datname = 'library'")
    if (databaseExistsQuery.rows.length === 0) {
      await client.query(`CREATE DATABASE library`)
    }

    const booksTableExists = await client.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = 'books'
    );
  `);
    if (!booksTableExists.rows[0].exists) {
      const createBooksTable = `
      CREATE TABLE books(
          id SERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          author VARCHAR(255) NOT NULL,
          isbn VARCHAR(13) UNIQUE NOT NULL,
          total_quantity INT NOT NULL,
          available_quantity INT NOT NULL,
          shelf_location VARCHAR(255) NOT NULL
      );`;
      await client.query(createBooksTable);
    }
    const borrowersTableExists = await client.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = 'borrowers'
    );
  `);
    if (!borrowersTableExists.rows[0].exists) {

      const createBorrowersTable = `
        CREATE TABLE borrowers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            registered_date DATE NOT NULL DEFAULT CURRENT_DATE
        );`;
      await client.query(createBorrowersTable);
    }

    const checkedOutBooksTableExists = await client.query(`
    SELECT EXISTS (
      SELECT 1
      FROM information_schema.tables
      WHERE table_name = 'checked_out_books'
    );
  `);
    if (!checkedOutBooksTableExists.rows[0].exists) {
      const createCheckedOutBooksTable = `
        CREATE TABLE checked_out_books (
            id SERIAL PRIMARY KEY,
            borrower_id INT REFERENCES borrowers(id),
            book_id INT REFERENCES books(id),
            checkout_date DATE NOT NULL DEFAULT CURRENT_DATE,
            return_date DATE,
            due_date DATE NOT NULL DEFAULT (CURRENT_DATE + INTERVAL '7 days')
          );`;
      await client.query(createCheckedOutBooksTable);
    }
    console.log("Database and tables have been created!");
  } catch (e) {
    console.error("Error in creating database", e);
  } finally {
    client.release()
  }
}

module.exports = { pool, createDatabaseAndTables };
