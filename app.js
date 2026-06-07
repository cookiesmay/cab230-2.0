import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import swaggerUI from 'swagger-ui-express';
import swaggerDocument from './docs/openapi.json' with { type: 'json' };
import db from './database.js';
import rentalsRouter from './Routes/rentals.js';
import userRouter from './Routes/user.js';
import ratingsRouter from './Routes/ratings.js';
import https from 'node:https';
import fs from 'node:fs';

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

morgan.token('res', (req, res) => {
  const headers = {};
  res.getHeaderNames().map(h => headers[h] = res.getHeader(h));
  return JSON.stringify(headers);
});
app.use(morgan('dev'));



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
    res.status(200).send("Version logged successfully");
  })
  .catch(err => {
    console.error(err);
    next(err);
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: true, message: "Internal Server Error" });
});



app.get('/', (req, res) => {
  res.send('Rentals API');
});

const credentials = {
  key: fs.readFileSync('./certs/selfsigned.key'),
  cert: fs.readFileSync('./certs/selfsigned.crt')
};


https.createServer(credentials, app).listen(3000, () => {
  console.log(`Server listening on https://localhost:3000`);
});