const express = require('express') ;
const MeetingRoom = require('../models/meetingRoom.js');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');

router.get('/salles', ensureAuthenticated, async (req, res) => {
    try {
        // Récupérer toutes les salles de réunion depuis la base de données
        const meetingRooms = await MeetingRoom.find();
        res.render('salles', { 
            name: req.user.name,
            meetingRooms: meetingRooms,
            errors: [] // Assurez-vous de passer errors même si c'est vide pour éviter l'erreur
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur Serveur');
    }
});

module.exports = router ;