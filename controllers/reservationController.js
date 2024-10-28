const Reservation = require('../models/Reservation');
const auth = require('../middlewares/authMiddleware');


// Créer une réservation
exports.createReservation = [auth, async (req, res) => {
    const { clientName, boatName, checkIn, checkOut } = req.body;
    const { id } = req.params;

    try {
        const newReservation = new Reservation({
            catwayNumber: id,
            clientName,
            boatName,
            checkIn,
            checkOut
        });

        await newReservation.save();
        res.json(newReservation);
    } catch (err) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
}];


// Afficher la liste de toutes les réservations d'un catway
exports.getReservationsByCatway = [auth, async (req, res) => {
    try {
        const reservations = await Reservation.find({ catwayNumber: req.params.id });

        res.json(reservations);
    } catch (err) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
}];


// Afficher les détails d'une réservation
exports.getReservationById = [auth, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.idReservation);
        if (!reservation) return res.status(404).json({ msg: 'Cette réservation n\'existe pas' });

        res.json(reservation);
    } catch (err) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
}];


// Supprimer une réservation
exports.deleteReservation = [auth, async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(req.params.idReservation);
        if (!reservation) {
            return res.status(404).json({ msg: 'Cette réservation n\'existe pas' });
        }

        res.json({ msg: 'La réservation a été supprimée avec succès' });
    } catch (err) {
        console.error('Erreur lors de la suppression de la réservation :', err);
        res.status(500).json({ msg: 'Erreur serveur' });
    }
}];


// Afficher la liste de toutes les réservations
exports.getAllReservations = [auth, async (req, res) => {
    try {
        const reservations = await Reservation.find();

        res.json(reservations);
    } catch (err) {
        res.status(500).json({ msg: 'Erreur serveur' });
    }
}];
