const mongodb = require('../db/database');
const ObjectId = require('mongodb').ObjectId;

const getAll = async (req, res) => {
    //#swagger.tags=['users']
  try {
    const result = await mongodb.getDb().collection('users').find();
    const users = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve users', error: err.message });
  }
};

const getSingle = async (req, res) => {
  //#swagger.tags=['users']
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Must use a valid user id.");
  }
  try {
    const userId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().collection('users').find({ _id: userId });
    const users = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(users[0]);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve the user', error: err.message });
  }
};

const createUser = async (req, res) => {
  try {
      //#swagger.tags=['users']
    const  user = {
      name: req.body.name,
      gender: req.body.gender,
      email: req.body.email,
      birthday: new Date(req.body.birthday),// convert string to Date
      role: req.body.role,
      isMember: req.body.isMember
    };

    const response = await mongodb.getDb().collection('users').insertOne(user);
    if (response.acknowledged) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occured while creating the user.');
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to create user', error: err.message });
  }
};

const updateUser = async (req, res) => {
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Must use a valid user id.");
  }
  try {
      //#swagger.tags=['users']
    const userId = new ObjectId(req.params.id);
    const  user = {
      name: req.body.name,
      gender: req.body.gender,
      email: req.body.email,
      birthday: req.body.birthday,
      role: req.body.role,
      isMember: req.body.isMember
    };

    const response = await mongodb.getDb().collection('users').replaceOne({_id: userId}, user);
    if (response.modifiedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occured while updating the user.');
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

const deleteUser = async (req, res) => {
  if(!ObjectId.isValid(req.params.id)) {
    return res.status(400).json("Must use a valid user id.");
  }
  try {
      //#swagger.tags=['users']
    const userId = new ObjectId(req.params.id);
    const response  = await mongodb.getDb().collection('users').deleteOne({_id: userId});
    if (response.deletedCount > 0) {
      res.status(204).send();
    } else {
      res.status(500).json(response.error || 'Some error occured while deleting the user.');
    }
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
};

module.exports = { getAll, getSingle, createUser, updateUser, deleteUser};