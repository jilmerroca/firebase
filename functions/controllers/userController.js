const bcrypt = require('bcrypt');
const db = require('../config/firebaseConfig');
const User = require('../models/userModel');

exports.getAllUsers = async (req, res) => {
    try {
        const { limit = 10, rol, provider, lastDoc } = req.query;
        let query = db.collection('users');

        if (rol) {
            query = query.where('rol', '==', rol);
        }

        if (provider) {
            query = query.where('providerId', '==', provider);
        }

        query = query.limit(Number(limit));

        if (lastDoc) {
            const lastDocumentRef = db.collection('users').doc(lastDoc);
            const lastDocumentSnapshot = await lastDocumentRef.get();
            if (lastDocumentSnapshot.exists) {
                query = query.startAfter(lastDocumentSnapshot);
            }
        }

        const snapshot = await query.get();
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        const lastVisible = snapshot.docs[snapshot.docs.length - 1];
        const nextLastDoc = lastVisible ? lastVisible.id : null;

        res.status(200).json({ users, lastDoc: nextLastDoc });
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
};


exports.getSingleUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userRef = db.collection('users').doc(userId);
        const doc = await userRef.get();

        if (!doc.exists) {
            res.status(404).send('User not found');
        } else {
            res.status(200).json({ id: doc.id, ...doc.data() });
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.createUser = async (req, res) => {
    try {
        const { fullName, email, password, phone, rol, providerId } = req.body;

        // Verificar si la contraseña está presente y encriptarla
        let hashedPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        // Crear objeto dinámicamente
        const newUser = {
            ...(fullName ? { fullName } : {}),
            ...(email ? { email } : {}),
            ...(hashedPassword ? { password: hashedPassword } : {}),
            ...(phone ? { phone } : {}),
            ...(rol ? { rol } : 'user'),
            ...(providerId ? { providerId } : {})
        };

        // Añadir nuevo documento a Firestore
        const userRef = await db.collection('users').add(newUser);

        res.status(201).json({ id: userRef.id, ...newUser });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).send(error.message);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const { fullName, email, password, phone, rol, providerId } = req.body;

        // Crear objeto de actualización dinámicamente
        const updatedUser = {
            ...(fullName ? { fullName } : {}),
            ...(email ? { email } : {}),
            ...(phone ? { phone } : {}),
            ...(rol ? { rol } : {}),
            ...(providerId ? { providerId } : {})
        };

        // Si hay un nuevo password, encriptarlo y agregarlo al objeto de actualización
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updatedUser.password = hashedPassword;
        }

        // Actualizar el documento en Firestore
        await db.collection('users').doc(userId).update(updatedUser);

        res.status(200).json({ id: userId, ...updatedUser });
    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).send(error.message);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const userRef = db.collection('users').doc(userId);
        await userRef.delete();
        res.status(200).send('User deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !user.validatePassword(password)) {
            return res.status(401).json({ message: 'Email or password incorrect' });
        }

        // Resto del código para manejar la sesión de usuario
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};