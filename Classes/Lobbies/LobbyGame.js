const gameLobbySettings = require('./GameLobbySettings')
const LobbyState = require('../Utility/LobbyState')
const Connection = require('../Connection')
const Vector2 = require('../Vector2.js')
const Bullet = require('../Bullet.js')
const LobbyBase = require('./LobbyBase')
const Potion = require('../Potion')
module.exports = class LobbyGame extends LobbyBase {
    constructor(settings = gameLobbySettings) {
        super();
        this.settings = settings;
        this.lobbyState = new LobbyState();
        this.bullets = [];
        this.potions = [];
        this.endGameLobby = () => { };
    }

    onUpdate() {
        this.updateBullets();
        this.updateDeadPlayers();
        if (this.connections.length == 0) {
            this.endGameLobby();
        }
    }

    canEnterLobby(connection = Connection) {
        if (this.connections.length + 1 > this.settings.maxPlayers) {
            return false;
        }
        return true;
    }

    onEnterLobby(connection = Connection) {
        super.onEnterLobby(connection);
        console.log("Current total player: " + this.connections.length);
        // if(this.connections.length == this.settings.maxPlayers){
        console.log("We have enough players, We can start game");
        this.spawnAllPlayersIntoGame();
        this.lobbyState.currentState = this.lobbyState.GAME;
        // }
        const returnData = { state: this.lobbyState.currentState }
        connection.socket.emit("loadScene");
        console.log(returnData);
        connection.socket.emit("updateScene", returnData);
        connection.socket.broadcast.to(this.id).emit("updateScene", returnData);
        const potion = new Potion();
        potion.name = "Hp_Potion";
        potion.position = new Vector2(-1,0);
        this.potions[potion.id] = potion;
        connection.socket.emit("serverSpawn", potion);
        console.log("Potion spawned");
        connection.socket.broadcast.to(this.id).emit("serverSpawn", potion);
    }

    onLeaveLobby(connection = Connection) {
        super.onLeaveLobby(connection);
        // if(this.connections.length < this.settings.minPlayers){
        // for(let otherConnection in this.connections){
        // connection.server.onSwitchLobby(otherConnection, connection.server.generalServerId)
        // }
        // }
    }
    spawnAllPlayersIntoGame() {
        for (let otherConnection of this.connections) {
            this.addPlayer(otherConnection);
        }

    }
    addPlayer(connection = Connection) {
        console.log("+++++++++++++++++++++=");
        connection.player.position = new Vector2(this.randomRange(0, 2), this.randomRange(0, 2));
        connection.socket.emit("spawn", connection.player);
        // connection.socket.broadcast.to(this.id).emit("spawn", connection.player);
        for (let connectionOther of this.connections) {
            if (connection.player.id != connectionOther.player.id)
                connection.socket.emit("spawn", connectionOther.player);
        }

    }
    removePlayer(connection = Connection) {
        ortherConnection.socket.broadcast.to(this.id).emit("disconnected", connection.player);

    }
    updateBullets() {
        // for(let bullet of this.bullets) {
        //     let isDestroyed = bullet.onUpdate();
        //     if(isDestroyed) {
        //         this.despawnBullet(bullet);
        //     } else {
        // this.connections.forEach(connection => { 
        //     connection.socket.emit('updatePosition', bullet);
        // });
        //     }

        // }
    }
    despawnBullet(bullet = Bullet) {
        const index = this.bullets.indexOf(bullet);
        this.bullets.splice(index, 1);
        ////sadf
        for (let connection of this.connections) {
            connection.socket.emit('serverUnSpawn', bullet);
        }
    }
    updateDeadPlayers() {

        for (let connection of this.connections) {
            let player = connection.player
            if (player.isDead) {
                if (!player.reSpawn()) {
                    console.log(player + " is dead");
                    connection.socket.emit("reSpawn", player);
                    connection.socket.broadcast.to(this.id).emit("reSpawn", player);
                };
            }
        }
        for (let potion in this.potions) {
            if (!this.potions[potion].canHeal) { 
                if (!this.potions[potion].reSpawn()) {
                    for(let connection of this.connections){
                        connection.socket.emit("reSpawn", this.potions[potion]);
                        connection.socket.broadcast.to(this.id).emit("reSpawn", this.potions[potion]);
                    }
                };

            }
        }
    }
    onFireBullet(connection, data) {
        const bullet = new Bullet();
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
        let activatorId = data['activatorId'];
        if (activatorId != connection.player.id) return;
        if (connection.player == activatorId)
            for (let otherConnection of this.connections) {
                let player = otherConnection.player;
                if (player.id == targetId) {
                    player.dealDamage(50);
                    if (player.isDead) {
                        console.log("player (" + player.id + ") has died");
                        connection.socket.emit("died", player);
                        connection.socket.broadcast.to(this.id).emit("died", player);
                    }
                }
            }
        if (this.potions[targetId]) {
            let potion = this.potions[targetId]
            potion.dealDamage(50);
            if (!potion.canHeal) {
                connection.socket.emit("died", potion);
                connection.socket.broadcast.to(this.id).emit("died", potion);
            }

        }


        for (let bullet of this.bullets) {
            if (bullet.id == bulletId) {
                this.despawnBullet(bullet);
                bullet.isDestroyed = true;

            }
        }

    }
    randomRange(min, max) {
        return Math.round((max - min) * Math.random()) + min;
    }
    HpHeal(connection = Connection, potionId) {
        const lobby = this;
        
        if (!this.potions[potionId].canHeal || connection.player.health === 100) return;
        this.potions[potionId].canHeal = false;
        const player = connection.player;
        connection.socket.emit("HpHeal", player.id);
        connection.socket.broadcast.to(this.id).emit("HpHeal", player.id);
        const healing = setInterval(() => {
            player.healHp(5);
            connection.socket.emit("HpHealing", player);
            connection.socket.broadcast.to(this.id).emit("HpHealing", player);
            if (player.health >= 100) {
                clearInterval(healing);
                connection.socket.emit("HpStopHeal", connection.player.id);
                connection.socket.broadcast.to(this.id).emit("HpStopHeal", connection.player.id);

            }
        }, this.potions[potionId].healSpeed);

        // if( this.potions[potionId].reHeal()){
        // setTimeout(function () {
        //     connection.socket.emit("displayPotion", potionId);
        //     connection.socket.broadcast.to(this.id).emit("displayPotion", potionId);
        //     lobby.potions[potionId].canHeal = true;
        //     return true;

        // }, 2000)
        // }


    }


}

