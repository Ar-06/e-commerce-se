const connection = require('../models/db');
const jwt = require('jsonwebtoken');


module.exports.updateProduct = (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, 'Stack', (err, decoded) => {
        if(err) {
            return res.status(401).json({message: 'Token inválido'});
        }

        const userId = decoded.userId;
        const productId = req.params.id;
        const image = req.file.filename;

        const {name, description, category, price, stock} = req.body;

        const query = 'UPDATE products SET name = ?, description = ?, category = ?, price = ?, stock = ?, image = ? WHERE user_id = ? AND id = ?';

        connection.query(query, [name, description, category, price, stock, image, userId, productId], (error, results) => {
            if(error){
                console.error('Error al actualizar producto', error);
                return res.status(400).json({message: 'Error al actualizar producto'});
            }
            res.status(200).json({message: 'Producto actualizado'});
        })
        
    })
}