import express from 'express';
import cors from 'cors';

const router = express.Router();


router.use(cors());


router.get('/states', (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
  return res.status(400).json({ error: true, message: `Invalid query parameters: ${Object.keys(req.query).join(', ')}. Query parameters are not permitted.` });
  }
  req.db
    .from('data')
    .distinct('state')
    .orderBy('state', 'asc')
    .then(rows => {
      const statesArray = rows.map(row => row.state);
      res.status(200).json(statesArray);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: true, message: "Error in SQL query" });
    });
});

router.get('/property-types', (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
  return res.status(400).json({ error: true, message: `Invalid query parameters: ${Object.keys(req.query).join(', ')}. Query parameters are not permitted.` });
  }
  req.db
    .from('data')
    .distinct('propertyType')
    .orderBy('propertyType', 'asc')
    .then(rows => {
      const propertyTypesArray = rows.map(row => row.propertyType);
      res.status(200).json(propertyTypesArray);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ error: true, message: "Error in SQL query" });
    });
});

router.get('/search', (req, res, next) => {
  const { suburb, state, postcode, minimumRent, maximumRent,
    minimumBathrooms, maximumBathrooms, minimumBedrooms, maximumBedrooms,
    minimumParking, maximumParking, propertyTypes, sortBy, sortOrder, page } = req.query;

  if (sortOrder && !sortBy) return res.status(400).json({ error: true, message: "Invalid sortOrder parameter. sortBy must be specified." });
  if (sortBy && !['id','title','rent','propertyType','latitude','longitude','postcode','state','suburb','bathrooms','bedrooms','parkingSpaces','averageRating','numRatings'].includes(sortBy))
    return res.status(400).json({ error: true, message: "Invalid sortBy parameter. Must refer to a valid sortable property." });
  if (sortOrder && !['asc','desc'].includes(sortOrder))
    return res.status(400).json({ error: true, message: "Invalid sortOrder parameter. Must be 'asc' or 'desc'." });

  const pageNum = page !== undefined ? Number(page) : 1;
  if (page !== undefined && (!Number.isInteger(pageNum) || pageNum < 1))
    return res.status(400).json({ error: true, message: "Invalid page parameter. Must be an integer greater than or equal to 1." });

  const perPage = 10;
  const offset = (pageNum - 1) * perPage;

  const intChecks = [
    [minimumRent, 'minimumRent'], [maximumRent, 'maximumRent'],
    [minimumBathrooms, 'minimumBathrooms'], [maximumBathrooms, 'maximumBathrooms'],
    [minimumBedrooms, 'minimumBedrooms'], [maximumBedrooms, 'maximumBedrooms'],
    [minimumParking, 'minimumParking'], [maximumParking, 'maximumParking'],
  ];
  for (const [val, name] of intChecks) {
    if (val !== undefined) {
      const n = Number(val);
      if (!Number.isInteger(n) || n < 0 || String(val).includes('.'))
        return res.status(400).json({ error: true, message: `Invalid ${name} parameter. Must be a non-negative integer.` });
    }
  }
  if (postcode !== undefined) {
    const pc = Number(postcode);
    if (!Number.isInteger(pc) || pc < 0 || pc > 9999 || String(postcode).includes('.'))
      return res.status(400).json({ error: true, message: 'Invalid postcode parameter. Must be an integer in the range of 0000-9999.' });
  }

  let query = req.db.from('data')
  .leftJoin('ratings', 'data.id', 'ratings.rentalId')
  .groupBy('data.id')
  .select('data.id','data.title','data.rent','data.propertyType','data.latitude',
    'data.longitude','data.postcode','data.state','data.suburb',
    'data.bathrooms','data.bedrooms','data.parkingSpaces')
  .avg({ averageRating: 'ratings.rating' })
  .count({ numRatings: 'ratings.id' });
  if (suburb !== undefined)           query.where('data.suburb', suburb);
  if (state !== undefined)            query.where('data.state', state);
  if (postcode !== undefined)         query.where('data.postcode', parseInt(postcode));
  if (minimumRent !== undefined)      query.where('data.rent', '>=', parseInt(minimumRent));
  if (maximumRent !== undefined)      query.where('data.rent', '<=', parseInt(maximumRent));
  if (minimumBathrooms !== undefined) query.where('data.bathrooms', '>=', parseInt(minimumBathrooms));
  if (maximumBathrooms !== undefined) query.where('data.bathrooms', '<=', parseInt(maximumBathrooms));
  if (minimumBedrooms !== undefined)  query.where('data.bedrooms', '>=', parseInt(minimumBedrooms));
  if (maximumBedrooms !== undefined)  query.where('data.bedrooms', '<=', parseInt(maximumBedrooms));
  if (minimumParking !== undefined)   query.where('data.parkingSpaces', '>=', parseInt(minimumParking));
  if (maximumParking !== undefined)   query.where('data.parkingSpaces', '<=', parseInt(maximumParking));
  if (propertyTypes !== undefined) {
    const types = Array.isArray(propertyTypes) ? propertyTypes : [propertyTypes];
    query.whereIn('data.propertyType', types);
  }
  if (sortBy) query.orderBy(sortBy, sortOrder || 'asc');
  else query.orderBy('data.id', 'asc');

  const countQuery = req.db.from('data')
    .leftJoin('ratings', 'data.id', 'ratings.rentalId')
    .groupBy('data.id')
    .select('data.id');

  // re-apply same filters to countQuery
  if (suburb !== undefined)           countQuery.where('data.suburb', suburb);
  if (state !== undefined)            countQuery.where('data.state', state);
  if (postcode !== undefined)         countQuery.where('data.postcode', parseInt(postcode));
  if (minimumRent !== undefined)      countQuery.where('data.rent', '>=', parseInt(minimumRent));
  if (maximumRent !== undefined)      countQuery.where('data.rent', '<=', parseInt(maximumRent));
  if (minimumBathrooms !== undefined) countQuery.where('data.bathrooms', '>=', parseInt(minimumBathrooms));
  if (maximumBathrooms !== undefined) countQuery.where('data.bathrooms', '<=', parseInt(maximumBathrooms));
  if (minimumBedrooms !== undefined)  countQuery.where('data.bedrooms', '>=', parseInt(minimumBedrooms));
  if (maximumBedrooms !== undefined)  countQuery.where('data.bedrooms', '<=', parseInt(maximumBedrooms));
  if (minimumParking !== undefined)   countQuery.where('data.parkingSpaces', '>=', parseInt(minimumParking));
  if (maximumParking !== undefined)   countQuery.where('data.parkingSpaces', '<=', parseInt(maximumParking));
  if (propertyTypes !== undefined) {
    const types = Array.isArray(propertyTypes) ? propertyTypes : [propertyTypes];
    countQuery.whereIn('data.propertyType', types);
  }

  Promise.all([query.limit(perPage).offset(offset), countQuery])
    .then(([rows, countRows]) => {
      const total = countRows.length;
      const lastPage = Math.ceil(total / perPage);
      res.status(200).json({
        data: rows.map(r => ({
          ...r,
          latitude: parseFloat(r.latitude),
          longitude: parseFloat(r.longitude),
          averageRating: r.averageRating != null ? parseFloat(r.averageRating) : null,
          numRatings: parseInt(r.numRatings)
        })),
        pagination: { perPage, currentPage: pageNum, from: offset, to: offset + rows.length,
          total, lastPage, prevPage: pageNum > 1 ? pageNum - 1 : null,
          nextPage: pageNum < lastPage ? pageNum + 1 : null }
      });
    })
    .catch(err => { console.error(err); res.status(500).json({ error: true, message: 'Error in MySQL query' }); });
});


router.get('/:id', (req, res, next) => {
  if (Object.keys(req.query).length > 0)
    return res.status(400).json({ error: true, message: `Invalid query parameters: ${Object.keys(req.query).join(', ')}. Query parameters are not permitted.` });
  const id = parseInt(req.params.id);

  Promise.all([
    req.db.from('data').where('id', id).first(),
    req.db.from('ratings').where('rentalId', id).select('rating', 'userEmail', 'dateTime', 'comment')
  ])
  .then(([rental, ratings]) => {
    if (!rental) return res.status(404).json({ error: true, message: 'No rental exists with this ID.' });

    const numRatings = ratings.length;
    const averageRating = numRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / numRatings
      : null;

    const reviews = ratings.map(r => {
      const review = { rating: r.rating, user: r.userEmail, dateTime: new Date(r.dateTime).toISOString() };
      if (r.comment) review.comment = r.comment;
      return review;
    });

    res.status(200).json({ ...rental, latitude: parseFloat(rental.latitude),
  longitude: parseFloat(rental.longitude), averageRating, numRatings, reviews });
  })
  .catch(err => {
    console.error(err);
    res.status(500).json({ error: true, message: 'Error in MySQL query' });
  });
});


export default router;