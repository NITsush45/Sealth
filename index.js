const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('API working!');
});

// Get all enrollments
app.get('/enrollments', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM enrollments');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Get enrollment by ID
app.get('/enrollments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM enrollments WHERE enrollment_id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Create new enrollment
app.post('/enrollments', async (req, res) => {
  try {
    const {
      name, age, gender, date_of_joining, due_date, total_installment,
      pending, phone_no, email_id, role, weight, workout_partner_preference,
      type_of_workout, current_prs, goals, favorite_flavour, workout_frequency, dietary_preference
    } = req.body;

    const result = await pool.query(
      `INSERT INTO enrollments (
        name, age, gender, date_of_joining, due_date, total_installment, pending,
        phone_no, email_id, role, weight, workout_partner_preference,
        type_of_workout, current_prs, goals, favorite_flavour, workout_frequency, dietary_preference
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12,
        $13, $14, $15, $16, $17, $18
      ) RETURNING *`,
      [
        name, age, gender, date_of_joining, due_date, total_installment, pending,
        phone_no, email_id, role, weight, workout_partner_preference,
        type_of_workout, current_prs, goals, favorite_flavour, workout_frequency, dietary_preference
      ]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
