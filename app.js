import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './docs/openapi.json' with { type: 'json' };
import db from './database.js';
import rentalsRouter from './Routes/rentals.js';
import userRouter from './Routes/user.js';
import ratingsRouter from './Routes/ratings.js';

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('dev'));

morgan.token('res', (req, res) => {
  const headers = {};
  res.getHeaderNames().map(h => headers[h] = res.getHeader(h));
  return JSON.stringify(headers);
});

app.use((req, res, next) => {
  req.db = db;
  next();
});


app.use('/rentals', rentalsRouter);
app.use('/ratings', ratingsRouter);
app.use('/user', userRouter);
app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));


app.get("/knex", (req, res, next) => {
  req.db.raw("SELECT VERSION()")
  .then(version => {
    console.log(version[0][0]);
    res.send("Version logged successfully");
  })
  .catch(err => {
    console.log(err);
    throw err;
  });
});



app.get('/', (req, res) => {
  res.send('Rentals API');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});







