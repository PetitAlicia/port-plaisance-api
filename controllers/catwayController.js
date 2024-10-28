const Catway = require('../models/Catway');
const auth = require('../middlewares/authMiddleware');


// Créer un catway
exports.createCatway = [auth, async (req, res) => {
  const { catwayNumber, type, catwayState } = req.body;

  try {
    const newCatway = new Catway({ catwayNumber, type, catwayState });
    await newCatway.save();

    res.json(newCatway);
  } catch (err) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
}];


// Afficher la liste de tous les catways
exports.getAllCatways = [auth, async (req, res) => {
  try {
    const catways = await Catway.find();

    res.json(catways);
  } catch (err) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
}];


// Afficher les détails d'un catway
exports.getCatwayById = [auth, async (req, res) => {
  try {
    const catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).json({ msg: 'Ce catway n\'existe pas' });

    res.json(catway);
  } catch (err) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
}];


// Modifier un catway
exports.updateCatway = [auth, async (req, res) => {
  try {
    let catway = await Catway.findById(req.params.id);
    if (!catway) return res.status(404).json({ msg: 'Ce catway n\'existe pas' });

    const { catwayNumber, type, catwayState } = req.body;
    catway.catwayNumber = catwayNumber;
    catway.type = type;
    catway.catwayState = catwayState;
    await catway.save();

    res.json(catway);
  } catch (err) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
}];


// Supprimer un catway
exports.deleteCatway = [auth, async (req, res) => {
  try {
    const catway = await Catway.findByIdAndDelete(req.params.id);
    if (!catway) {
      return res.status(404).json({ msg: 'Ce catway n\'existe pas' });
    }

    res.json({ msg: 'Le catway a été supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression du catway :', err);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
}];
