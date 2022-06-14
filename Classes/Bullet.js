const uuid = require('uuid');
const vector2 = require('./Vector2');
const ServerObject = require('./ServerObject');

module.exports = class Bullet extends ServerObject {
    constructor (){
        super();
        this.direction = new vector2();
        this.activatorId = "";
        this.speed = 0.5;
        this.isDestroyed = false;
    }
    onUpdate() {
        this.position.x += this.direction.x * this.speed;
        this.position.y += this.direction.y * this.speed;
        return this.isDestroyed;
    }
}