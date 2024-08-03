
const connection = require('../models/db');
const bcrypt = require('bcrypt');

module.exports.register = (req, res) => {
    const { user, email, password } = req.body; 

    // Verificar si el nombre de usuario ya existe
    const checkUserQuery = 'SELECT * FROM users WHERE username = ?';

    connection.query(checkUserQuery, [user], (error, results) => {
        if (error) {
            console.error('Error al verificar el nombre de usuario', error);
            return res.status(500).json({ message: 'Error al verificar el nombre de usuario' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'El nombre de usuario ya existe' });
        }

        // Número de rondas para generar la sal
        const saltRounds = 10;

        // Hashear la contraseña antes de insertarla 
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.error('Error al hashear la contraseña', err);
                return res.status(500).json({ message: 'Error al hashear la contraseña' });
            }

            const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?,?,?)';

            connection.query(insertQuery, [user, email, hash], (error, results) => {
                if (error) {
                    console.error('Error al registrar usuario', error);
                    return res.status(400).json({ message: 'Error al registrar usuario' });
                }
                res.status(201).json({ message: 'Usuario registrado' });
            });
        });
    });
};
