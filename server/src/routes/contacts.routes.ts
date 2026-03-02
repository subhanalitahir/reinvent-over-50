import { Router } from 'express';
import { body } from 'express-validator';
import validate from '../middleware/validate.middleware';
import { protect, adminOnly } from '../middleware/auth.middleware';
import {
  createContact,
  getAllContacts,
  getContactById,
  updateContact,
  deleteContact,
} from '../controllers/contacts.controller';

const router = Router();

router.post(
  '/',
  [
    body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
    body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
    body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }),
    body('subject').optional().isIn(['general', 'membership', 'technical', 'partnership', 'other']),
  ],
  validate,
  createContact
);

// Admin routes
router.get('/', protect, adminOnly, getAllContacts);
router.get('/:id', protect, adminOnly, getContactById);
router.put('/:id', protect, adminOnly, updateContact);
router.delete('/:id', protect, adminOnly, deleteContact);

export default router;
