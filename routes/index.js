const express = require('express') ;
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');

// welcome page 
router.get('/',(req,res)=> res.render('welcome'))
//dashboard 
router.get('/meetingRooms',ensureAuthenticated ,(req,res)=>
res.render('meetingRooms' , {
    name: req.user.name
    
}));
module.exports = router ;