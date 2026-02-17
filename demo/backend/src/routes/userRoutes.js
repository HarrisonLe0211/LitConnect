const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/userController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post(
  '/register',
  [
    body('fullName').isString().isLength({ min: 2, max: 80 }),
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 8, max: 72 })
  ],
  ctrl.register
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isString().isLength({ min: 1, max: 72 })
  ],
  ctrl.login
);

// ✅ MUST be before "/:id"
router.get('/me', requireAuth, ctrl.getMe);
router.put('/me', requireAuth, ctrl.updateMe);

// other routes
router.get('/', ctrl.listUsers);
router.get('/:id', ctrl.getUserById);

module.exports = router;