const express = require('express') ;
const User = require('../models/User');
const nodemailer = require('nodemailer');

const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');
 
require('dotenv').config();
// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.SERVICE,
    port: process.env.PORT_MAILER,
    secure: process.env.SECURE,
    auth: {
        user: process.env.USER_MAILER, // Your Gmail email address
        pass: process.env.PASS_MAILER // Your Gmail password
    },
    tls:{
        rejectUnauthorized:false
    }
});

// Function to send confirmation email
async function sendConfirmationEmail(userEmail,userName) {
    try {
        await transporter.sendMail({
            from: 'LAST RESERVATION',
            to: userEmail, // User's email address
            subject: 'Confirmation d\'inscription',
            text: `Cher ${userName},Votre inscription a été confirmée avec succès. Merci de vous être inscrit.`,
        });
        console.log('Confirmation email sent successfully');
    } catch (error) {
        console.error('Error sending confirmation email ', error);
    }
}

// Login Page
router.get('/login', (req, res) => {
    res.render('login', { message: req.flash('error') }); // Passer les messages flash à la vue
});

// Register Page
router.get('/register', (req, res) => {
    res.render('register', { errors: [] }); // Passer les données à votre modèle à l'intérieur de la fonction de rappel
});

// Register handle
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
            errors,
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
                    errors,
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
                    password,
                    role: 'user' // Défaut: utilisateur normal
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
                                // Envoyer l'email de confirmation
                                sendConfirmationEmail(user.email,user.name);
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
router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) { return next(err); }
        if (!user) {
            req.flash('error', 'Invalid email or password.'); // Définir le message d'erreur flash
            return res.redirect('/users/login');
        }
        req.login(user, (err) => {
            if (err) { return next(err); }
            if (user.role === 'admin') {
                req.flash('success', 'Welcome, admin.'); // Flash message for admin login
                return res.redirect('/meetingRooms'); // Redirect admin to meetingRooms
            } else {
                req.flash('success', 'Welcome, user.'); // Flash message for user login
                return res.redirect('/salle/salles'); // Redirect user to salles
            }
        });
    })(req, res, next);
});


// log out 
router.post('/logout', (req, res) => {
    req.logout(() => {}); // Déconnexion de l'utilisateur
    req.flash('success_msg', 'Vous êtes déconnecté.'); // Flash message pour informer l'utilisateur qu'il est déconnecté
    res.redirect('/'); // Redirection vers la page d'accueil
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