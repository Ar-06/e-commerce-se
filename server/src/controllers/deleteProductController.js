const connection = require('../models/db');
const jwt = require('jsonwebtoken');

module.exports.deleteProduct = (req,res) => {

    const token = req.headers.authorization.split(' ')[1];

    jwt.verify(token, 'Stack', (err,decoded) => {
        if(err){
            return res.status(401).json({message: 'Token inválido'});
        }

        const userId = decoded.userId;
        const productId = req.params.id;

        const query = 'DELETE FROM products WHERE user_id = ? AND id = ?';
        connection.query(query, [userId, productId], (error, results) => {
            if(error){
                console.error('Error al eliminar producto', error);
                return res.status(400).json({message: 'Error al eliminar producto'});
            }
            res.status(200).json({message: 'Producto eliminado'});
        })
    })

}