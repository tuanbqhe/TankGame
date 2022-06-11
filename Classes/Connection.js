module.exports = class Connection {
    constructor() {
        this.player;
        this.lobby;
        this.server;
        this.socket;
    }

    createEvent() {
        let connection = this;
        let socket = this.socket;
        let server = this.server;
        let player = this.player;
        socket.on('disconnect', () => {
            server.onDisconnected(connection);
        });
        // socket.on('createAcccount', (data) => {
            // server.data.createAcccount(data.username, data.password, result => {
                // console.log(result.valid + " with reason: " + result.reason)
            // })
        // });
        // socket.on('signIn', (data) => {
            //   sever.data.signIn(data.username, data.password, result => {
                //   console.log(result.valid + " with reason: " + result.reason);
                //   if(result.valid){
                    //   socket.emit('signIn');
                //   }
            //   })
        // })
        socket.on('joinGame', () => {
            server.onAttemptToJoinGame(connection);
        })
        socket.on('fireBullet', (data) => {
            this.lobby.onFireBullet(connection, data);
        })
        socket.on('collisionDestroy', (data) => {
            this.lobby.onCollisionDestroy(connection, data);
        })
        socket.on('updatePosition', (data) => {
            player.position.x = data.position.x;
            player.position.y = data.position.y;
            socket.broadcast.to(player.lobby).emit('updatePosition', player);
        })
        socket.on("updateRotation", (data) => {
            
            player.tankRotation = data.tankRotation;
            player.barrelRotation = data.barrelRotation;
            socket.broadcast.to(player.lobby).emit('updateRotation', player);
        })
        socket.on('quitGame', () => {
            server.onSwitchLobby(connection, sever.generalID);
        })
    }

}