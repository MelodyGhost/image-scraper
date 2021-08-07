const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const router = require('./routes/auth-route');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Connect to DataBase
const DB_URI = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to Database!');
  });

// Body parser
app.use(express.json());

// accept all connection(not secure, I know)
app.use(
  cors({
    origin: true,
  })
);

app.get('/', (req, res) => {
  res.send({ response: 'Hello World!' });
});

app.use(router);

// Error for unspecified link
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.listen(8080, () => console.log('Listening to port 8080'));

// unhandled Error
process.on('unhandledRejection', (err) => {
  console.log('There is an error! the app is shutting down!');
  console.log(err.name, ':', err.message);
  server.close(() => {
    process.exit(1);
  });
});
