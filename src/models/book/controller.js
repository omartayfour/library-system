const { pool } = require('../../db/db')

const getBooks = async (req, res) => {
  const client = await pool.connect()
  try {
    const query = await pool.query('SELECT * FROM books')
    if (query.rowCount === 0) {
      return res.status(404).send({ error: 'There are no books in the system' })
    }
    res.status(200).json(query.rows)
  } catch (error) {
    throw error
  }
  finally {
    client.release()
  }
}

const addBook = async (req, res) => {
  const client = await pool.connect()
  try {
    const { title, author, isbn, total_quantity, available_quantity, shelf_location } = req.body;
    const query = await
      pool.query('INSERT INTO books (title, author, isbn, total_quantity, available_quantity, shelf_location) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [title, author, isbn, total_quantity, available_quantity, shelf_location]);
    res.status(200).send(query.rows[0])
  } catch (error) {
    res.status(400).send(error)
  }
  finally {
    client.release()
  }
}

const findBookByID = async (req, res) => {
  const client = await pool.connect()
  try {
    const { id } = req.params
    const query = await pool.query('SELECT * FROM books WHERE id = $1', [id])
    if (query.rowCount === 0) {
      return res.status(404).send({ error: 'Cannot find book' })
    }
    res.status(200).json(query.rows)
  } catch (error) {
    throw error
  }
  finally {
    client.release()
  }
}


const deleteBook = async (req, res) => {
  const client = await pool.connect()
  try {
    const { id } = req.params
    const query = await pool.query('DELETE FROM books WHERE id = $1', [id])
    if (query.rowCount === 0) {
      return res.status(404).send({ error: 'Cannot find book' })
    }
    res.sendStatus(200)
  }
  catch (error) {
    throw error
  }
  finally {
    client.release()
  }
}
const findBook = async (req, res) => {
  const client = await pool.connect()
  const { title, author, isbn } = req.query
  try {
    let query
    if (title) {
      query = await pool.query('SELECT * FROM books WHERE title = $1', [title])
    }
    else if (author) {
      query = await pool.query('SELECT * FROM books WHERE author = $1', [author])
    }
    else if (isbn) {
      query = await pool.query('SELECT * FROM books where isbn = $1', [isbn])
    }
    else {
      return res.status(400).json({ error: 'Please provide either title, author, or ISBN for the book search.' });
    }
    if (query.rows.length === 0) {
      return res.status(404).json({ error: 'No books found with the provided information' });
    }
    res.json(query.rows)
  }
  catch (error) {
    console.error('Error finding book:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  finally {
    client.release()
  }
}
const updateBook = async (req, res) => {
  const client = await pool.connect()
  try {
    const { id } = req.params;
    const { title, author, isbn, total_quantity, available_quantity, shelf_location } = req.body;

    if (!title && !author && !isbn && !total_quantity && !available_quantity && !shelf_location) {
      console.error('Please provide field to update');
      return res.status(500).send({
        error: 'Please provide fields to update'
      });
    }

    const updateFields = [];
    const values = [];
    let counter = 1

    if (title) {
      updateFields.push(`title = $${counter}`);
      values.push(title);
      counter++;
    }

    if (author) {
      updateFields.push(`author = $${counter}`);
      values.push(author);
      counter++;
    }

    if (isbn) {
      updateFields.push(`isbn = $${counter}`);
      values.push(isbn);
      counter++;
    }

    if (total_quantity) {
      updateFields.push(`total_quantity = $${counter}`);
      values.push(total_quantity);
      counter++;
    }

    if (available_quantity) {
      updateFields.push(`available_quantity = $${counter}`);
      values.push(available_quantity);
      counter++;
    }

    if (shelf_location) {
      updateFields.push(`shelf_location = $${counter}`);
      values.push(shelf_location);
      counter++;
    }

    const updateQuery = `
        UPDATE books
        SET ${updateFields.join(', ')}
        WHERE id = $${values.length + 1}
      `;
    values.push(parseInt(id));

    const query = await pool.query(updateQuery, values);
    if (query.rowCount === 0) {
      return res.status(404).send({ error: 'Cannot find book' })
    }

    res.sendStatus(200);
  } catch (error) {
    console.error('Error updating book', error);
    res.sendStatus(500);
  } finally {
    client.release()
  }
}

module.exports = {
  updateBook,
  getBooks,
  findBook,
  addBook,
  findBookByID,
  deleteBook,

}