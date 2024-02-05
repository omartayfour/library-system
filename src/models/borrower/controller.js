const { pool } = require('../../db/db')
const getBorrowers = async (req, res) => {
  const client = await pool.connect()
  try {
    const query = await pool.query('SELECT * FROM borrowers')
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
    const query = await pool.query('UPDATE borrowers SET name = $1, email = $2 WHERE id = $3 RETURNING *',
      [name, email, id])
    res.status(200).send(query.rows[0])
  } catch (error) {
    console.error('Error updating borrower', error)
    res.status(500).send(error)
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