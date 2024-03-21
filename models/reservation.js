const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    meetingRoom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MeetingRoom',
        
    },
    startDate: {
        type: Date,
        
    },
    startTime: {
        type: String,
        
    },
    endTime: {
        type: String,
        
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        
    }
});

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
