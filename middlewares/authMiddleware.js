const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.header('Authorization') && req.header('Authorization').replace('Bearer ', '');
  if (!token) return res.status(401).json({ msg: 'Token non trouvé, accès refusé' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Le token est invalide' });
  }
}

module.exports = authMiddleware;
