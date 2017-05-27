const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const router = express.Router();
const jwtOptions = require('../config/jwtOptions');

// Our user model
const User = require('../models/user');

// Bcrypt let us encrypt passwords

const bcryptSalt = 10;


// Get user information by user id.
router.get('/:id', (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400).json({ message: 'Specified id is not valid' });
    return;
  }

  User.findById(req.params.id, (err, user) => {
    if (err) {
      res.json(err);
      return;
    }
    res.json(user);
  });
});


module.exports = router;
