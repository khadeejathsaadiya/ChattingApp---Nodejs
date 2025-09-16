//Node server which will handle socket io connections
const cors = require('cors');               // Import CORS
const io = require('socket.io')(8009, {
    cors: {
        origin: "http://127.0.0.1:5500",    // Allow requests from this origin
        methods: ["GET", "POST"]             // Allow these methods
    }
});
//const io = require('socket.io')(8009)

const users = {};
 
io.on('connection', socket =>{
    //If any new user joins, let other users connected to the server know!
    socket.on('new-user-joined', name =>{
        console.log("New user", name);
        users[socket.id] =name;
        //console.log(`${name} joined`);
        socket.broadcast.emit('user-joined', name);
    })

    //If someone sends a message, broadcast it to other people
    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
    })

    //If someone leaves the chat, let others know  && disconnect is the built-in method of socketio.
    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    })
})

