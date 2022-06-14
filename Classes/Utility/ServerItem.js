const uuid = require('uuid');

module.exports = class ServerItem {
    constructor() {
        this.uuid = uuid.v4();
        this.position = new Vector2();
        this.name = "Server Item";
    }
}