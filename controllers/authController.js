const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middlewares/authMiddleware');


// Créer un utilisateur
exports.signup = [auth, async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'Cet utilisateur existe déjà' });

    user = new User({ name, email, password });
    await user.save();

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userId: user.id });
  } catch (err) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
}];


// Connexion utilisateur
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Adresse e-mail invalide' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Mot de passe incorrect' });

    const payload = { userId: user.id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, userId: user.id });
  } catch (err) {
    res.status(500).json({ msg: 'Erreur serveur' });
  }
};


// Supprimer un utilisateur
exports.deleteUser = [auth, async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ msg: 'Cet utilisateur n\'existe pas' });
    }

    res.json({ msg: 'L\'utilisateur a été supprimé avec succès' });
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', err);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
}];


// Afficher la liste de tous les utilisateurs
exports.getUsers = [auth, async (req, res) => {
  try {
    const users = await User.find();
    const usersWithoutPassword = users.map(user => {
      const { password, ...userWithoutPassword } = user.toObject();
      return userWithoutPassword;
    });

    res.json(usersWithoutPassword);
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs :', err);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
}];
