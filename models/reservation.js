// Importer mongoose
const mongoose = require('mongoose');

// Définir le schéma de réservation
const reservationSchema = new mongoose.Schema({
    meetingRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MeetingRoom', // Référence au modèle MeetingRoom
        required: true // Indique que ce champ est obligatoire
    },
    startDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

// Créer le modèle Reservation à partir du schéma
const Reservation = mongoose.model('Reservation', reservationSchema);

// Exporter le modèle Reservation
module.exports = Reservation;
