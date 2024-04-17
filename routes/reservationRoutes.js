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
router.put('/api/meetingroom/:id/cancelreservation', async (req, res) => {
    const roomId = req.params.id;
    
    try {
        const meetingRoom = await MeetingRoom.findById(roomId);

        if (!meetingRoom) {
            return res.status(404).json({ error: 'La salle de réunion n\'a pas été trouvée' });
        }

        // Récupérer les informations de réservation avant l'annulation
        const reservationInfo = {
            reservation: meetingRoom.reservation,
            availability: meetingRoom.availability
        };

        // Renvoyer les informations de réservation et de disponibilité
        return res.json({ 
            message: 'La réservation a été annulée avec succès',
            reservationInfo: reservationInfo
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Erreur interne du serveur lors de l\'annulation de la réservation' });
    }
});


module.exports = router;
