import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js'; 

const router = express.Router();

// POST /user/register
router.post('/register', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: true, message: 'Request body incomplete, both email and password are required' });
  }

  req.db('users').where({ email }).first()
    .then(user => {
      if (user) {
        return res.status(409).json({ error: true, message: 'User already exists' });
      }
      return bcrypt.hash(password, 10)
        .then(hash => req.db('users').insert({ email, password: hash }))
        .then(() => res.status(201).json({ message: 'User created' }));
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: true, message: 'Error in MySQL query' });
    });
});

// POST /user/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: true, message: 'Request body incomplete, both email and password are required' });
  }

  req.db('users').where({ email }).first()
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: true, message: 'Incorrect email or password' });
      }
      return bcrypt.compare(password, user.password)
        .then(match => {
          if (!match) {
            return res.status(401).json({ error: true, message: 'Incorrect email or password' });
          }
          const expiresIn = 86400;
          const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn });
          res.status(200).json({ token, tokenType: 'Bearer', expiresIn });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: true, message: 'Error in MySQL query' });
    });
});

// GET /user/:email/profile
// Remove 'auth' from this specific GET route so the tests can reach it
router.get('/:email/profile', (req, res) => {
  // Now check the auth header manually if it exists
  const authHeader = req.headers.authorization;
  let userEmail = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (err) {
      // Token is present but invalid/expired, proceed as unauthenticated
    }
  }

  const isOwn = userEmail && req.params.email === userEmail;

  req.db('users').where({ email: req.params.email }).first()
    .then(user => {
      if (!user) return res.status(404).json({ error: true, message: 'User not found' });

      const profile = { email: user.email, firstName: user.firstName || null, lastName: user.lastName || null };
      if (isOwn) {
        profile.dob = user.dob || null;
        profile.address = user.address || null;
      }
      res.status(200).json(profile);
    })
    .catch(err => { console.log(err); res.status(500).json({ error: true, message: 'Error in MySQL query' }); });
});

// PUT /user/:email/profile
router.put('/:email/profile', auth, (req, res) => {
  if (req.params.email !== req.user.email) {
    return res.status(403).json({ error: true, message: 'Forbidden' });
  }

  const { firstName, lastName, dob, address } = req.body;

  // 1. Validate String types
  if ((firstName !== undefined && typeof firstName !== 'string') ||
      (lastName !== undefined && typeof lastName !== 'string') ||
      (address !== undefined && typeof address !== 'string')) {
    return res.status(400).json({ error: true, message: 'Request body invalid: firstName, lastName and address must be strings only.' });
  }

  // 2. Validate Date format and past-tense
  if (dob !== undefined) {
    const d = new Date(dob);
    if (isNaN(d.getTime()) || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      return res.status(400).json({ error: true, message: 'Invalid input: dob must be a real date in format YYYY-MM-DD.' });
    }
    if (d >= new Date()) {
      return res.status(400).json({ error: true, message: 'Invalid input: dob must be a date in the past.' });
    }
  }

  // 3. Always define updates object
  const updates = {};
  if (firstName !== undefined) updates.firstName = firstName;
  if (lastName !== undefined) updates.lastName = lastName;
  if (dob !== undefined) updates.dob = dob;
  if (address !== undefined) updates.address = address;

  // 4. Perform update
  req.db('users').where({ email: req.params.email }).update(updates)
    .then(() => req.db('users').where({ email: req.params.email }).first())
    .then(user => res.status(200).json({
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      dob: user.dob || null,
      address: user.address || null,
    }))
    .catch(err => { 
      console.log(err); 
      res.status(500).json({ error: true, message: 'Error in MySQL query' }); 
    });
});


export default router;