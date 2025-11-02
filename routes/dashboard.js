import express from 'express';
import { showDashboard } from '../controllers/dashboardController.js';
import { ensureAuthenticated } from '../middleware/auth.js';
   


const router = express.Router();

// GET /dashboard - show dashboard, only if logged in
router.get('/dashboard', ensureAuthenticated, showDashboard);

export default router;