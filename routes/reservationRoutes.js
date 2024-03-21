// reservationRoutes.js

const express = require('express');
const router = express.Router();
const Reservation = require('../models/reservation');
const MeetingRoom = require('../models/meetingRoom');

// Route pour vérifier la disponibilité de la salle de réunion


// Route pour confirmer la réservation

router.post('/confirmReservation', async (req, res) => {
    try {
        const { roomName, dateDebut, heureDebut, heureFin, dateFin } = req.body;

        // Enregistrer la réservation dans la base de données
        const newReservation = new Reservation({
            MeetingRoom: roomName,
            startDate: dateDebut,
            startTime: heureDebut,
            endTime: heureFin,
            endDate: dateFin,
            userId: req.user.id // Assurez-vous que req.user.id contient l'ID de l'utilisateur connecté
        });

        await newReservation.save();

        await MeetingRoom.findOneAndUpdate({ name: roomName }, { availability: false });

        res.status(200).send('Réservation confirmée');
        window.location.reload();
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la confirmation de la réservation:', error);
        res.status(500).send('Une erreur s\'est produite lors de la confirmation de la réservation.');
    }
});

    



module.exports = router;
