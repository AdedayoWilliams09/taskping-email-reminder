import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';

// Show register page
export const showRegister = (req, res) => {
  res.render('auth/register', { title: 'Register', oldInput: {}, errors: [] });
};

// Handle register POST
export const register = async (req, res) => {
  const errors = validationResult(req);
  const { name, email, password, confirm } = req.body;

  if (!errors.isEmpty()) {
    // If there are validation errors, show them
    return res.render('auth/register', {
      title: 'Register',
      oldInput: { name, email },
      errors: errors.array(),
    });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email is already registered.');
      return res.redirect('/register');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/register');
  }
};

// Show login page
export const showLogin = (req, res) => {
  res.render('auth/login', { title: 'Login', oldInput: {}, errors: [] });
};

// Handle login POST
export const login = async (req, res) => {
  const errors = validationResult(req);
  const { email, password } = req.body;

  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      title: 'Login',
      oldInput: { email },
      errors: errors.array(),
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/login');
    }

    // Set session
    req.session.user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };
    req.session.isAuthenticated = true;

    req.flash('success', 'Welcome back!');
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/login');
  }
};

// Handle logout
export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      req.flash('error', 'Could not log out. Please try again.');
      return res.redirect('/');
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};