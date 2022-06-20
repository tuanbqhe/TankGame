const Vector2 = require("./Vector2");
const ServerObject = require("./ServerObject");
module.exports = class Potion extends ServerObject {
    constructor(){
        super();
        this.reHealTime = 0;
        this.healSpeed = 1000;
        this.canHeal = true;
        this.health = 100;
        this.isDead = false;
        this.reSpawnTicket  = 0;
    }


    dealDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.isDead = true;    
            this.canHeal = false;
            // this.position = new Vector2(this.random2Numeric(-3,1),this.random2Numeric(-8,8));
            this.health = new Number(100);
            
        }
        console.log("Health is: "+ this.health);
    }
    reSpawn() {
        this.reHealTime += 1;
        if(this.reHealTime >= 10) {
            console.log("D1");
            this.reSpawnTicket += 1;
            if(this.reSpawnTicket >=3){console.log("D2");
                this.canHeal = true;
                this.reHealTime = new Number(0);
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
}