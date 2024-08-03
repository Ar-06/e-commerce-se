const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 3000;

// Configuración de Mongoose
mongoose.connect('mongodb://localhost:27017/messages')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(err => {
        console.error('Error connecting to MongoDB:', err);
    });

const Message = mongoose.model('Message', new mongoose.Schema({
    userName: String,
    message: String,
    room: String,
    timestamp: { type: Date, default: Date.now }
}),'chat');


const app = express();
const server = http.createServer(app);

const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use(cors({
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
}));

app.use(morgan('dev'));

const routes = require('./api/endPoint');
app.use('/', routes);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Manejo de conexión del admin
    socket.on('adminConnect', () => {
        // Admin se une a un room especial para recibir todos los mensajes
        socket.join('admin');
        console.log('Admin connected and joined admin room');
    });

    // Manejo de conexión de usuarios
    socket.on('joinAdminRoom', () => {
        socket.join('admin');
        console.log('User joined admin room');
    });

    // Manejo de mensajes
    socket.on('message', (data) => {
        const token = data.token;
        const message = data.message;

        jwt.verify(token, 'Stack', (err, decoded) => {
            if (err) {
                return socket.emit('message', { message: 'Token inválido', userName: 'System' });
            }

            const userName = decoded.user;
            const room = 'admin';

            // Guarda el mensaje en la base de datos
            const newMessage = new Message({ userName, message, room });
            newMessage.save()
                .then(() => {
                    // Envía el mensaje al room del admin
                    io.to(room).emit('message', { message, userName });
                })
                .catch(err => {
                    console.error('Error saving message:', err);
                });
        });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
