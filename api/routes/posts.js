const express = require('express');
const multer = require('multer');
const router = express.Router();
const Post = require('../models/post');
const checkAuth = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type.');
    if (isValid) {
      error = null;
    }
    cb(error, 'api/images');
  },
  filename: (req, file, cb) => {
    const name = file.originalname
      .toLowerCase()
      .split(' ')
      .join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post(
  '',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    const url = req.protocol + '://' + req.get('host');
    const imagePath = req.file.filename
      ? url + '/images/' + req.file.filename
      : null;

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    });
    post
      .save()
      .then(createdPost => {
        res.status(201).json({
          message: 'Post added successfully.',
          post: {
            ...createdPost,
            id: createdPost._id
          }
        });
      })
      .catch(() => {
        res.status(500).json({
          message: 'Failed to create post.'
        });
      });
  }
);

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentpage;
  const postQuery = Post.find();
  let fetchedPosts;

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  postQuery
    .then(posts => {
      fetchedPosts = posts;
      return Post.count();
    })
    .then(count => {
      res.status(200).json({
        message: 'Posts retrieved!',
        posts: fetchedPosts,
        maxPosts: count
      });
    })
    .catch(() => {
      res.status(500).json({
        message: 'Failed to retrieve posts.'
      });
    });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id)
    .then(post => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found.' });
      }
    })
    .catch(() => {
      res.status(500).json({
        message: 'Failed to retrieve post.'
      });
    });
});

router.put(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename;
    }

    const post = {
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
      creator: req.userData.userId
    };
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
      .then(result => {
        if (result.nModified > 0) {
          res.status(200).json({ message: 'Update successful.', post: post });
        } else {
          res.status(401).json({ message: 'Not authorized.', post: post });
        }
      })
      .catch(() => {
        res.status(500).json({ message: 'Could not update post.' });
      });
  }
);

router.delete('/:id', checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then(result => {
      if (result.n > 0) {
        res.status(204).json({ message: 'Post deleted.' });
      } else {
        res.status(401).json({ message: 'Post not found.' });
      }
    })
    .catch(() => {
      res.status(500).json({ message: 'Failed to delete post.' });
    });
});

module.exports = router;
