const connection = require('../models/db');


module.exports.ping = (req, res) => {
    const query = 'SELECT * FROM users';

    try{
        
        connection.query(query, (error, results) => {
            res.json({
                data: results
            })
        });

    } catch (error) {
        console.log(error);
    }
}