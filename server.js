require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const catwayRoutes = require('./routes/catway');
const reservationRoutes = require('./routes/reservation');
const auth = require('./middlewares/authMiddleware');
const Catway = require('./models/Catway');
const Reservation = require('./models/Reservation');
const path = require('path');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));


// Options CORS
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


// Routes
app.get('/api/reservations/all', auth, async (req, res) => {
  try {
      const reservations = await Reservation.find();

      res.json(reservations);
  } catch (err) {
      console.error('Erreur lors de la récupération des réservations :', err);
      res.status(500).json({ msg: 'Erreur serveur' });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/catways', catwayRoutes);
app.use('/api/catways/:id/reservations', reservationRoutes);


// MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connecté'))
  .catch(err => console.log(err));


// Serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
