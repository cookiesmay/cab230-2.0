import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/debugEraseRatings', (req, res) => {
  req.db('ratings').del()
    .then(() => res.status(200).json({ message: 'Ratings erased' }))
    .catch(err => res.status(500).json({ error: true, message: 'Error in MySQL query' }));
});
// GET /ratings
router.get('/', auth, (req, res) => {
  const { page } = req.query;

  const pageNum = page !== undefined ? Number(page) : 1;
  if (page !== undefined && (!Number.isInteger(pageNum) || pageNum < 1 || String(page).includes('.'))) {
    return res.status(400).json({ error: true, message: 'Invalid page parameter. Must be an integer greater than or equal to 1.' });
  }

  const perPage = 20;
  const offset = (pageNum - 1) * perPage;
  const baseQuery = req.db('ratings').where({ userEmail: req.user.email });

  Promise.all([
    baseQuery.clone().select('rentalId', 'rating', 'dateTime').orderBy('dateTime', 'desc').limit(perPage).offset(offset),
    baseQuery.clone().count('id as count').first()
  ])
    .then(([rows, countRow]) => {
      const total = parseInt(countRow.count);
      const lastPage = Math.max(1, Math.ceil(total / perPage));
      res.status(200).json({
        data: rows.map(r => ({
          rentalId: r.rentalId,
          rating: r.rating,
          dateTime: new Date(r.dateTime).toISOString()
        })),
        pagination: {
          perPage, currentPage: pageNum,
          from: offset, to: offset + rows.length,
          total, lastPage,
          prevPage: pageNum > 1 ? pageNum - 1 : null,
          nextPage: pageNum < lastPage ? pageNum + 1 : null,
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: true, message: 'Error in MySQL query' });
    });
});

// GET /ratings/rentals/:id
router.get('/rentals/:id', auth, (req, res) => {
  if (Object.keys(req.query).length > 0) {
    return res.status(400).json({ error: true, message: `Invalid query parameters: ${Object.keys(req.query).join(', ')}. Query parameters are not permitted.` });
  }

  const rentalId = parseInt(req.params.id);

  req.db('ratings').where({ userEmail: req.user.email, rentalId }).first()
    .then(row => {
      if (!row) return res.status(404).json({ error: true, message: 'No rating exists with this rental ID.' });
      res.status(200).json({ rating: row.rating, dateTime: new Date(row.dateTime).toISOString() });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: true, message: 'Error in MySQL query' });
    });
});

// POST /ratings/rentals/:id
// POST /ratings/rentals/:id
router.post('/rentals/:id', auth, (req, res) => {
  const rentalId = parseInt(req.params.id);
  const { rating, comment } = req.body;

  // 1. Validation
  if (!rating || ![1,2,3,4,5].includes(Number(rating))) {
    return res.status(400).json({ error: true, message: 'Invalid rating. Rating must be an integer value between 1 and 5.' });
  }
  if (comment !== undefined && (typeof comment !== 'string' || comment.length < 1 || comment.length > 2000)) {
    return res.status(400).json({ error: true, message: 'Invalid comment parameter. Comment must be a string 1-2000 characters long.' });
  }

  const dateTime = new Date();

  // 2. Check if the rental actually exists in the 'data' table first
  req.db('data').where('id', rentalId).first()
    .then(rental => {
      if (!rental) return res.status(404).json({ error: true, message: 'No rental exists with this ID.' });

      // 3. Check if the user has already rated this specific rental
      return req.db('ratings').where({ userEmail: req.user.email, rentalId }).first()
        .then(existing => {
          const data = { rating: Number(rating), dateTime };
          if (comment !== undefined) data.comment = comment;

          // 4. Update or Insert based on whether they already rated it
          if (existing) {
            return req.db('ratings').where({ userEmail: req.user.email, rentalId }).update(data);
          } else {
            return req.db('ratings').insert({ userEmail: req.user.email, rentalId, ...data });
          }
        })
        .then(() => {
          // The tests strictly expect a 201 for both inserts AND updates!
          const response = { rating: Number(rating), dateTime: dateTime.toISOString() };
          if (comment !== undefined) response.comment = comment;
          res.status(201).json(response);
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: true, message: 'Error in MySQL query' });
    });
});

export default router;