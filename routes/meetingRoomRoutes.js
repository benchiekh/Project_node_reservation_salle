const express = require('express');
const router = express.Router();
const MeetingRoom = require('../models/meetingRoom');
const { ensureAuthenticated } = require('../config/auth');


router.get('/meetingRooms', ensureAuthenticated, async (req, res) => {
    try {
        // Récupérer toutes les salles de réunion depuis la base de données
        const meetingRooms = await MeetingRoom.find();
        res.render('meetingRooms', { 
            name: req.user.name,
            meetingRooms: meetingRooms,
            errors: [] // Assurez-vous de passer errors même si c'est vide pour éviter l'erreur
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur Serveur');
    }
});


router.post('/meetingRooms',ensureAuthenticated, async (req, res) => {
    const { roomName, capacity, equipment, availability } = req.body;
    let errors = [];

    if (!roomName || !capacity || !equipment || !availability) {
        errors.push({ msg: 'Veuillez remplir tous les champs' });
    }

    if (errors.length > 0) {
        res.render('meetingRooms', {
            name: req.user.name,
            errors,
            roomName,
            capacity,
            equipment,
            availability
        });
    } else {
        try {
            const newMeetingRoom = new MeetingRoom({
                name: roomName,
                capacity: capacity,
                equipment: equipment,
                availability: availability
            });
            await newMeetingRoom.save();
            req.flash('successMessage', 'Salle ajoutée avec succès');
            // Rendre la nouvelle page ejs ici
            res.render('meetingRooms', {
                name: req.user.name,
                successMessage: req.flash('successMessage')
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Erreur Serveur');
        }
    }
});

module.exports = router;
