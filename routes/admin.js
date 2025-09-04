const express = require('express');
const Hackathon = require('../models/Hackathon');
const Registration = require('../models/Registration');
const User = require('../models/User');
const router = express.Router();

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.redirect('/auth/login');
  }
  next();
};

// Admin dashboard
router.get('/dashboard', requireAdmin, async (req, res) => {
  try {
    const hackathons = await Hackathon.find().sort({ createdAt: -1 });
    const totalUsers = await User.countDocuments({ isAdmin: false });
    const totalRegistrations = await Registration.countDocuments();
    
    res.render('admin/dashboard', {
      user: req.session.user,
      hackathons,
      stats: {
        totalUsers,
        totalRegistrations,
        totalHackathons: hackathons.length
      }
    });
  } catch (error) {
    res.render('admin/dashboard', {
      user: req.session.user,
      hackathons: [],
      stats: { totalUsers: 0, totalRegistrations: 0, totalHackathons: 0 },
      error: 'Failed to load dashboard'
    });
  }
});

// Create hackathon page
router.get('/create-hackathon', requireAdmin, (req, res) => {
  res.render('admin/create-hackathon', { user: req.session.user, error: null });
});

// Create hackathon POST
router.post('/create-hackathon', requireAdmin, async (req, res) => {
  try {
    const { title, description, startDate, endDate, registrationDeadline, maxParticipants, prizes, rules } = req.body;
    
    const hackathon = new Hackathon({
      title,
      description,
      startDate,
      endDate,
      registrationDeadline,
      maxParticipants,
      prizes,
      rules
    });
    
    await hackathon.save();
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.render('admin/create-hackathon', {
      user: req.session.user,
      error: 'Failed to create hackathon'
    });
  }
});

// View registrations for a hackathon
router.get('/hackathon/:id/registrations', requireAdmin, async (req, res) => {
  try {
    const hackathon = await Hackathon.findById(req.params.id);
    const registrations = await Registration.find({ hackathon: req.params.id })
      .populate('user');
    
    res.render('admin/registrations', {
      user: req.session.user,
      hackathon,
      registrations
    });
  } catch (error) {
    res.redirect('/admin/dashboard');
  }
});

// Approve registration
router.post('/registration/:id/approve', requireAdmin, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    
    registration.status = 'approved';
    await registration.save();
    
    res.json({ success: true, message: 'Registration approved successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to approve registration' });
  }
});

// Reject registration
router.post('/registration/:id/reject', requireAdmin, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    
    registration.status = 'rejected';
    await registration.save();
    
    res.json({ success: true, message: 'Registration rejected successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reject registration' });
  }
});

// Reset registration status to pending
router.post('/registration/:id/reset', requireAdmin, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    
    registration.status = 'pending';
    await registration.save();
    
    res.json({ success: true, message: 'Registration status reset to pending' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reset registration status' });
  }
});

module.exports = router;