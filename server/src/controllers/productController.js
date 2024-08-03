const connection = require('../models/db');
const jwt = require('jsonwebtoken'); 

module.exports.product = (req, res) => {
    const { name, description, category, price, stock } = req.body;

    if (!req.file) {
        return res.status(400).json({ message: 'Falta la imagen del producto' });
    }

    const image = req.file.filename;

    // Extraer token del encabezado de autorización
    const token = req.headers.authorization.split(" ")[1];

    // Verificar y decodificar el token
    jwt.verify(token, 'Stack', (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token inválido' });
        }

        const userId = decoded.userId;

        const query = 'INSERT INTO products (name, description, category, price, stock, image, user_id) VALUES (?,?,?,?,?,?,?)';

        connection.query(query, [name, description, category, price, stock, image, userId], (error, results) => {
            if (error) {
                console.error('Error al agregar producto', error);
                return res.status(400).json({ message: 'Error al agregar producto' });
            }
            res.status(201).json({ message: 'Producto agregado' });
        });
    });
}
