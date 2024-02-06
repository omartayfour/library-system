const { pool } = require('../../db/db')


const borrowBook = async (req, res) => {
  const client = await pool.connect()
  try {
    const { borrowerId, bookId } = req.params;

    const borrowerQuery = await pool.query('SELECT * FROM borrowers WHERE id = $1', [borrowerId]);
    if (borrowerQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Borrower not found' });
    }

    const bookQuery = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
    if (bookQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const book = bookQuery.rows[0];
    if (book.available_quantity === 0) {
      return res.status(400).json({ error: 'Book not available' });
    }

    const insertQuery = await pool.query('INSERT INTO checked_out_books (borrower_id, book_id) VALUES ($1, $2)',
      [borrowerId, bookId]);
    const updateQuery = await pool.query('UPDATE books SET available_quantity = available_quantity - 1 WHERE id = $1', [bookId]);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error checking out a book', error);
    res.sendStatus(500);
  }
  finally {
    client.release()
  }
}

const returnBook = async (req, res) => {
  const client = await pool.connect()
  try {
    const { borrowerId, bookId } = req.params;

    const borrowerQuery = await pool.query('SELECT * FROM borrowers WHERE id = $1', [borrowerId]);
    if (borrowerQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Borrower not found' });
    }

    const bookQuery = await pool.query('SELECT * FROM books WHERE id = $1', [bookId]);
    if (bookQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const checkedOutQuery = await pool.query('SELECT * FROM checked_out_books WHERE borrower_id = $1 AND book_id = $2',
      [borrowerId, bookId]);
    if (checkedOutQuery.rows.length === 0) {
      return res.status(400).json({ error: 'Book is not checked out by the borrower' });
    }

    const updateQuery = await pool.query('UPDATE checked_out_books SET return_date = CURRENT_DATE WHERE borrower_id = $1 AND book_id = $2',
      [borrowerId, bookId]);

    const book = bookQuery.rows[0];
    const incrementQuery = await pool.query('UPDATE books SET available_quantity = available_quantity + 1 WHERE id = $1',
      [bookId]);

    res.sendStatus(200);
  } catch (error) {
    console.error('Error returning a book', error);
    res.sendStatus(500);
  }
  finally {
    client.release()
  }
}

const checkBooks = async (req, res) => {
  const client = await pool.connect()
  try {
    const { borrowerId } = req.params;

    const borrowerQuery = await pool.query('SELECT * FROM borrowers WHERE id = $1', [borrowerId]);
    if (borrowerQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Borrower not found' });
    }

    const checkedOutQuery = `
      SELECT books.title, books.author, books.isbn, checked_out_books.checkout_date, checked_out_books.return_date, checked_out_books.due_date
      FROM checked_out_books
      JOIN books ON checked_out_books.book_id = books.id
      WHERE checked_out_books.borrower_id = $1
    `;
    const checkedOutResult = await pool.query(checkedOutQuery, [borrowerId]);

    res.json(checkedOutResult.rows);
  } catch (error) {
    console.error('Error getting checked out books', error);
    res.sendStatus(500);
  }
  finally {
    client.release()
  }
}

const getOverdue = async (req, res) => {
  const client = await pool.connect()
  try {
    const overdueQuery = `
      SELECT books.title, books.author, books.isbn, checked_out_books.due_date
      FROM checked_out_books
      JOIN books ON checked_out_books.book_id = books.id
      WHERE checked_out_books.return_date IS NULL AND checked_out_books.due_date < CURRENT_DATE
    `;
    const overdueResult = await pool.query(overdueQuery);

    res.json(overdueResult.rows);
  } catch (error) {
    console.error('Error getting overdue books', error);
    res.sendStatus(500);
  }
  finally {
    client.release()
  }
}

module.exports = {
  borrowBook,
  returnBook,
  checkBooks,
  getOverdue
}