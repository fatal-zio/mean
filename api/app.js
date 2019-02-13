const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = req.body;
  res.status(201).json({
    message: 'Post added successfully.'
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: 'sdfnsdklfa',
      title: 'First post from Node.',
      content:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. First one.'
    },
    {
      id: 'asdflasdlfn',
      title: 'Second post from Node.',
      content:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. This is the second one.'
    },
    {
      id: 'knlajknvxc',
      title: 'Third post from Node.',
      content:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Third one.'
    }
  ];

  return res.status(200).json({
    message: 'Posts retrieved!',
    posts: posts
  });
});

module.exports = app;
