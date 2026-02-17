const express = require('express');
const { body } = require('express-validator');
const ctrl = require('../controllers/userController');

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

router.get('/', ctrl.listUsers);
router.get('/:id', ctrl.getUserById);

module.exports = router;

const { requireAuth } = require('../middleware/auth');

// ... keep your existing routes (register/login)

router.get('/me', requireAuth, ctrl.getMe);
router.put('/me', requireAuth, ctrl.updateMe);

// keep these last
router.get('/', ctrl.listUsers);
router.get('/:id', ctrl.getUserById);