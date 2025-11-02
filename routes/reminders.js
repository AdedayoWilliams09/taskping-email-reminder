import express from 'express';
import { body } from 'express-validator';
import {
  listReminders,
  showCreateForm,
  createReminder,
  showEditForm,
  updateReminder,
  deleteReminder,
} from '../controllers/reminderController.js';
import { ensureAuthenticated } from '../middleware/auth.js';

const router = express.Router();

router.get('/reminders', ensureAuthenticated, listReminders);

router.get('/reminders/create', ensureAuthenticated, showCreateForm);
router.post(
  '/reminders/create',
  ensureAuthenticated,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('dateTime').notEmpty().withMessage('Date and time are required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('repeat').isIn(['none', 'daily', 'weekly', 'monthly', 'yearly']),
  ],
  createReminder
);

router.get('/reminders/:id/edit', ensureAuthenticated, showEditForm);
router.post(
  '/reminders/:id/edit',
  ensureAuthenticated,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('dateTime').notEmpty().withMessage('Date and time are required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('repeat').isIn(['none', 'daily', 'weekly', 'monthly', 'yearly']),
  ],
  updateReminder
);

// Mark as completed (only one copy!)
router.post('/reminders/:id/complete', ensureAuthenticated, async (req, res) => {
  try {
    await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user._id },
      { status: 'completed' }
    );
    req.flash('success', 'Reminder marked as completed!');
    res.redirect('/reminders');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not mark as completed.');
    res.redirect('/reminders');
  }
});

router.post('/reminders/:id/delete', ensureAuthenticated, deleteReminder);

export default router;