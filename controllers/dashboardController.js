import Reminder from '../models/Reminder.js';

export const showDashboard = async (req, res) => {
  const user = req.session.user;
  try {
    const reminders = await Reminder.find({
      user: user._id,
      dateTime: { $gte: new Date() }
    }).sort({ dateTime: 1 }).limit(5);
    res.render('dashboard', {
      title: 'Dashboard',
      user,
      reminders,
      search: '',
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not load reminders.');
    res.render('dashboard', {
      title: 'Dashboard',
      user,
      reminders: [],
      search: '',
    });
  }
};