const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();
const db = require('./config/keys').MongoURI;

// passport config 
 require('./config/passport')(passport) ;
// Middleware pour parser les données POST
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour les fichiers de mise en page EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Connexion à MongoDB
mongoose
  .connect(db,)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware pour les sessions Express
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Middleware pour les messages flash
app.use(flash());

// Middleware pour rendre les messages flash disponibles dans toutes les vues
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
