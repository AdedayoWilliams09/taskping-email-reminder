import cron from 'node-cron';
import Reminder from '../models/Reminder.js';
import { sendReminderEmail } from '../services/emailService.js';

cron.schedule('* * * * *', async () => {
  console.log(' Checking for due reminders...');

  const now = new Date();

  // 1. Send due reminders (status: upcoming, dateTime <= now)
  const dueReminders = await Reminder.find({
    status: 'upcoming',
    dateTime: { $lte: now },
  });

  for (const reminder of dueReminders) {
    // Prepare email content
    const subject = `Reminder: ${reminder.title}`;
    const text = `${reminder.description || ''}\n\nScheduled for: ${reminder.dateTime.toLocaleString()}`;
    const html = `
      <h2>${reminder.title}</h2>
      <p>${reminder.description || ''}</p>
      <p><strong>Scheduled for:</strong> ${reminder.dateTime.toLocaleString()}</p>
      <p>This is an automated reminder from Task Ping Email Reminder App.</p>
    `;

    // Send email
    const sent = await sendReminderEmail({
      to: reminder.email,
      subject,
      text,
      html,
    });

    // Update status
    if (sent) {
      reminder.status = 'sent';
      await reminder.save();
      console.log(`Reminder "${reminder.title}" sent and status updated.`);
    } else {
      console.log(` Failed to send reminder "${reminder.title}".`);
    }
  }


  const missedResult = await Reminder.updateMany(
    {
      status: 'upcoming',
      dateTime: { $lt: new Date(Date.now() - 60 * 1000) }, // 1 minute grace period
    },
    { $set: { status: 'missed' } }
  );
  if (missedResult.modifiedCount > 0) {
    console.log(` Marked ${missedResult.modifiedCount} reminders as missed.`);
  }
});