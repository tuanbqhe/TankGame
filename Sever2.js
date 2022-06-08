const io = require('socket.io')(process.env.PORT || 4567);
const Player = require('.modules/Player');
const cullet = require('.modules/Bullet');
const Vector2 = require('.modules/Vector2');
const players = [];
const sockets = [];
const bullets = [];
setInterval(() => {
    bullets.forEach((bullet) => {
        let isDestroyed = bullet.onUpdate();
        if (isDestroyed) {
            serverUnSpawn(bullet);
        } else {
            var returnData = {
                id: bullet.id,
                position: {
                    x: bullet.position.x,
                    y: bullet.position.y
                }
            }

            for (let sk in sockets) {
                sockets[sk].emit("updatePosition", returnData);
            }
        }
    })
    for(let player in players) {
        if(players[player].isDead) {
           if (!players[player].reSpawn()){
               console.log( player + " is dead");
               sockets[player].emit("reSpawn", players[player]);
               sockets[player].broadcast.emit("reSpawn", players[player]);
           };
        }
    }

}, 100);

function serverUnSpawn (bullet) {
    index = bullets.indexOf(bullet);
    bullets.splice(index, 1);
    let returnData = { id: bullet.id }; count = 0;
    for (let sk in sockets) {
        sockets[sk].emit("serverUnSpawn", returnData);
    }
}

io.on('connection', (socket) => {
    console.log("client connection");
    const player = new Player();
    const thisPlayerId = player.id;
    players[thisPlayerId] = player;
    sockets[thisPlayerId] = socket;
    socket.emit('register', thisPlayerId);
    socket.emit('spawn', player);
    socket.broadcast.emit('spawn', player);
    for (var id in players) {
        if (id !== thisPlayerId) {
            socket.emit('spawn', players[id]);
        }
    }
    socket.on('updatePosition', (data) => {
        player.position.x = data.position.x;
        player.position.y = data.position.y;
        socket.broadcast.emit('updatePosition', player);
    })

    socket.on("updateRotation", (data) => {
        player.tankRotation = data.tankRotation;
        player.barrelRotation = data.barrelRotation;
        socket.broadcast.emit('updateRotation', player);
    })

    socket.on('disconnect', () => {
        console.log("A player has disconnected");
        delete players[thisPlayerId];
        delete sockets[thisPlayerId];
        socket.broadcast.emit("disconnected", player);
    })
    socket.on("collisionDestroy", (data) => {
        let bulletId = data['objectId'];
        let targetId = data['targetId'];
        for( let player in players) {
            console.log("||"+  player);
            if(players[player].id == targetId) {
                players[player].dealDamage(50);
                if(players[player].isDead) {
                    sockets[player].emit("died", players[player]);
                    sockets[player].broadcast.emit("died", players[player]);
                }
            }
        }
        
        for (let bullet of bullets) {
            if (bullet.id == bulletId) {
                bullet.isDestroyed = true;
            }
        }
    })
    socket.on('fireBullet', (data) => {

        const bullet = new cullet();
        bullet.name = "Bullet";
        bullet.activatorId = data.activatorId;
        bullet.position = new Vector2(data['position']['x'], data['position']['y']);
        bullet.direction = new Vector2(data['direction']['x'], data['direction']['y']);
        bullets.push(bullet);
        socket.broadcast.emit("serverSpawn", bullet);
        socket.emit("serverSpawn", bullet);
    })

})
