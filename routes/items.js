const express = require('express');
const router = express.Router();


const itemsController = require('../controllers/items');
const validation = require('../middleware/validation');

router.get('/', itemsController.getAll);

router.get('/:id', itemsController.getSingle);

router.post('/', validation.saveItem, itemsController.createItem);

router.put('/:id', validation.saveItem, itemsController.updateItem);

router.delete('/:id', itemsController.deleteItem);

module.exports = router;