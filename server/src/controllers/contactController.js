const connection = require('../models/db');

module.exports.contact = (req, res) => {
    const {name, email, message} = req.body;

    const query = 'INSERT INTO contact (name, email, message) VALUES (?,?,?)';

    connection.query(query, [name, email, message], (error, results) => {
        if(error) {
            res.status(400).json({message: 'Error al enviar el mensaje'});
        } 
        res.status(200).json({message: 'Mensaje enviado correctamente'});
    })
}