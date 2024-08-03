const connection = require('../models/db');

module.exports.getProducts = (req, res) => {
    const query = 'SELECT * FROM products';

    connection.query(query, (error, results) => {
        if(error){
            console.log('Error al obtener productos', error);
            return res.status(400).json({message: 'Error al obtener productos'});
        }

        res.status(200).json(results); // Enviar los resultados directamente
    });
};
