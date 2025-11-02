import express from 'express';
import { body } from 'express-validator';
import {
  showProfile,
  updateEmail,
  changePassword,
} from '../controllers/profileController.js';
import { ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router();

// GET /profile
router.get('/profile', ensureAuthenticated, showProfile);

// POST /profile/email
router.post(
  '/profile/email',
  ensureAuthenticated,
  [
    body('email')
      .trim()
      .notEmpty().withMessage('Email is required')
      .isEmail().withMessage('Please enter a valid email'),
  ],
  updateEmail
);

// POST /profile/password
router.post(
  '/profile/password',
  ensureAuthenticated,
  [
    body('oldPassword')
      .notEmpty().withMessage('Old password is required'),
    body('newPassword')
      .isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
    body('confirmPassword')
      .custom((value, { req }) => value === req.body.newPassword)
      .withMessage('Passwords do not match'),
  ],
  changePassword
);

export default router;