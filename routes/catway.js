const express = require('express');
const auth = require('../middlewares/authMiddleware');
const catwayController = require('../controllers/catwayController');

const router = express.Router();

router.post('/', auth, catwayController.createCatway);
router.get('/', auth, catwayController.getAllCatways);
router.get('/:id', auth, catwayController.getCatwayById);
router.put('/:id', auth, catwayController.updateCatway);
router.delete('/:id', auth, catwayController.deleteCatway);

module.exports = router;
