const express = require('express');
const router = express.Router();
const MeetingRoom = require('../models/meetingRoom');
const { ensureAuthenticated } = require('../config/auth');


router.post('/meetingRooms', ensureAuthenticated, async (req, res) => {
    const { roomName, capacity, equipment, availability } = req.body;
    let errors = [];

    // Vérifier si tous les champs sont remplis
    if (!roomName || !capacity || !equipment || !availability) {
        errors.push({ msg: 'Veuillez remplir tous les champs' });
    }

    // Vérifier si une salle avec le même nom existe déjà
    const existingRoom = await MeetingRoom.findOne({ name: roomName });
    if (existingRoom) {
        errors.push({ msg: 'Une salle avec ce nom existe déjà' });
    }

    // Si des erreurs sont présentes, les afficher et ne pas ajouter la salle
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
        // Si aucune erreur, ajouter la nouvelle salle à la base de données
        try {
            const newMeetingRoom = new MeetingRoom({
                name: roomName,
                capacity: capacity,
                equipment: equipment,
                availability: availability
            });
            await newMeetingRoom.save();
            req.flash('successMessage', 'Salle ajoutée avec succès'); // Enregistrer le message de succès dans le flash
            res.redirect('/meetingRooms'); // Rediriger vers la page meetingRooms pour afficher le message de succès
        } catch (err) {
            console.error(err);
            res.status(500).send('Erreur Serveur');
        }
    }
});

module.exports = router;
