const express = require('express') ;
const MeetingRoom = require('../models/meetingRoom.js');
const router = express.Router();
const Reservation = require('../models/reservation.js');
const { ensureAuthenticated } = require('../config/auth');

router.get('/salles', ensureAuthenticated, async (req, res) => {
    try {
        // Récupérer toutes les salles de réunion depuis la base de données
        const meetingRooms = await MeetingRoom.find();
        res.render('salles', { 
            name: req.user.name,
            meetingRooms: meetingRooms,
            errors: [] // Assurez-vous de passer errors même si c'est vide pour éviter l'erreur
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur Serveur');
    }
});router.post('/deleteMeetingRoom/:id', async (req, res) => {
  try {
    const userRole = req.user.role; // Supposons que le rôle de l'utilisateur est stocké dans req.user.role

    // Vérifier si l'utilisateur est un administrateur
    if (userRole !== 'admin') {
      return res.status(403).send('Accès non autorisé. Seuls les administrateurs peuvent supprimer des salles de réunion.');
    }

    const roomId = req.params.id;

    // Vérifier si la salle de réunion existe
    const meetingRoom = await MeetingRoom.findById(roomId);
    if (!meetingRoom) {
      return res.status(404).send('Salle de réunion non trouvée');
    }

    // Supprimer la salle de réunion du modèle MeetingRoom
    await MeetingRoom.findByIdAndDelete(roomId);

    // Vérifier et supprimer les réservations associées à cette salle de réunion
    await Reservation.deleteMany({ MeetingRoom: roomId });

    // Rediriger vers la même page pour actualiser après la suppression
    res.redirect('/salle/salles'); // Modifier '/salle' selon votre chemin de page

  } catch (error) {
    console.error('Une erreur s\'est produite lors de la suppression de la salle de réunion:', error);
    res.status(500).send('Une erreur s\'est produite lors de la suppression de la salle de réunion.');
  }
});

module.exports = router ;