// MeetingRoom.js

const mongoose = require('mongoose');

// Définition du schéma de la salle de réunion
const meetingRoomSchema = new mongoose.Schema({
    name: { type: String, required: true },
    capacity: { type: Number, required: true },
    equipment: { type: [String], default: [] },
    availability: { type: Boolean, default: true }
});

// Création du modèle MeetingRoom à partir du schéma
const MeetingRoom = mongoose.model('MeetingRoom', meetingRoomSchema);

module.exports = MeetingRoom;
