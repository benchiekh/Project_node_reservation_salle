module.exports = {
    ensureAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        req.flash('error_msg', 'Veuillez vous connecter pour voir cette page.');
        res.redirect('/users/login');
    },
    ensureAdmin: function(req, res, next) {
        if(req.isAuthenticated() && req.user.role === 'admin') {
            return next();
        }
        res.status(403).send('Accès non autorisé. Seuls les administrateurs peuvent accéder à cette page.');
    }
};
