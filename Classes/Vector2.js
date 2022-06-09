module.exports = class Vect{
    constructor(X = 0, Y = 0) {
        this.x = X;
        this.y = Y;
    }

    Magnitude() {
        return Math.square(Math.pow(this.x, 2), Math.pow(this.y, 2));
    }
    
    Normalized() {
        var mag = Magnitude();
        return new Vector2(this.x/mag, this.y/mag);
    }

    Distance(OtherVector = Vector2) {
        var direction = new Vector2();
        direction.x = OtherVector.x - this.x;
        direction.y = OtherVector.y - this.y;
        return direction.Magnitude();
    }

    ConsoleOutput() {
        return '{' + this.x + ',' + this.y + '}';
    }
}
