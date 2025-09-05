const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// Login page
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

// Register page
router.get('/register', (req, res) => {
  res.render('auth/register', { error: null });
});

// Login POST with validation
router.post('/login', [
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', { error: errors.array()[0].msg });
  }
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.render('auth/login', { error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render('auth/login', { error: 'Invalid credentials' });
    }
    
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    };
    
    // Force session save for Vercel compatibility
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
        return res.render('auth/login', { error: 'Login failed. Please try again.' });
      }
      
      if (user.isAdmin) {
        res.redirect('/admin/dashboard');
      } else {
        res.redirect('/user/dashboard');
      }
    });
  } catch (error) {
    res.render('auth/login', { error: 'Server error' });
  }
});

// Register POST with validation
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('rollNumber').trim().isLength({ min: 5, max: 15 }).withMessage('Roll number must be between 5 and 15 characters'),
  body('branch').isIn(['CSE', 'ECE', 'ME', 'CE', 'EE', 'IT', 'DS', 'TT', 'MNC', 'ICE', 'CHE']).withMessage('Please select a valid branch'),
  body('year').isInt({ min: 1, max: 4 }).withMessage('Please select a valid year'),
  body('phone').isMobilePhone('en-IN').withMessage('Please enter a valid Indian phone number'),
  body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Please select a valid gender')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/register', { error: errors.array()[0].msg });
  }
  try {
    const { name, email, password, rollNumber, branch, year, phone, gender } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { error: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 12);
    
    const user = new User({
      name,
      email,
      password: hashedPassword,
      rollNumber,
      branch,
      year,
      phone,
      gender
    });
    
    await user.save();
    
    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    };
    
    res.redirect('/user/dashboard');
  } catch (error) {
    res.render('auth/register', { error: 'Registration failed' });
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;