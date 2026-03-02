import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.middleware';
import { protect, adminOnly } from '../middleware/auth.middleware';
import {
  createMembership,
  getMyMembership,
  updateMembership,
  cancelMembership,
  getAllMembers,
  getMemberById,
} from '../controllers/members.controller';

const router = Router();

router.post(
  '/',
  protect,
  [
    body('plan')
      .isIn(['community', 'growth', 'transformation'])
      .withMessage('Invalid plan'),
    body('billingCycle')
      .isIn(['monthly', 'annual'])
      .withMessage('Invalid billing cycle'),
  ],
  validate,
  createMembership
);

router.get('/me', protect, getMyMembership);
router.put('/me', protect, updateMembership);
router.delete('/me', protect, cancelMembership);

// Admin routes
router.get('/', protect, adminOnly, getAllMembers);
router.get('/:id', protect, adminOnly, getMemberById);

export default router;
