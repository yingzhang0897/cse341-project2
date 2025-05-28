const passport = require('passport');

const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/login', passport.authenticate('github'), (req, res) =>{});

router.get('/logout', function(req, res, next) {
    req.logout(function(err){
        if (err) {return next(err); }
        res.redirect('/');
    });
});

router.use('/items', require('./items'));
router.use('/users', require('./users'));


module.exports = router;