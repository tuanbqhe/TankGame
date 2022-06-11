const uuid = require('uuid');
const Vector2 = require('./Vector2');
module.exports = class Player {
    constructor() {
        this.id = uuid.v4();
        this.name = "";
        this.position = new Vector2();
        this.tankRotation = new Number(0);
        this.barrelRotation = new Number(0);
        this.reSpawnTime = new Number(0);
        this.reSpawnTicket = new Number(0);
        this.isDead = false;
        this.health = new Number(100);
    }

    dealDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.isDead = true;    
            this.position = new Vector2(this.random2Numeric(-3,3),this.random2Numeric(-8,8));
            this.health = new Number(10);
            
        }
        console.log("Health is: "+ this.health);
    }
    reSpawn() {
        this.reSpawnTime += 1;
        if(this.reSpawnTime >= 10) {
            this.reSpawnTicket += 1;
            if(this.reSpawnTicket >=3){
                this.reSpawnTime = new Number(0);
                this.reSpawnTicket = new Number(0);
                this.isDead = false;
                return this.isDead ;
            }
        }
        return true;
    }
    random2Numeric(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }
    displayPlayerInfor(){
      return ("("+ this.id+") with health :"+ this.health);
    }

}