const db = require('../config/firebaseConfig');
const Specie = require('../models/specieModel');

exports.getAllSpecies = async (req, res) => {
    try {
        const { limit = 10, lastDoc } = req.query;
        const speciesRef = db.collection('species');
        let query = speciesRef.limit(Number(limit));

        if (lastDoc) {
            const lastDocumentRef = db.collection('species').doc(lastDoc);
            query = query.startAfter(lastDocumentRef);
        }

        const snapshot = await query.get();
        const species = [];
        snapshot.forEach(doc => {
            species.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(species);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};


exports.getSingleSpecie = async (req, res) => {
    try {
        const specieName = req.params.name;

        // Obtener especie por nombre en minúsculas
        const specieRef = db.collection('species').doc(specieName.toLowerCase());
        const specieDoc = await specieRef.get();

        if (!specieDoc.exists) {
            return res.status(404).json({ error: 'Specie not found.' });
        }

        const specieData = specieDoc.data();

        res.status(200).json({ id: specieDoc.id, ...specieData });
    } catch (error) {
        console.error("Error getting specie:", error);
        res.status(500).send(error.message);
    }
};

exports.createSpecie = async (req, res) => {
    try {
        const { name, breeds, genders, colors } = req.body;

        // Verificar campos obligatorios
        if (!name) {
            return res.status(400).json({ error: 'Name is required.' });
        }

        // Verificar si ya existe una especie con el mismo nombre (en minúsculas)
        const specieRef = db.collection('species').doc(name.toLowerCase());
        const existingSpecie = await specieRef.get();

        if (existingSpecie.exists) {
            return res.status(400).json({ error: 'Species with this name already exists.' });
        }

        // Crear objeto de especie
        const newSpecie = {
            name,
            breeds: breeds || [],
            genders: genders || [],
            colors: colors || []
        };

        // Añadir nueva especie a Firestore usando el nombre en minúsculas como ID
        await specieRef.set(newSpecie);

        res.status(201).json({ message: 'Specie created successfully.', ...newSpecie });
    } catch (error) {
        console.error("Error creating specie:", error);
        res.status(500).send(error.message);
    }
};

exports.updateSpecie = async (req, res) => {
    try {
        const specieName = req.params.name;
        const { name, breeds, genders, colors } = req.body;

        // Crear objeto de actualización dinámicamente
        const updatedSpecie = {
            ...(name ? { name } : {}),
            ...(breeds ? { breeds } : {}),
            ...(genders ? { genders } : {}),
            ...(colors ? { colors } : {})
        };

        // Actualizar el documento en Firestore
        await db.collection('species').doc(specieName.toLowerCase()).update(updatedSpecie);

        res.status(200).json({ id: specieName.toLowerCase(), ...updatedSpecie });
    } catch (error) {
        console.error("Error updating specie:", error);
        res.status(500).send(error.message);
    }
};

exports.deleteSpecie = async (req, res) => {
    try {
        const specieName = req.params.name;
        const specieRef = db.collection('species').doc(specieName.toLowerCase());
        await specieRef.delete();
        res.status(200).send('Specie deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
