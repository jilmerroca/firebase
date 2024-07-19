const db = require('../config/firebaseConfig');
const Saved = require('../models/savedModel');

// Crear una entrada en "saved"
exports.createSaved = async (req, res) => {
    try {
        const { animalId, userId } = req.body;

        // Verificar si ambos campos obligatorios están presentes
        if (!animalId || !userId) {
            return res.status(400).json({ error: 'AnimalId and userId are required.' });
        }

        // Crear objeto dinámicamente
        const newSaved = {
            animalId: db.collection('animals').doc(animalId),
            userId: db.collection('users').doc(userId)
        };

        // Añadir nuevo documento a Firestore
        const savedRef = await db.collection('saved').add(newSaved);

        res.status(201).json({ id: savedRef.id, ...newSaved });
    } catch (error) {
        console.error("Error creating saved:", error);
        res.status(500).send(error.message);
    }
};

// Obtener todas las entradas en "saved" con paginación
exports.getAllSaved = async (req, res) => {
    try {
        const { limit = 10, user, lastDoc } = req.query;
        let query = db.collection('saved');

        if (user) {
            const userRef = db.collection('users').doc(user);
            query = query.where('userId', '==', userRef);
        }

        query = query.limit(Number(limit));

        if (lastDoc) {
            const lastDocumentRef = db.collection('saved').doc(lastDoc);
            query = query.startAfter(lastDocumentRef);
        }

        const savedSnapshot = await query.get();
        const saved = savedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(saved);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

// Obtener una entrada en "saved" por ID
exports.getSavedById = async (req, res) => {
    try {
        const savedId = req.params.id;
        const savedDoc = await db.collection('saved').doc(savedId).get();

        if (!savedDoc.exists) {
            return res.status(404).json({ message: 'Saved item not found' });
        }

        res.status(200).json({ id: savedDoc.id, ...savedDoc.data() });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Actualizar una entrada en "saved" por ID
exports.updateSavedById = async (req, res) => {
    try {
        const savedId = req.params.id;
        const { animalId, userId } = req.body;

        // Crear objeto de actualización dinámicamente
        const updatedSaved = {
            ...(animalId ? { animalId: db.collection('animals').doc(animalId) } : {}),
            ...(userId ? { userId: db.collection('users').doc(userId) } : {})
        };

        await db.collection('saved').doc(savedId).update(updatedSaved);

        res.status(200).json({ id: savedId, ...updatedSaved });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// Eliminar una entrada en "saved" por ID
exports.deleteSavedById = async (req, res) => {
    try {
        const savedId = req.params.id;
        await db.collection('saved').doc(savedId).delete();

        res.status(204).send();
    } catch (error) {
        res.status(500).send(error.message);
    }
};
