const express = require('express');
const mongoose = require('mongoose');
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
    
    // Convert session user id to ObjectId for proper comparison
    const userId = new mongoose.Types.ObjectId(req.session.user.id);
    const userRegistrations = await Registration.find({ user: userId })
      .populate('hackathon')
      .populate('user');
    
    // Get full user details from database
    const fullUser = await User.findById(req.session.user.id);
    
    console.log('Dashboard Debug:', {
      userId: req.session.user.id,
      registrationsCount: userRegistrations.length,
      registrations: userRegistrations.map(r => ({
        id: r._id,
        hackathon: r.hackathon?.title,
        status: r.status
      }))
    });
    
    res.render('user/dashboard', { 
      user: fullUser, 
      hackathons,
      registrations: userRegistrations
    });
  } catch (error) {
    console.error('Dashboard error:', error);
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
    
    // Check if already registered - use ObjectId for proper comparison
    const userId = new mongoose.Types.ObjectId(req.session.user.id);
    const hackathonObjectId = new mongoose.Types.ObjectId(hackathonId);
    
    const existingRegistration = await Registration.findOne({
      user: userId,
      hackathon: hackathonObjectId
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
      user: userId,
      hackathon: hackathonObjectId,
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
    
    console.log('Registration saved:', {
      registrationId: registration._id,
      userId: registration.user,
      hackathonId: registration.hackathon,
      status: registration.status
    });
    
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