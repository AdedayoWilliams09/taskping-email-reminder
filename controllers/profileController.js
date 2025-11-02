import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

// Show profile page
export const showProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    res.render('profile', {
      title: 'Profile',
      user,
      errors: [],
      emailSuccess: req.flash('emailSuccess'),
      emailError: req.flash('emailError'),
      passwordSuccess: req.flash('passwordSuccess'),
      passwordError: req.flash('passwordError'),
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load profile.');
    res.redirect('/dashboard');
  }
};

// Update email
export const updateEmail = async (req, res) => {
  const errors = validationResult(req);
  const { email } = req.body;

  if (!errors.isEmpty()) {
    req.flash('emailError', errors.array()[0].msg);
    return res.redirect('/profile');
  }

  try {
    // Check if email is already taken
    const existing = await User.findOne({ email, _id: { $ne: req.session.user._id } });
    if (existing) {
      req.flash('emailError', 'Email is already in use.');
      return res.redirect('/profile');
    }

    const user = await User.findByIdAndUpdate(
      req.session.user._id,
      { email },
      { new: true }
    );
    req.session.user.email = email; // update session
    req.flash('emailSuccess', 'Email updated successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('emailError', 'Could not update email.');
    res.redirect('/profile');
  }
};

// Change password
export const changePassword = async (req, res) => {
  const errors = validationResult(req);
  const { oldPassword, newPassword } = req.body;

  if (!errors.isEmpty()) {
    req.flash('passwordError', errors.array()[0].msg);
    return res.redirect('/profile');
  }

  try {
    const user = await User.findById(req.session.user._id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      req.flash('passwordError', 'Old password is incorrect.');
      return res.redirect('/profile');
    }

    const hashed = await bcrypt.hash(newPassword, 12);
    user.password = hashed;
    await user.save();
    req.flash('passwordSuccess', 'Password changed successfully!');
    res.redirect('/profile');
  } catch (err) {
    console.error(err);
    req.flash('passwordError', 'Could not change password.');
    res.redirect('/profile');
  }
};