const io = require('socket.io')(process.env.PORT || 4567);

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

io.on("connection", (socket) => {
    let connection = new Connection(socket);
    connection.createEvent();
    connection.emit("register", {id : connection.player.id});
})