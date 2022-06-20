const LobbyBase = require('./Lobbies/LobbyBase')
let GameLobby = require('./Lobbies/LobbyGame')
let Player = require("./Player");
const Connection = require("./Connection");
const GameLobbySettings = require("./Lobbies/GameLobbySettings")
module.exports = class Server {
    constructor( isLocal = false){
        // this.database = new Database(isLocal);
        this.lobbys = [];
        this.connections = [];
        this.generalServerId = "General id sever";
        this.startLobby = new LobbyBase();
        this.startLobby.id = this.generalServerId;
        this.lobbys[this.startLobby.id] = this.startLobby;
    }
    

    onUpdate() {
         for(let id in this.lobbys) {
            if(this.lobbys[id] instanceof GameLobby){
                this.lobbys[id].onUpdate();
            }
         }
    }

    onConnect(socket) {
        let connection = new Connection();
        connection.player = new Player();
        connection.socket = socket;

        connection.player.lobby = this.startLobby.id;
        connection.lobby = this.lobbys[this.startLobby.id]
        connection.server = this;
        socket.join(connection.player.lobby);

        console.log("Add new player to server playerId: " + connection.player.id);
        this.connections[connection.player.id] = connection;
        connection.lobby.onEnterLobby(connection);
        return connection;

    }

    onDisconnected(connection = Connection) {
        const currentIndex = connection.player.lobby;
        delete this.connections[connection.id];
        console.log("Player "+ connection.player.displayPlayerInfor()+ " has disconnected");
        connection.socket.broadcast.to(connection.player.lobby).emit("disconnected", {id: connection.player.id});
        this.lobbys[currentIndex].onLeaveLobby(connection);

        if(currentIndex != this.generalServerId && this.lobbys[currentIndex] != null && this.lobbys[currentIndex].length == 0) {            
            closeDownLobby(currentIndex);
        }

    }
    closeDownLobby(index) {
        console.log('Closing down lobby (' + index +')' );
        delete this.lobbys[index];
    }

    onAttemptToJoinGame(connection = Connection) {
        let lobbyFound = false;
        let gameLobbys = [];
        for(let id in this.lobbys) {
            if(this.lobbys[id] instanceof GameLobby){
                gameLobbys.push(this.lobbys[id]);
            }
        }

        console.log("Found "+ gameLobbys.length + " lobbys on the server");

        gameLobbys.forEach(lobby => {
            if(!lobbyFound){
                let canJoin = lobby.canEnterLobby();
                if(canJoin) {
                    lobbyFound = true;
                    this.onSwitchLobby(connection , lobby.id)
                }
            }
        })
        if(!lobbyFound) {
            let gameLobby = new GameLobby(new GameLobbySettings('FFA', 2, 2, "data"));
            gameLobby.endGameLobby = () => this.closeDownLobby(gameLobby.id);
            this.lobbys[gameLobby.id] = gameLobby;
            this.onSwitchLobby(connection, gameLobby.id);
        }

    }
    
    onSwitchLobby(connection, lobbyId) {
        
        connection.socket.join(lobbyId);
        
        connection.lobby = this.lobbys[lobbyId]; 
        this.lobbys[connection.player.lobby].onLeaveLobby(connection);
        console.log("dd");
        this.lobbys[lobbyId].onEnterLobby(connection);
        
    }




}