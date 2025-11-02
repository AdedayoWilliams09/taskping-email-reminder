import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    // If user is logged in, redirect to dashboard
    return res.redirect('/dashboard');
  }
  // If not logged in, show the home page
  res.render('index', { title: 'Home' });
});

export default router;