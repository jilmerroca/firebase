const db = require('../config/firebaseConfig');
const Animal = require('../models/animalModel');

exports.getAllAnimals = async (req, res) => {
    try {
        const { limit = 10, specie, status, gender, areaLastSeen, dateStart, dateEnd, reward, user, lastDoc } = req.query;
        const animalsRef = db.collection('animals');
        let query = animalsRef;

        // Función para manejar parámetros de consulta que pueden ser simples o arrays
        function parseQueryArray(param) {
            if (typeof param === 'string' && param.includes(',')) {
                return param.split(',').map(item => item.trim());
            } else if (Array.isArray(param)) {
                return param.map(item => item);
            } else {
                return [param];
            }
        }

        // Filtrado por specie
        if (specie) {
            const specieArray = parseQueryArray(specie);
            const specieRefs = specieArray.map(specie => db.collection('species').doc(specie));
            query = query.where('specie', 'in', specieRefs);
        }

        // Filtrado por user
        if (user) {
            const userRef = db.collection('users').doc(user);
            query = query.where('userId', '==', userRef);
        }

        // Filtrado por status
        if (status) {
            const statusArray = parseQueryArray(status);
            query = query.where('status', 'in', statusArray);
        }

        // Filtrado por gender
        if (gender) {
            const genderArray = parseQueryArray(gender);
            query = query.where('gender', 'in', genderArray);
        }

        // Filtrado por área donde se vio por última vez
        if (areaLastSeen) {
            query = query.where('areaLastSeen', '==', areaLastSeen);
        }

        // Filtrado por recompensa
        if (reward) {
            query = query.where('reward', '>=', Number(reward));
        }

        // Filtrado por rango de fechas
        if (dateStart && dateEnd) {
            const start = new Date(dateStart);
            const end = new Date(dateEnd);
            query = query.where('dateLastSeen', '>=', start)
                .where('dateLastSeen', '<=', end);
        }

        query = query.orderBy('dateLastSeen', 'desc').limit(Number(limit));

        if (lastDoc) {
            const lastDocumentSnapshot = await db.collection('animals').doc(lastDoc).get();
            if (lastDocumentSnapshot.exists) {
                query = query.startAfter(lastDocumentSnapshot);
            } else {
                return res.status(400).json({ message: 'Invalid lastDoc ID' });
            }
        }

        const animalsSnapshot = await query.get();
        const animals = [];
        animalsSnapshot.forEach(doc => {
            animals.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(animals);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};

exports.getSingleAnimal = async (req, res) => {
    try {
        const animalId = req.params.id;
        const animalDoc = await db.collection('animals').doc(animalId).get();

        if (!animalDoc.exists) {
            return res.status(404).json({ message: 'Animal not found' });
        }

        const animal = animalDoc.data();

        // Obtener el documento de especie referenciado
        const specieDoc = await animal.specie.get();

        if (!specieDoc.exists) {
            return res.status(404).json({ message: 'Specie not found' });
        }

        const specie = specieDoc.data();

        // Obtener el documento de usuario referenciado
        const userDoc = await animal.userId.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = userDoc.data();

        res.status(200).json({ ...animal, specie, user });
    } catch (error) {
        res.status(500).send(error.message);
    }

};

exports.createAnimal = async (req, res) => {
    try {
        const {
            name = 'Unknown',
            status,
            gender,
            age,
            breed,
            color,
            size,
            reward,
            haveCollar,
            health,
            dateLastSeen,
            areaLastSeen,
            crossStreet,
            nearestLandmark,
            ddLat,
            ddLon,
            description,
            photos,
            specie,
            userId
        } = req.body;

        // Verificar campos obligatorios
        if (!status || !specie || !userId) {
            return res.status(400).json({ error: 'Status, specie, and userId are required.' });
        }

        // Convertir dateLastSeen a Timestamp si está presente
        let dateLastSeenTimestamp = null;
        if (dateLastSeen) {
            dateLastSeenTimestamp = (new Date(dateLastSeen));
        }

        // Crear objeto dinámicamente
        const newAnimal = {
            name,
            status,
            gender,
            age,
            breed: breed || '',
            color: color || '',
            size: size || '',
            reward: reward || 0,
            haveCollar: haveCollar || false,
            health: health || '',
            dateLastSeen: dateLastSeenTimestamp,
            areaLastSeen: areaLastSeen || '',
            crossStreet: crossStreet || '',
            nearestLandmark: nearestLandmark || '',
            ddLat: ddLat || 0,
            ddLon: ddLon || 0,
            description: description || '',
            photos: photos || '',
            specie: db.collection('species').doc(specie.toLowerCase()),
            userId: db.collection('users').doc(userId)
        };

        // Añadir nuevo documento a Firestore
        const animalRef = await db.collection('animals').add(newAnimal);

        res.status(201).json({ id: animalRef.id, ...newAnimal });
    } catch (error) {
        console.error("Error creating animal:", error);
        res.status(500).send(error.message);
    }
};


exports.updateAnimal = async (req, res) => {
    
    try {
        const animalId = req.params.id;

        const {
            name,
            status,
            gender,
            age,
            breed,
            color,
            size,
            reward,
            haveCollar,
            health,
            dateLastSeen,
            areaLastSeen,
            crossStreet,
            nearestLandmark,
            ddLat,
            ddLon,
            description,
            photos,
            specie,
            userId
        } = req.body;

        let dateLS = new Date(dateLastSeen);

        // Crear objeto para actualizar dinámicamente
        const updatedAnimal = {
            ...(name && { name }),
            ...(status && { status }),
            ...(gender && { gender }),
            ...(age !== undefined && { age }),
            ...(breed && { breed }),
            ...(color && { color }),
            ...(size && { size }),
            ...(reward !== undefined && { reward }),
            ...(haveCollar !== undefined && { haveCollar }),
            ...(health && { health }),
            ...(dateLastSeen && { dateLastSeen: (new Date(dateLastSeen)) }),
            ...(areaLastSeen && { areaLastSeen }),
            ...(crossStreet && { crossStreet }),
            ...(nearestLandmark && { nearestLandmark }),
            ...(ddLat !== undefined && { ddLat }),
            ...(ddLon !== undefined && { ddLon }),
            ...(description && { description }),
            ...(photos && { photos }),
            ...(specie && { specie: db.collection('species').doc(specie.toLowerCase()) }), // referencia a especie
            ...(userId && { userId: db.collection('users').doc(userId) }) // referencia a usuario
        };

        // Actualizar el documento en Firestore
        await db.collection('animals').doc(animalId).update(updatedAnimal);

        res.status(200).json({ id: animalId, ...updatedAnimal });
    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.deleteAnimal = async (req, res) => {
    try {
        const animalId = req.params.id;
        const animalRef = db.collection('animals').doc(animalId);
        await animalRef.delete();
        res.status(200).send('Animal deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};