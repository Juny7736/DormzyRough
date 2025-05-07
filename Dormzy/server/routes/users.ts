import express from 'express';
import pool from '../database';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    
    if (Array.isArray(rows) && rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      dateOfBirth,
      status,
      school,
      profilePicture
    } = req.body;

    const id = uuidv4();
    
    await pool.query(
      `INSERT INTO users (
        id, first_name, last_name, email, phone_number, 
        date_of_birth_month, date_of_birth_day, date_of_birth_year, 
        status, school, profile_picture
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, firstName, lastName, email, phoneNumber,
        dateOfBirth?.month || null, dateOfBirth?.day || null, dateOfBirth?.year || null,
        status, school, profilePicture
      ]
    );
    
    res.status(201).json({ id, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      status,
      school,
      profilePicture
    } = req.body;

    const [result] = await pool.query(
      `UPDATE users SET 
        first_name = ?, 
        last_name = ?, 
        phone_number = ?, 
        date_of_birth_month = ?, 
        date_of_birth_day = ?, 
        date_of_birth_year = ?, 
        status = ?, 
        school = ?, 
        profile_picture = ?
      WHERE id = ?`,
      [
        firstName, 
        lastName, 
        phoneNumber, 
        dateOfBirth?.month || null, 
        dateOfBirth?.day || null, 
        dateOfBirth?.year || null, 
        status, 
        school, 
        profilePicture,
        req.params.id
      ]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Check if email exists
router.get('/check-email/:email', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [req.params.email]);
    
    res.json({ exists: Array.isArray(rows) && rows.length > 0 });
  } catch (error) {
    console.error('Error checking email:', error);
    res.status(500).json({ error: 'Failed to check email' });
  }
});

export default router;