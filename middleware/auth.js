export function ensureAuthenticated(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    // User is logged in, continue to the next function
    return next();
  }
  // User is not logged in, redirect to login page
  req.flash('error', 'Please log in to view that page.');
  res.redirect('/login');
}