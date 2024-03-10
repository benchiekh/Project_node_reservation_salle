// meetingRoomRoutes.js

const express = require('express');
const router = express.Router();
const MeetingRoom = require('../models/meetingRoom');

// Route pour gérer l'ajout de salles de réunion// Route pour gérer les ajouts de salles de réunion
// Route pour gérer les ajouts de salles de réunion// Route pour gérer les ajouts de salles de réunion
// Route pour gérer les ajouts de salles de réunion
// Route pour gérer les ajouts de salles de réunion
router.post('/meetingRooms', async (req, res) => {
    // Récupérer les données du formulaire
    const { roomName, capacity, equipment, availability } = req.body;

    try {
        // Créer une nouvelle salle de réunion dans la base de données
        const newMeetingRoom = new MeetingRoom({
            name: roomName,
            capacity: capacity,
            equipment: equipment,
            availability: availability
        });

        // Enregistrer la nouvelle salle de réunion dans la base de données
        await newMeetingRoom.save();

        // Passer un message de succès à la vue
        res.render('meetingRooms', { name: req.user.name, successMessage: 'Salle de réunion ajoutée avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur Serveur');
    }
});


module.exports = router;
