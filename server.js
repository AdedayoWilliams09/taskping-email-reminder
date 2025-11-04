import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import expressLayouts from "express-ejs-layouts";
import { fileURLToPath } from 'url';
import session from 'express-session';
import flash from 'connect-flash';
import connectDB from './config/db.js';
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import remindersRoutes from './routes/reminders.js';
import profileRoutes from './routes/profile.js';
import './jobs/reminderJob.js';

// Setup for ES6 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ----- VIEW ENGINE SETUP -----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // This automatically wraps all views in layout.ejs

// ----- MIDDLEWARE -----
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// ----- SESSION & FLASH -----
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'supersecret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);
app.use(flash());

// ----- GLOBAL VARIABLES -----
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.isAuthenticated = req.session.isAuthenticated || false;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// ----- ROUTES -----
app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', dashboardRoutes);
app.use('/', remindersRoutes);
app.use('/', profileRoutes);

// 404 handler (for pages not found)
app.use((req, res, next) => {
  res.status(404).render('error', {
    title: '404 Not Found',
    message: 'Sorry, the page you are looking for does not exist.',
  });
});

// Centralized error handler (for all other errors)
app.use((err, req, res, next) => {
  // Log the error to the server console (never show details to users)
  console.error('Server Error:', err);

  // Show a friendly error page
  res.status(500).render('error', {
    title: 'Error',
    message: 'Something went wrong! Please try again later.',
  });
});

// ----- START SERVER -----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
