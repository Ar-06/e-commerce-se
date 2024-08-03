// loginController.js (Backend)

const connection = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.login = (req, res) => {
    const { user, password } = req.body;

    const query = 'SELECT user_id,username, password FROM users WHERE username = ?';

    try {
        connection.query(query, [user], (error, results) => {
            if (error) {
                console.error('Error al buscar usuario en la base de datos', error);
                return res.status(500).json({ message: 'Error al buscar usuario en la base de datos' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const storedHash = results[0].password; 

            bcrypt.compare(password, storedHash, (err, isMatch) => {
                if (err) {
                    console.error('Error al comparar contraseñas', err);
                    return res.status(500).json({ message: 'Error al comparar contraseñas' });
                }

                if (isMatch) {
                    const { user_id,username } = results[0];

                    
                    const token = jwt.sign({ userId: user_id, user: username }, 'Stack', {
                        expiresIn: '5h' 
                    });

                    res.status(200).json({ message: 'Bienvenido', token: token });
                } else {
                    res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
                }
            });
        });
    } catch (e) {
        console.error('Error en el controlador de login', e);
        res.status(500).json({ message: 'Error en el servidor al procesar la solicitud' });
    }
};
