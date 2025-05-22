const router = require('express').Router();

router.use('/', require('./swagger'));

router.get('/', (req,res) => {
    //#swagger.tags=['Hello World']
    res.send('Hello World!');

});

router.use('/items', require('./items'));
//router.use('/users', require('./users'));


module.exports = router;