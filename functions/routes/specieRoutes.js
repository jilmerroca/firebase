// routes/specieRoutes.js
const express = require('express');
const router = express.Router();
const specieController = require('../controllers/specieController');

router.get('/', specieController.getAllSpecies);
router.get('/:name', specieController.getSingleSpecie);
router.post('/', specieController.createSpecie);
router.put('/:name', specieController.updateSpecie);
router.delete('/:name', specieController.deleteSpecie);

module.exports = router;