const express = require('express');
const router = express.Router();
const savedController = require('../controllers/savedController');

router.post('/', savedController.createSaved);
router.get('/', savedController.getAllSaved);
router.get('/:id', savedController.getSavedById);
router.put('/:id', savedController.updateSavedById);
router.delete('/:id', savedController.deleteSavedById);

module.exports = router;
