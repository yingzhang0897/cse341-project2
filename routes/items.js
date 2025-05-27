const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');
const validation = require('../middleware/validation');
const { isAuthenticated } = require('../middleware/authenticate');

router.get('/', itemsController.getAll);

router.get('/:id', itemsController.getSingle);

router.post('/', isAuthenticated, validation.saveItem, itemsController.createItem);

router.put('/:id', isAuthenticated, validation.saveItem, itemsController.updateItem);

router.delete('/:id', isAuthenticated, itemsController.deleteItem);

module.exports = router;