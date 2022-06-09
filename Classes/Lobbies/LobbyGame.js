const gameLobbySettings = require('./gameLobbySettings')
const LobbyState = require('../Utility/lobbyState')
const Connection = require('../Connection')
const Vector2 = require('../Vector2.js')
const Bullet = require('../Bullet.js')
module.exports = class LobbyGame extends LobbyBase {
    constructor(settings = gameLobbySettings) {
        super();
        this.settings = settings;
        this.lobbyState = new LobbyState();
        this.bullets = [];
        this.endGameLobby = () => {};
    }

    onUpdate() {
        this.updateBullets();
        this.updateDeadPlayers();
        if(this.connections.length = 0) {
            this.endGameLobby();
        }
    }

    canEnterLobby(connection = Connection) {
        if(this.connections.length < this.settings.maxPlayers) {
            console.log("We have enough players, We can start game");
            return true;
        }
        return false;
    }
    
    onEnterLobby(connection = Connection) {
        super.onEnterLobby(connection);
        this.spawnAllPlayersIntoGame();
    }

    onLeaveLobby(connection = Connection) {
        super.onLeaveLobby(connection);
        if(this.connections.length < this.settings.minPlayers){
            for(let otherConnection in this.connections){
                connection.server.onSwitchLobby(otherConnection, connection.server.generalServerId)
            }
        }
    }
    spawnAllPlayersIntoGame(connection = Connection) {
        for(let connection of this.connections) {
            this.addPlayer(connection);
        }
    }
    addPlayer(connection = Connection) {
        
        connection.player.position = new Vector2(this.randomRange(-3,3),this.randomRange(-8,8));
        connection.socket.emit("spawn", connection.player);
        connection.socket.broadcast.to("spawn", connection.player);
        for(let connectionOther of this.connections) {
            if(connection.player.id != other.player.id)
            connection.socket.emit("spawn", connectionOther.player);
        }
    }
    removePlayer(connection = Connection) {
        ortherConnection.socket.broadcast.to(this.id).emit("disconnected", connection.player);
        
    }
    updateBullets() {
        for(let bullet of this.bullets) {
            let isDestroyed = bullet.onUpdate();
            if(isDestroyed) {
                this.despawnBullet(bullet);
            }
        }
    }
    despawnBullet(bullet = Bullet) {
        const index = this.bullets.indexOf(bullet);
        this.bullets.splice(index, 1);
        for(let connection of this.connections) {
            connection.socket.emit('serverUnspawn', bullet);
        }
    }
    updateDeadPlayers() {

        for(let connection of this.connections) {
            let player = connection.player
            if(player.isDead) {
               if (!player.reSpawn()){
                   console.log( player + " is dead");
                   connection.socket.emit("reSpawn", player);
                   connection.socket.broadcast.to(this.id).emit("reSpawn", players[player]);
               };
            }
        }
    }
    onFireBullet(connection, data) {
        const bullet = new cullet();
        const socket = connection.socket;
        bullet.name = "Bullet";
        bullet.activatorId = data.activatorId;
        bullet.position = new Vector2(data['position']['x'], data['position']['y']);
        bullet.direction = new Vector2(data['direction']['x'], data['direction']['y']);
        this.bullets.push(bullet);
        socket.broadcast.to(this.id).emit("serverSpawn", bullet);
        socket.emit("serverSpawn", bullet);
    }
    onCollisionDestroy(connection, data) {

        let bulletId = data['objectId'];
        let targetId = data['targetId'];
        
        for( let otherConnection of this.connections) {
            let player = otherConnection.player;

            if(player.id == targetId) {
                player.dealDamage(50);
                if(player.isDead) {
                    console.log("player ("+ player.id + ") has died");
                    connection.socket.emit("died", player);
                    connection.socket.broadcast.to(this.id).emit("died", player);
                }
            }
        }
        
        for (let bullet of this.bullets) {
            if (bullet.id == bulletId) {
                bullet.isDestroyed = true;
            }
        }
    }
}

