//ws://127.0.0.1:4567/socket.io/?EIO=3&transport=websocket
//ws://tankgame1.herokuapp.com:80/socket.io/?EIO=3&transport=websocket
const io = require('socket.io')(process.env.PORT || 4567);
const Server = require('./Classes/Server')
const Connection = require('./Classes/Connection');
console.log("Server started");

if(process.env.PORT === undefined ) {
    console.log("Local server");
} else {
    console.log("Hosted server");
}

let server = new Server(process.env.PORT == undefined );

setInterval(() => {
    server.onUpdate();
}, 100);

io.on("connection", async(socket) => {
    let connection = server.onConnect(socket);
    connection.createEvent();
    connection.socket.emit("register", {id : connection.player.id});
})