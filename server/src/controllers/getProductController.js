const connection = require('../models/db');
const jwt = require('jsonwebtoken');

module.exports.getProductsByUser = (req, res) => {

    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, 'Stack', (err, decoded) => {
        if(err) {
            return res.status(401).json({message: 'Token inválido'});
        }

        const userId = decoded.userId;

        const query = 'SELECT * FROM products WHERE user_id = ?';

        connection.query(query, [userId], (error, results) => {
            if(error) {
                console.error('Error al obtener productos', error);
                return res.status(400).json({message: 'Error al obtener productos'});
            }

            res.status(200).json({products: results});
        })
    })

}