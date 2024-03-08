const express = require('express') ;
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');

// Login Page
router.get('/login',  (req, res) => res.render('login'));

// Register Page
router.get('/register', (req, res) => {
    res.render('register', { errors: [] }); // Passer les données à votre modèle à l'intérieur de la fonction de rappel
});


// register hundle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];


  // Vérifier les champs requis
  if (!name || !email || !password || !password2) {
      errors.push({ msg: 'Veuillez remplir tous les champs' });
  }

  // Vérifier si les mots de passe correspondent
  if (password !== password2) {
      errors.push({ msg: 'Les mots de passe ne correspondent pas' });
  }

  // Vérifier la longueur du mot de passe
  if (password.length < 6) {
      errors.push({ msg: 'Le mot de passe doit comporter au moins 6 caractères' });
  }

  if (errors.length > 0) {
      // S'il y a des erreurs, rendre à nouveau le formulaire d'inscription avec les erreurs
      res.render('register', {
        errors ,
          name,
          email,
          password,
          password2
      });
  } else {
      // Vérifier si l'utilisateur existe déjà
      User.findOne({ email: email }).then(user => {
          if (user) {
              errors.push({ msg: 'L\'email existe déjà' });
              res.render('register', {
                errors ,
                  name,
                  email,
                  password,
                  password2
              });
          } else {
              // Créer un nouvel utilisateur
              const newUser = new User({
                  name,
                  email,
                  password
              });

              // Générer un sel et hacher le mot de passe
              bcrypt.genSalt(10, (err, salt) => {
                  bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
                      // Définir le mot de passe sur le hachage
                      newUser.password = hash;
                      // Enregistrer l'utilisateur dans la base de données
                      newUser.save()
                      .then(user => {
                          req.flash('success_msg', 'You are now registered and can log in');
                          res.redirect('/users/login');
                      })
                      .catch(err => console.log(err));
              });
                  
              });
          }
      });
  }
});
// login handle 
router.post('/login', (req,res,next)=>{
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        faireFlash: true
    })(req,res,next);
})
// log out 
router.get('/logout', (req, res) => {
    req.logout(() => {}); // Ajout d'une fonction de rappel vide
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router ;












/*
router.post('/register', async (req, res) => {
  try {
      // Récupération des données de la requête
      
      const {name,email,password,password2}=req.body
      // Création d'une nouvelle instance de l'utilisateur
      const newUser = new User({ name, email, password,password2 });

      // Enregistrement de l'utilisateur dans la base de données
      await newUser.save();

      // Réponse indiquant que l'utilisateur a été enregistré avec succès
      res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (err) {
      // En cas d'erreur, renvoyer une réponse d'erreur
      res.status(500).json({ errors: err.message });
  }
});
*/
