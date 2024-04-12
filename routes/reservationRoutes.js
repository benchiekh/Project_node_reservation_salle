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

        
        res.redirect('/salle/salles?reservation=confirmee');
        
    } catch (error) {
        console.error('Une erreur s\'est produite lors de la confirmation de la réservation:', error);
        res.status(500).send('Une erreur s\'est produite lors de la confirmation de la réservation.');
    }
});
router.delete('/cancelReservation/:id', async (req, res) => {
    try {
        const { roomName } = req.body;

        const reservationId = req.params.id;
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).send('Réservation non trouvée');
        }

        // Mettre à jour la disponibilité de la salle de réunion dans MongoDB
        const meetingRoom = await MeetingRoom.findOneAndUpdate({ name: roomName }, { availability: true });

        // Supprimer la réservation de la base de données
        await Reservation.findByIdAndDelete(reservationId);

        res.status(200).send('Réservation annulée avec succès');
    } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'annulation de la réservation:', error);
        res.status(500).send('Une erreur s\'est produite lors de l\'annulation de la réservation.');
    }
});

    



module.exports = router;
