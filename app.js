const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash');

const app = express();

const db = require('./config/keys').MongoURI;

// passport config 
require('./config/passport')(passport);

// Middleware pour parser les données POST
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour les fichiers de mise en page EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
 
// Connexion à MongoDB
mongoose
  .connect(db)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware pour les sessions Express
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour les messages flash
app.use(flash());

// Middleware pour charger l'utilisateur à partir de la session
app.use((req, res, next) => {
  res.locals.user = req.user; // Rendre l'utilisateur disponible dans les vues EJS
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/salle',require('./routes/salles'));

// Rendu de la vue "salles.ejs" avec les informations sur l'utilisateur et les salles
app.get('/salle/salles', async (req, res) => {
  try {
    const MeetingRoom = await MeetingRoom.find(); // Chargez les salles de réunion depuis votre modèle
    res.render('salles.ejs', { room: MeetingRoom });
  } catch (error) {
    console.error('Une erreur s\'est produite lors du rendu de la vue salles.ejs:', error);
    res.status(500).send('Une erreur s\'est produite lors du rendu de la vue salles.ejs.');
  }
});

const meetingRoomRoutes = require('./routes/meetingRoomRoutes');
app.use('/room', meetingRoomRoutes);
const reservationRoutes = require('./routes/reservationRoutes');
app.use('/reservation', reservationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
