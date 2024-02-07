const { pool } = require('../../db/db')
const getBorrowers = async (req, res) => {
  const client = await pool.connect()
  try {
    const query = await pool.query('SELECT * FROM borrowers')
    if (query.rowCount === 0) {
      return res.status(404).send({ error: 'There are no users in the system' })
    }
    res.status(200).json(query.rows)
  } catch (error) {
    throw error
  }
  finally {
    client.release()
  }
}

const findBorrowerByID = async (req, res) => {
  const client = await pool.connect()
  try {
    const { id } = req.params
    const query = await pool.query('SELECT * FROM borrowers WHERE id = $1', [id])

    if (query.rowCount === 0) {
      return res.status(404).send({ error: 'User not found' })
    }

    res.status(200).json(query.rows)
  } catch (error) {
    throw error
  }
  finally {
    client.release()
  }
}

const addBorrower = async (req, res) => {
  const client = await pool.connect()
  try {
    const { name, email } = req.body;
    const query = await pool.query('INSERT INTO borrowers (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]);
    res.status(200).send(query.rows[0])
  } catch (error) {
    res.status(400).send(error)
  }
  finally {
    client.release()
  }
}

const updateBorrower = async (req, res) => {
  const client = await pool.connect()
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    if (!name && !email) {
      console.error('Please provide name or email to edit');
      return res.status(500).send({
        error: 'Please provide name or email to edit'
      });
    }

    const updateFields = [];
    const values = [];
    let counter = 1

    if (name) {
      updateFields.push(`name = $${counter}`);
      values.push(name);
      counter++;
    }

    if (email) {
      updateFields.push(`email = $${counter}`);
      values.push(email);
      counter++;
    }

    const updateQuery = `
        UPDATE borrowers
        SET ${updateFields.join(', ')}
        WHERE id = $${values.length + 1}
      `;
    values.push(parseInt(id));

    const result = await pool.query(updateQuery, values);
    if (result.rowCount === 0) {
      return res.status(404).send({ error: 'User not found' })
    }

    res.sendStatus(200);
  } catch (error) {
    res.status(500).send('Error updating borrower');
  }
  finally {
    client.release()
  }
}

const deleteBorrower = async (req, res) => {
  const client = await pool.connect()
  try {
    const { id } = req.params;
    const query = await pool.query('DELETE FROM borrowers WHERE id = $1', [id])
    if (query.rowCount === 0) {
      return res.status(404).send({ error: 'User not found' })
    }
    res.sendStatus(200)
  }
  catch (error) {
    console.error('Error in deleting', error)
    res.status(500).send(error)
  }
  finally {
    client.release()
  }
}

module.exports = {
  getBorrowers,
  findBorrowerByID,
  addBorrower,
  updateBorrower,
  deleteBorrower

}