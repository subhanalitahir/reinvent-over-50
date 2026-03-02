import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.middleware';
import { protect, adminOnly } from '../middleware/auth.middleware';
import {
  register,
  login,
  getMe,
  updateMe,
  changePassword,
  deleteMe,
  getAllUsers,
  deleteUser,
} from '../controllers/auth.controller';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  ],
  validate,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validate,
  login
);

router.get('/me', protect, getMe);
router.put('/me', protect, updateMe);
router.put('/change-password', protect, changePassword);
router.delete('/me', protect, deleteMe);

// Admin routes
router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);

export default router;
