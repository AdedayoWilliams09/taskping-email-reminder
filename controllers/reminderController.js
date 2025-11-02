import Reminder from '../models/Reminder.js';
import { validationResult } from 'express-validator';

// List all reminders for the logged-in user, with filter and search
export const listReminders = async (req, res) => {
  try {
    const userId = req.session.user._id;
    const filter = req.query.status || ''; 
    const search = req.query.q || '';      // search query

    // Build the MongoDB query object
    let query = { user: userId };

    // If a status filter is selected, add it to the query
    if (filter) {
      query.status = filter;
    }

    // If a search query is provided, search in title or description (case-insensitive)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Find reminders matching the query, sorted by date/time
    const reminders = await Reminder.find(query).sort({ dateTime: 1 });

    // Render the reminders list page, passing filter and search for UI
    res.render('reminders/list', {
      title: 'My Reminders',
      reminders,
      filter,
      search,
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load reminders.');
    res.redirect('/dashboard');
  }
};

// Show create reminder form
export const showCreateForm = (req, res) => {
  res.render('reminders/create', {
    title: 'Create Reminder',
    oldInput: {},
    errors: [],
  });
};

// Handle create reminder POST
export const createReminder = async (req, res) => {
  const errors = validationResult(req);
  const { title, description, dateTime, email, repeat } = req.body;

  if (!errors.isEmpty()) {
    return res.render('reminders/create', {
      title: 'Create Reminder',
      oldInput: req.body,
      errors: errors.array(),
    });
  }

  try {
    const reminder = new Reminder({
      user: req.session.user._id,
      title,
      description,
      dateTime,
      email,
      repeat,
    });
    await reminder.save();
    req.flash('success', 'Reminder created!');
    res.redirect('/reminders');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not create reminder.');
    res.redirect('/reminders/create');
  }
};

// Show edit reminder form
export const showEditForm = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.session.user._id });
    if (!reminder) {
      req.flash('error', 'Reminder not found.');
      return res.redirect('/reminders');
    }
    res.render('reminders/edit', {
      title: 'Edit Reminder',
      reminder,
      errors: [],
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load reminder.');
    res.redirect('/reminders');
  }
};

// Handle edit reminder POST
export const updateReminder = async (req, res) => {
  const errors = validationResult(req);
  const { title, description, dateTime, email, repeat } = req.body;

  if (!errors.isEmpty()) {
    return res.render('reminders/edit', {
      title: 'Edit Reminder',
      reminder: { ...req.body, _id: req.params.id },
      errors: errors.array(),
    });
  }

  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.session.user._id },
      { title, description, dateTime, email, repeat },
      { new: true }
    );
    if (!reminder) {
      req.flash('error', 'Reminder not found.');
      return res.redirect('/reminders');
    }
    req.flash('success', 'Reminder updated!');
    res.redirect('/reminders');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not update reminder.');
    res.redirect(`/reminders/${req.params.id}/edit`);
  }
};

// Handle delete reminder
export const deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndDelete({
      _id: req.params.id,
      user: req.session.user._id,
    });
    if (!reminder) {
      req.flash('error', 'Reminder not found.');
      return res.redirect('/reminders');
    }
    req.flash('success', 'Reminder deleted.');
    res.redirect('/reminders');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not delete reminder.');
    res.redirect('/reminders');
  }
};