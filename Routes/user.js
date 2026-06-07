import express from 'express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import auth from '../middleware/auth.js'; 

const router = express.Router();

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
      return argon2.hash(password)
        .then(hashedPassword => {
          return req.db('users').insert({ email, hash: hashedPassword });
        })
        .then(() => res.status(201).json({ message: 'User created' }));
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: true, message: 'Error in MySQL query' });
    });
});

router.post('/debugLogin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: true, message: 'Request body incomplete, both email and password are required' });
  req.db('users').where({ email }).first()
    .then(user => {
      if (!user) return res.status(401).json({ error: true, message: 'Incorrect email or password' });
      return argon2.verify(user.hash, password)
        .then(match => {
          if (!match) return res.status(401).json({ error: true, message: 'Incorrect email or password' });
          const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: 1 });
          res.status(200).json({ token, tokenType: 'Bearer', expiresIn: 1 });
        });
    })
    .catch(err => { console.error(err); res.status(500).json({ error: true, message: 'Error in MySQL query' }); });
});


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
      return argon2.verify(user.hash, password)
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
      console.error(err);
      res.status(500).json({ error: true, message: 'Error in MySQL query' });
    });
});

router.get('/:email/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  let userEmail = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userEmail = decoded.email;
    } catch (err) {
    }
  }

  const isOwn = userEmail && req.params.email === userEmail;

  req.db('users').where({ email: req.params.email }).first()
    .then(user => {
      if (!user) return res.status(404).json({ error: true, message: 'User not found' });
      const profile = { email: user.email, firstName: user.firstName || null, lastName: user.lastName || null };
      if (isOwn) {
        profile.dob = user.dob ? new Date(user.dob).toISOString().split('T')[0] : null;
        profile.address = user.address || null;
      }
      res.status(200).json(profile);
    })
    .catch(err => { console.error(err); res.status(500).json({ error: true, message: 'Error in MySQL query' }); });
});


router.put('/:email/profile', auth, (req, res) => {
  if (req.params.email !== req.user.email) {
    return res.status(403).json({ error: true, message: 'Forbidden' });
  }
  const { firstName, lastName, dob, address } = req.body;
  if (firstName === undefined || lastName === undefined || dob === undefined || address === undefined)
  return res.status(400).json({ error: true, message: 'Request body incomplete: firstName, lastName, dob and address are required.' });

  // 1. Validate String types
  if ((firstName !== undefined && typeof firstName !== 'string') ||
      (lastName !== undefined && typeof lastName !== 'string') ||
      (address !== undefined && typeof address !== 'string')) {
    return res.status(400).json({ error: true, message: 'Request body invalid: firstName, lastName and address must be strings only.' });
  }

 if (dob !== undefined) {
    // Check regex format first
    if (typeof dob !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
        return res.status(400).json({ error: true, message: 'Invalid input: dob must be a real date in format YYYY-MM-DD.' });
    }

    const parsed = new Date(dob);
    if (isNaN(parsed.getTime()) || !parsed.toISOString().startsWith(dob)) {
        return res.status(400).json({ error: true, message: 'Invalid input: dob must be a real date in format YYYY-MM-DD.' });
    }
    
    if (parsed >= new Date()) {
        return res.status(400).json({ error: true, message: 'Invalid input: dob must be a date in the past.' });
    }
  }

  const updates = {};
  if (firstName !== undefined) updates.firstName = firstName;
  if (lastName !== undefined) updates.lastName = lastName;
  if (dob !== undefined) updates.dob = dob;
  if (address !== undefined) updates.address = address;

  req.db('users').where({ email: req.params.email }).update(updates)
    .then(() => req.db('users').where({ email: req.params.email }).first())
    .then(user => res.status(200).json({
      email: user.email,
      firstName: user.firstName || null,
      lastName: user.lastName || null,
      dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : null,
      address: user.address || null,
    }))
    .catch(err => { 
      console.error(err); 
      res.status(500).json({ error: true, message: 'Error in MySQL query' }); 
    });
});


export default router;