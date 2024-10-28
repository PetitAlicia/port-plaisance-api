const express = require('express');
const auth = require('../middlewares/authMiddleware');
const reservationController = require('../controllers/reservationController');

const router = express.Router({ mergeParams: true });

router.post('/', auth, reservationController.createReservation);
router.get('/', auth, reservationController.getReservationsByCatway);
router.get('/:idReservation', auth, reservationController.getReservationById);
router.delete('/:idReservation', auth, reservationController.deleteReservation);
router.get('/all', auth, reservationController.getAllReservations);

module.exports = router;
