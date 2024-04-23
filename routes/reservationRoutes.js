// reservationRoutes.js

const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Reservation = require('../models/reservation');
const MeetingRoom = require('../models/meetingRoom');
const USER = require('../models/User');
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
async function sendConfirmationEmail(userEmail,startTime,endTime) {
    try {
        await transporter.sendMail({
            from: 'LAST RESERVATION',
            to: userEmail, // User's email address
            subject: 'Confirmation Resrvation',
            text: `Merci d'avoir effectué votre réservation.\n\nVotre réservation commence à ${startTime} et se termine à ${endTime}.`,
        });
        console.log('Confirmation Resrvation sent successfully');
    } catch (error) {
        console.error('Error sending confirmation email:', error);
    }
}
  router.post('/confirmReservation', async (req, res) => {
    try {
        const { roomName, dateDebut, heureDebut, heureFin, dateFin } = req.body;
        
        // Trouver l'ID de la salle de réunion en fonction de son nom
        const meetingRoom = await MeetingRoom.findOne({ name: roomName });
        if (!meetingRoom) {
            return res.status(400).send("La salle de réunion spécifiée n'existe pas.");
        }

        // Enregistrer la réservation dans la base de données
        const newReservation = new Reservation({
            meetingRoom: meetingRoom._id,
            startDate: dateDebut,
            startTime: heureDebut,
            endTime: heureFin,
            endDate: dateFin,
            userId: req.user ? req.user.id : null // Assurez-vous que req.user existe avant d'accéder à son ID
        });

        await newReservation.save();

        // Mettre à jour la disponibilité de la salle de réunion
        await MeetingRoom.findOneAndUpdate({ name: roomName }, { availability: false });

        // Utiliser populate pour inclure les détails de la salle de réunion dans la réservation
        const reservationWithRoom = await Reservation.findById(newReservation._id)
            .populate('meetingRoom');
            const user = await USER.findById(req.user);
            sendConfirmationEmail(user.email , reservationWithRoom.dateDebut, reservationWithRoom.heureFin );
        // Rediriger avec un paramètre de requête pour indiquer la confirmation
        res.redirect('/salle/salles?reservation=confirmee');

    } catch (error) {
        console.error('Une erreur s\'est produite lors de la confirmation de la réservation:', error);
        res.status(500).send('Une erreur s\'est produite lors de la confirmation de la réservation.');
    }
});
router.post('/cancelReservation', async (req, res) => {
    try {
        const { reservationId } = req.body;
        
        // Vérifier si reservationId est défini
        if (reservationId) {
            return res.status(400).send("L'identifiant de la réservation est requis pour annuler la réservation.");
        }
        
        // Recherche de la réservation dans la base de données
        const reservation = await Reservation.findOne({ _id: reservationId });

        // Vérifier si la réservation existe
        if (!reservation) {
            return res.status(400).send("La réservation spécifiée n'existe pas.");
        }

        // Mettre à jour la disponibilité de la salle de réunion associée à la réservation
        await MeetingRoom.findByIdAndUpdate(reservation.meetingRoom, { availability: true });

        // Supprimer la réservation de la base de données
        await Reservation.findByIdAndDelete(reservation._id);

        // Rediriger avec un paramètre de requête pour indiquer l'annulation
        res.redirect('/salle/salles?reservation=annulee');

    } catch (error) {
        console.error('Une erreur s\'est produite lors de l\'annulation de la réservation :', error);
        res.status(500).send('Une erreur s\'est produite lors de l\'annulation de la réservation.');
    }
});


module.exports = router;
