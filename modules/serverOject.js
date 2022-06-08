const uuid = require('uuid');
const vector2 = require('./Vector2');
module.exports = class serverOject {
    constructor() {
        this.id = uuid.v4();
        this.name = "Server Object";
        this.position = new vector2();
    }
}