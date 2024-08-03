const connection = require('../models/db');
const jwt = require('jsonwebtoken');

module.exports.getProductById = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, 'Stack', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const userId = decoded.userId;
        const productId = req.params.id;

        const query = 'SELECT * FROM products WHERE id = ? AND user_id = ?';

        connection.query(query, [productId, userId], (error, results) => {
            if (error) {
                console.error('Error al obtener producto', error);
                return res.status(400).json({ message: 'Error al obtener producto' });
            }

            if (results.length === 0) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }

            res.status(200).json({ products: results[0] });
        });
    });
};
