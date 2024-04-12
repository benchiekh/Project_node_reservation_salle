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
app.use(flash());
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour les messages flash
app.use(flash());

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/salle',require('./routes/salles'));


const meetingRoomRoutes = require('./routes/meetingRoomRoutes');
app.use('/room', meetingRoomRoutes);
const reservationRoutes = require('./routes/reservationRoutes');
app.use('/reservation', reservationRoutes);
/*
const reservationRoutes = require('./routes/reservationRoute');
app.use('/reservations', reservationRoutes);
*/
const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
