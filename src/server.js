const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
    socket.on('connectRoom', version => {
        socket.join(version);
    });
});


mongoose.connect('mongodb+srv://omnistack:omnistack@cluster0-8z5ce.mongodb.net/simple-crud?retryWrites=true', {
    useNewUrlParser: true,
});

// mongoose.connect('mongodb://localhost/sej-software-updater', {
//     useNewUrlParser: true,
// });

app.use((req, res, next) => {
    req.io = io;

    return next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(require('./routes'));

server.listen(process.env.PORT || 3333, () => {
    console.log('SimpleCrud Running');
});