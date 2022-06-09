const uuid = require('uuid');
const serverItem = require('../Utility/ServerItem');
const Vector2 = require('../Vector2');
const Connection = require('../Connection')
module.exports = class LobbyBase {
    constructor () {
        this.connections = [];
        this.severItems = [];
        this.id = uuid.v4();
    }

    onEnterLobby(connection = Connection) {
        console.log("This player "+ connection.player.displayPlayerInfor()+ " has entered lobby "+ this.id);
        connection.player = this.id;
        connection.lobby = this;
        lobby.connections.push(connection);

    }

    onLeaveLobby(connection = Connection) {
        console.log("This player "+ connection.player.displayPlayerInfor()+ " has leaved lobby "+ this.id);
        connection.player = null;
        connection.lobby = null;
        const currentIndex = this.connections.indexOf(connection);
        this.connections.splice(currentIndex, 1);
    }
    onServerSpawn(item = serverItem, location = Vector2) {
        item.position = location;
        this.severItems.push(item);
        for (let connection of this.connections) {
            connection.socket.emit('onServerSpawn',item)
        }
    }
    onServerUnspawn(item = serverItem) {
        let index = this.severItems.indexOf(item);
        this.severItems.splice(index,1);
        for (let connection of this.connections) {
            connection.socket.emit('onServerUnSpawn', {id : item.id})
        }
    }
}