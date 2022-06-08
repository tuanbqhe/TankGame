module.exports = class Server {
    constructor( isLocal = false){
        this.database = new Database();
        this.lobbys = [];
        let sever = this;
        this.connections = [];

        this.generalServerId = "General id sever";
        this.startLobby = new LobbyBase();
        this.startLobby.id = this.generalServerId;
        this.lobbys[this.startLobby.id] = this.startLobby;
    }

    onUpdate() {
        for(let i in lobbys){
            server.lobbys[i].onUpdate();
        }
    }

    onConnect(socket) {
        let connection = new Connection();
        connection.player = new Player();
        connection.socket = socket;
        connection.player.lobby = this.startLobby.id;
        connection.lobby = this.lobbys[this.startLobby];
        connection.server = server;

        socket.join(connection.player.lobby);
        console.log("Add new player to server playerId: " + connection.player.id);
        this.connections[connection.player.id] = connection;
        connection.lobby.onEnterLobby(connection);
        return connection;

    }

    onDisconnected(connection = Connection) {
        const currentIndex = connection.player.id;
        delete this.connections[connection.id];
        console.log("Player "+ connection.player.displayerInformaion()+ "has disconnected");
        connection.socket.broadcast.to(connection.player.lobby).emit("disconnected", {id: currentIndex});
        this.lobbys[currentIndex].onLeaveLobby(connection);

        if(currentIndex != this.generalServerId && this.lobbys[currentIndex] != null && this.lobbys[currentIndex].length == 0) {            
            closeDownLobby(currentIndex);
        }

    }
    closeDownLobby(index) {
        console.log('Closing down lobby (' + currentIndex +')' );
        delete this.lobbys[index];
    }

    onAttemptToJoinGame(connection = Connection) {
        let lobbyFound = false;
        let gameLobbys = [];

        for(let id in this.lobbys) {
            if(lobbys[id] instanceof GameLobbys){
                gameLobbys.push(lobbys[id]);
            }
        }

        console.log("Found "+ gameLobbys.length + " lobbys on the server");

        gameLobbys.forEach(lobby => {
            if(!lobbyFound){
                canJoin = lobby.canJoin();
                if(canJoin) {
                    lobbyFound = true;
                    this.onSwitchLobby(connection , lobby.id)
                }
            }
        })
        if(!lobbyFound) {
            let gameLobby = new GameLobby("FFa", 2,2, data);
            gameLobby.endGameLobby = () => this.closeDownLobby(gameLobby.id);
            gameLobbys[gameLobby.id] = gameLobby;
            this.onSwitchLobby(connection, gameLobby.id);

        }

    }
    
    onSwitchLobby(connection, lobbyId) {
        connection.socket.join(lobbyId);
        connection.lobby = this.lobbys[lobbyId]; 
        lobbys[connection.player.id].onLeaveLobby(connection);
        lobbys[lobbyId].onEnterLobby(connection);

    }




}