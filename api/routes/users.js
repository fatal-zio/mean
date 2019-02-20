const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');

router.post('/signup', (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res.status(201).json({
          message: 'User created!',
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  });
});

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: 'Authentication failed.'
        });
      }
      return {
        success: bcrypt.compare(req.body.password, user.password),
        user: user
      };
    })
    .then(result => {
      if (!result.success) {
        return res.status(401).json({
          message: 'Authentication failed.'
        });
      }
      const token = jwt.sign(
        { email: result.user.email, userId: result.user._id },
        'secret_this_should_be_longer_and_more_secure',
        { expiresIn: '1h' }
      );

      return res.status(200).json({
        token: token
      });
    })
    .catch(err => {
      return res.status(401).json({
        message: 'Authentication failed.'
      });
    });
});

module.exports = router;
