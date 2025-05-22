const mongodb = require('../db/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['items']
  try {
    const result = await mongodb.getDb().collection('items').find();
    const items = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve items', error: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=['items']
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Must use a valid item id.");
  }
  try {
    const itemId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('items').find({ _id: itemId });
    const items = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(items[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve the item', error: err.message });
  }
};

const createItem = async (req, res) => {
  //#swagger.tags=['items']
  const  item = {
    name: req.body.name,
    quantity: parseInt(req.body.quantity, 10), // convert string to number
    price: parseFloat(req.body.price), // convert string to decimal
    description: req.body.description,
    category: req.body.category,
    supplier: req.body.supplier,
    lastUpdated: new Date(req.body.lastUpdated) // convert string to Date
  };

  const response = await mongodb.getDb().collection('items').insertOne(item);
  if (response.acknowledged) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured while creating the item.');
  }
};

const updateItem = async (req, res) => {
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Must use a valid item id.");
  }
  //#swagger.tags=['items']
  const itemId = new ObjectId(req.params.id);
  const  item = {
    name: req.body.name,
    quantity: parseInt(req.body.quantity, 10), // convert string to number
    price: parseFloat(req.body.price), // convert string to decimal
    description: req.body.description,
    category: req.body.category,
    supplier: req.body.supplier,
    lastUpdated: new Date(req.body.lastUpdated) // convert string to Date
  };

  const response = await mongodb.getDb().collection('items').replaceOne({_id: itemId}, item);
  if (response.modifiedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured while updating the item.');
  }
};

const deleteItem = async (req, res) => {
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Must use a valid item id.");
  }
  //#swagger.tags=['items']
  const itemId = new ObjectId(req.params.id);
  const response  = await mongodb.getDb().collection('items').deleteOne({_id: itemId});
  if (response.deletedCount > 0) {
    res.status(204).send();
  } else {
    res.status(500).json(response.error || 'Some error occured while deleting the item.');
  }
};

module.exports = { getAll, getSingle, createItem, updateItem, deleteItem};