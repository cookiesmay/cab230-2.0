import express from 'express';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/debugEraseRatings', (req, res, next) => {
  req.db('ratings').del()
    .then(() => res.status(200).json({ message: 'All ratings successfully erased.' }))
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: true, message: 'Error in MySQL query' });
    });
});

router.get('/', auth, (req, res, next) => {
  const { page } = req.query;

  const pageNum = page !== undefined ? Number(page) : 1;
  if (page !== undefined && (!Number.isInteger(pageNum) || pageNum < 1 || String(page).includes('.'))) {
    return res.status(400).json({ error: true, message: 'Invalid page parameter. Must be an integer greater than or equal to 1.' });
  }

  const perPage = 20;
  const offset = (pageNum - 1) * perPage;
  const baseQuery = req.db('ratings').where({ userEmail: req.user.email });

  Promise.all([
    baseQuery.clone().select('rentalId', 'rating', 'comment', 'dateTime').orderBy('dateTime', 'desc').limit(perPage).offset(offset),
    baseQuery.clone().count('id as count').first()
  ])
    .then(([rows, countRow]) => {
      const total = countRow && countRow.count ? parseInt(countRow.count) : 0;
      const lastPage = Math.max(1, Math.ceil(total / perPage));
      res.status(200).json({
        data: rows.map(r => {
          const item = { rentalId: r.rentalId, rating: r.rating, dateTime: new Date(r.dateTime).toISOString() };
          if (r.comment) item.comment = r.comment;
          return item;
        }),
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
      console.error(err);
      res.status(500).json({ error: true, message: 'Error in MySQL query' });
    });
});

router.get('/rentals/:id', auth, (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    return res.status(400).json({ error: true, message: `Invalid query parameters: ${Object.keys(req.query).join(', ')}. Query parameters are not permitted.` });
  }

  const rentalId = parseInt(req.params.id);

  req.db('ratings').where({ userEmail: req.user.email, rentalId }).first()
    .then(row => {
      if (!row) return res.status(404).json({ error: true, message: 'No rating exists with this rental ID.' });
      const response = { rating: row.rating, dateTime: new Date(row.dateTime).toISOString() };
      if (row.comment) response.comment = row.comment;
      res.status(200).json(response);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: true, message: 'Error in MySQL query' });
    });
});


router.post('/rentals/:id', auth, (req, res, next) => {
  const rentalId = parseInt(req.params.id);
  const { rating, comment } = req.body;

  if (!rating || ![1,2,3,4,5].includes(Number(rating))) {
    return res.status(400).json({ error: true, message: 'Invalid rating. Rating must be an integer value between 1 and 5.' });
  }
  if (comment !== undefined && (typeof comment !== 'string' || comment.length < 1 || comment.length > 2000)) {
    return res.status(400).json({ error: true, message: 'Invalid comment parameter. Comment must be a string 1-2000 characters long.' });
  }

  const dateTime = new Date();
  req.db('data').where('id', rentalId).first()
    .then(rental => {
      if (!rental) return res.status(404).json({ error: true, message: 'No rental exists with this ID.' });

      return req.db('ratings').where({ userEmail: req.user.email, rentalId }).first()
        .then(existing => {
          const rentals = { rating: Number(rating), dateTime };
          if (comment !== undefined) rentals.comment = comment;

          if (existing) {
            return req.db('ratings').where({ userEmail: req.user.email, rentalId }).update(rentals);
          } else {
            return req.db('ratings').insert({ userEmail: req.user.email, rentalId, ...rentals });
          }
        })
        .then(() => {
          const response = { rating: Number(rating), dateTime: dateTime.toISOString() };
          if (comment !== undefined) response.comment = comment;
          res.status(201).json(response);
        });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: true, message: 'Error in MySQL query' });
    });
});

export default router;