const express = require('express') ;
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const MeetingRoom = require('../models/meetingRoom');

// welcome page 
router.get('/',(req,res)=> res.render('welcome'));

//dashboard 

router.get('/meetingRooms',ensureAuthenticated, (req, res) => {
    res.render('meetingRooms', { 
        name: req.user.name,
        errors: [],
        meetingRooms: MeetingRoom
        // Assurez-vous de passer errors même si c'est vide pour éviter l'erreur
    });
});

module.exports = router ;
