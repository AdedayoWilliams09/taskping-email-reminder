import express from 'express';
import { body } from 'express-validator';
import {
  showRegister,
  register,
  showLogin,
  login,
  logout,
} from '../controllers/authController.js';

const router = express.Router();

// Registration routes
router.get('/register', showRegister);
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty().withMessage('Name is required')
      .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('confirm')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Passwords do not match'),
  ],
  register
);

// Login routes
router.get('/login', showLogin);
router.post(
  '/login',
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email'),
    body('password')
      .notEmpty().withMessage('Password is required'),
  ],
  login
);

// Logout route
router.get('/logout', logout);

export default router;