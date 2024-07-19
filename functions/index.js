const functions = require("firebase-functions");
const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors({ origin: true }));

const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const specieRoutes = require('./routes/specieRoutes');
const animalRoutes = require('./routes/animalRoutes');
const savedRoutes = require('./routes/savedRoutes');

app.use(express.json());
app.use(bodyParser.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/species', specieRoutes);
app.use('/api/v1/animals', animalRoutes);
app.use('/api/v1/saved', savedRoutes);

exports.app = functions.https.onRequest(app);