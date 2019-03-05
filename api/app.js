const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/post-routes');
const userRoutes = require('./routes/user-routes');

const app = express();

// if using local
// const connectionString = 'mongodb://localhost/MEAN';

const encodedConnectionString =
  'bW9uZ29kYitzcnY6Ly9hZG1pbjpJcmVuZUxldzVAY2x1c3RlcjAtaWNkeHoubW9uZ29kYi5uZXQvbWVhbj9yZXRyeVdyaXRlcz10cnVl';
const buff = new Buffer.from(encodedConnectionString, 'base64');
const connectionString = buff.toString('ascii');

mongoose
  .connect(connectionString)
  .then(() => {
    console.log('Connection successful!');
  })
  .catch(() => {
    console.log('Connection failed!');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/images', express.static(path.join('api/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, PUT, DELETE, OPTIONS'
  );
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/users', userRoutes);

module.exports = app;
