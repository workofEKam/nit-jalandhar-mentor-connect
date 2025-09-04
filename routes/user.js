const express = require('express');
const Hackathon = require('../models/Hackathon');
const Registration = require('../models/Registration');
const User = require('../models/User');
const router = express.Router();

// Middleware to check if user is logged in
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/auth/login');
  }
  next();
};

// User dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ isActive: true });
    const userRegistrations = await Registration.find({ user: req.session.user.id })
      .populate('hackathon');
    
    // Get full user details from database
    const fullUser = await User.findById(req.session.user.id);
    
    res.render('user/dashboard', { 
      user: fullUser, 
      hackathons,
      registrations: userRegistrations
    });
  } catch (error) {
    res.render('user/dashboard', { 
      user: req.session.user, 
      hackathons: [],
      registrations: [],
      error: 'Failed to load dashboard'
    });
  }
});

// Register for hackathon
router.get('/register/:id', requireAuth, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    if (!hackathon) {
      return res.redirect('/user/dashboard');
    }
    
    // Get full user details from database
    const fullUser = await User.findById(req.session.user.id);
    
    res.render('user/register-hackathon', { 
      user: fullUser, 
      hackathon,
      error: null
    });
  } catch (error) {
    res.redirect('/user/dashboard');
  }
});

// Register for hackathon POST
router.post('/register/:id', requireAuth, async (req, res) => {
  try {
    const { hasPartner, partnerName, partnerEmail, partnerRollNumber, partnerBranch, partnerYear, partnerPhone } = req.body;
    const hackathonId = req.params.id;
    
    // Check if already registered
    const existingRegistration = await Registration.findOne({
      user: req.session.user.id,
      hackathon: hackathonId
    });
    
    if (existingRegistration) {
      const hackathon = await Hackathon.findById(hackathonId);
      const fullUser = await User.findById(req.session.user.id);
      return res.render('user/register-hackathon', {
        user: fullUser,
        hackathon,
        error: 'Already registered for this hackathon'
      });
    }
    
    const registrationData = {
      user: req.session.user.id,
      hackathon: hackathonId,
      hasPartner: hasPartner === 'yes'
    };
    
    if (hasPartner === 'yes' && partnerName) {
      registrationData.partner = {
        name: partnerName,
        email: partnerEmail,
        rollNumber: partnerRollNumber,
        branch: partnerBranch,
        year: partnerYear,
        phone: partnerPhone
      };
    }
    
    const registration = new Registration(registrationData);
    await registration.save();
    res.redirect('/user/dashboard');
  } catch (error) {
    const hackathon = await Hackathon.findById(req.params.id);
    const fullUser = await User.findById(req.session.user.id);
    res.render('user/register-hackathon', {
      user: fullUser,
      hackathon,
      error: 'Registration failed'
    });
  }
});

module.exports = router;