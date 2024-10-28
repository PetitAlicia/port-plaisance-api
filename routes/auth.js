const express = require('express');
const auth = require('../middlewares/authMiddleware');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signup', auth, authController.signup);
router.post('/login', authController.login);
router.delete('/delete/:userId', auth, authController.deleteUser);
router.get('/users', auth, authController.getUsers);

module.exports = router;
