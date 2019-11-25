function callExternalScript() {
    console.log("Call to external script was successfull!");
}

function makeMap() {

    for (var i = 0, x = 0, y = 0; i < mapWidth * mapHeight; i++) {

        if (x === mapWidth) {
            x = 0;
            y++;
        }

        if (x === 0 || y === 0 || x === mapWidth - 1 || y === mapHeight - 1 || x % 2 === 0 && y % 2 === 0) {
            map.push(new Block(x, y, 1));
        }

        else {
            map.push(new Block(x, y, 0));
        }

        x++;
    }

}

function setDirection(player) {
    
    var directionsPressed = 0;

    for (let key in player.keysPressed) {
        if (player.keysPressed[key] === true) { directionsPressed++ };
    }

    if (directionsPressed === 1 || directionsPressed === 2) {
        player.direction = determineDirection(player.keysPressed.up, player.keysPressed.right, player.keysPressed.down, player.keysPressed.left);
    }
    else {
        player.direction = null;
    }
    
    document.getElementById('direction').innerHTML = player.direction;

}

function determineDirection(up, right, down, left) {

    switch (true) {

        case up && right:
            return direction.upright;
            break;
        case up && left:
            return direction.upleft;
            break;
        case down && right:
            return direction.downright;
            break;
        case down && left:
            return direction.downleft;
            break;
        case up:
            return direction.up;
            break;
        case right:
            return direction.right;
            break;
        case down:
            return direction.down;
            break;
        case left:
            return direction.left;
            break;
    }

}

function movePlayer(player) {
    
    if (player.direction == null) {
        return;
    }

    switch (player.direction) {

        case direction.up:

            for (var i = 0; i < player.speed; i++) {
                
                if (player.canGoUp) {
                    
                    player.canvasPos.y--;
                    updatePlayer(player);

                }

            }

            break;
        case direction.right:

            for (var i = 0; i < player.speed; i++) {

                if (player.canGoRight) {

                    player.canvasPos.x++;
                    updatePlayer(player);

                }

            }
            
            break;
        case direction.down:

            for (var i = 0; i < player.speed; i++) {

                if (player.canGoDown) {

                    player.canvasPos.y++;
                    updatePlayer(player);

                }

            }

            break;
        case direction.left:

            for (var i = 0; i < player.speed; i++) {

                if (player.canGoLeft) {

                    player.canvasPos.x--;
                    updatePlayer(player);

                }

            }

            break;
        case direction.upright:

            for (var i = 0; i < player.speed; i++) {

                if (player.canGoUp) {

                    player.canvasPos.y--;
                    updatePlayer(player);

                }

            }

            for (var i = 0; i < player.speed; i++) {

                if (player.canGoRight) {

                    player.canvasPos.x++;
                    updatePlayer(player);

                }

            }

            break;
        case direction.downright:

            for (var i = 0; i < player.speed; i++) {

                if (player.canGoDown) {

                    player.canvasPos.y++;
                    updatePlayer(player);

                }

            }

            for (var i = 0; i < player.speed; i++) {

                if (player.canGoRight) {

                    player.canvasPos.x++;
                    updatePlayer(player);

                }

            }

            break;
        case direction.downleft:

            for (var i = 0; i < player.speed; i++) {

                if (player.canGoDown) {

                    player.canvasPos.y++;
                    updatePlayer(player);

                }

            }

            for (var i = 0; i < player.speed; i++) {

                if (player.canGoLeft) {

                    player.canvasPos.x--;
                    updatePlayer(player);

                }

            }

            break;
        case direction.upleft:

            for (var i = 0; i < player.speed; i++) {

                if (player.canGoUp) {

                    player.canvasPos.y--;
                    updatePlayer(player);

                }

            }

            for (var i = 0; i < player.speed; i++) {

                if (player.canGoLeft) {

                    player.canvasPos.x--;
                    updatePlayer(player);

                }

            }

            break;
    }

}

function convertCanvasPosToMapPos(x, y) {

    return {
        x: Math.floor(x / blockSize),
        y: Math.floor(y / blockSize)
    };

}

function doObjectsCollide(firstObjectX, firstObjectY, firstObjectWidth, firstObjectHeight, secondObjectX, secondObjectY, secondObjectWidth, secondObjectHeight) {

    if (firstObjectX < secondObjectX + secondObjectWidth &&
        firstObjectX + firstObjectWidth > secondObjectX &&
        firstObjectY < secondObjectY + secondObjectHeight &&
        firstObjectHeight + firstObjectY > secondObjectY) {

        return true;

    }
    else {
        return false;
    }

}

function drawGame() {

    ctx.clearRect(0, 0, c.width, c.height);
    drawMap();
    drawPlayers();
}

function drawMap() {

    for (var i = 0; i < map.length; i++) {

        if (map[i].blockType.blockType === blockType.type_wall) {

            ctx.fillStyle = "black";

        }
        else if (map[i].blockType.blockType === blockType.type_empty) {

            if (map[i].onFire === true) {

                ctx.fillStyle = "orange";

            } else if (map[i].hasBomb) {

                ctx.fillStyle = "red";

            } else if (map[i].item) {

                ctx.fillStyle = map[i].item.color;

            } else {

                ctx.fillStyle = "green";

            }

        }
        else if (map[i].blockType.blockType === blockType.type_crate) {

            ctx.fillStyle = "brown";

        }

        ctx.fillRect(map[i].mapPos.x * blockSize, map[i].mapPos.y * blockSize, blockSize, blockSize);

    }

}

function drawPlayers() {

    for (var i = 0; i < players.length; i++) {

        if (players[i].id === 1) {
            ctx.fillStyle = "blue";
        } else {
            ctx.fillStyle = "red";
        }
        
        ctx.fillRect(players[i].canvasPos.x, players[i].canvasPos.y, players[i].size.width, players[i].size.height);
        ctx.fillStyle = 'black';

    }

}

function updatePlayer(player) {

    updateMapPos(player);
    updateSurroundings(player);
    updateMovementPossibilities(player);

}

function updateMapPos(player) {

    player.mapPos = {
        x: Math.floor(player.canvasPos.x / blockSize),
        y: Math.floor(player.canvasPos.y / blockSize)
    };

}

function updateSurroundings(player) {
    
    player.surroundings.up = getBlockByMapPos(player.mapPos.x, player.mapPos.y - 1);
    player.surroundings.upRight = getBlockByMapPos(player.mapPos.x + 1, player.mapPos.y - 1);
    player.surroundings.right = getBlockByMapPos(player.mapPos.x + 1, player.mapPos.y);
    player.surroundings.downRight = getBlockByMapPos(player.mapPos.x + 1, player.mapPos.y + 1);
    player.surroundings.down = getBlockByMapPos(player.mapPos.x, player.mapPos.y + 1);
    player.surroundings.downLeft = getBlockByMapPos(player.mapPos.x - 1, player.mapPos.y + 1);
    player.surroundings.left = getBlockByMapPos(player.mapPos.x - 1, player.mapPos.y);
    player.surroundings.upLeft = getBlockByMapPos(player.mapPos.x - 1, player.mapPos.y - 1);

}

function updateMovementPossibilities(player) {

    updatePlayerCanGoUp(player);
    updatePlayerCanGoRight(player);
    updatePlayerCanGoDown(player);
    updatePlayerCanGoLeft(player);

}

function updatePlayerCanGoUp(player) {

    var blocksAbove = [
        player.surroundings.upLeft,
        player.surroundings.up,
        player.surroundings.upRight
    ];

    for (var i = 0; i < blocksAbove.length; i++) {

        if (doObjectsCollide(player.canvasPos.x, player.canvasPos.y - 1, playerSize, 1, blocksAbove[i].canvasPos.x, blocksAbove[i].canvasPos.y, blockSize, blockSize) && blocksAbove[i].walkThrough === false) {

            player.canGoUp = false;
            return;

        }

    }

    player.canGoUp = true;

}

function updatePlayerCanGoRight(player) {

    var blocksToTheRight = [
        player.surroundings.upRight,
        player.surroundings.right,
        player.surroundings.downRight
    ];

    for (var i = 0; i < blocksToTheRight.length; i++) {

        if (doObjectsCollide(player.canvasPos.x + playerSize + 1, player.canvasPos.y, 1, playerSize, blocksToTheRight[i].canvasPos.x, blocksToTheRight[i].canvasPos.y, blockSize, blockSize) && blocksToTheRight[i].walkThrough === false) {

            player.canGoRight = false;
            return;

        }

    }

    player.canGoRight = true;

}

function updatePlayerCanGoDown(player) {

    var blocksUnderneath = [
        player.surroundings.downRight,
        player.surroundings.down,
        player.surroundings.downLeft
    ];

    for (var i = 0; i < blocksUnderneath.length; i++) {

        if (doObjectsCollide(player.canvasPos.x, player.canvasPos.y + playerSize + 1, playerSize, 1, blocksUnderneath[i].canvasPos.x, blocksUnderneath[i].canvasPos.y, blockSize, blockSize) && blocksUnderneath[i].walkThrough === false) {

            player.canGoDown = false;
            return;

        }

    }

    player.canGoDown = true;

}

function updatePlayerCanGoLeft(player) {

    var blocksToTheLeft = [
        player.surroundings.downLeft,
        player.surroundings.left,
        player.surroundings.upLeft
    ];

    for (var i = 0; i < blocksToTheLeft.length; i++) {

        if (doObjectsCollide(player.canvasPos.x - 1, player.canvasPos.y, 1, playerSize, blocksToTheLeft[i].canvasPos.x, blocksToTheLeft[i].canvasPos.y, blockSize, blockSize) && blocksToTheLeft[i].walkThrough === false) {

            player.canGoLeft = false;
            return;

        }

    }

    player.canGoLeft = true;

}

function updatePlayerCanGoRight(player) {

    var blocksToTheRight = [
        player.surroundings.upRight,
        player.surroundings.right,
        player.surroundings.downRight
    ];

    for (var i = 0; i < blocksToTheRight.length; i++) {

        if (doObjectsCollide(player.canvasPos.x + playerSize + 1, player.canvasPos.y, 1, playerSize, blocksToTheRight[i].canvasPos.x, blocksToTheRight[i].canvasPos.y, blockSize, blockSize) && blocksToTheRight[i].walkThrough === false) {

            player.canGoRight = false;
            return;

        }

    }

    player.canGoRight = true;

}

function getBlockByMapPos(x, y) {

    for (var i = 0; i < map.length; i++) {

        if (map[i].mapPos.x === x && map[i].mapPos.y === y) {
            return map[i];
        }

    }

}

function getBlockByCanvasPos(x, y) {

    for (var i = 0; i < map.length; i++) {

        if (doObjectsCollide(x, y, 1, 1, map[i].canvasPos.x, map[i].canvasPos.y, blockSize, blockSize)) {
            return map[i];
        }

    }

}

function Block(mapPosX, mapPosY, blockType) {

    this.mapPos = {
        x: mapPosX,
        y: mapPosY
    };
    this.canvasPos = {
        x: Math.floor(mapPosX * blockSize),
        y: Math.floor(mapPosY * blockSize)
    };
    this.size = {
        width: blockSize,
        height: blockSize
    };
    this.blockType = {
        blockType: blockType
    };
    this.walkThrough = (blockType === 0 ? true : false);

}

function Player(x, y, id) {

    var self = this;
    this.spawnPoint = { x: x, y: y };
    this.mapPos = {
        x: x,
        y: y
    };
    this.canvasPos = {
        x: Math.floor(x * blockSize) + blockSize / 4,
        y: Math.floor(y * blockSize) + blockSize / 4
    };
    this.size = {
        width: playerSize,
        height: playerSize
    };
    this.surroundings = {
        up: null,
        upRight: null,
        right: null,
        downRight: null,
        down: null,
        downLeft: null,
        left: null,
        upLeft: null
    };
    this.canGoUp = null;
    this.canGoRight = null;
    this.canGoDown = null;
    this.canGoLeft = null;
    this.direction = null;
    this.keysPressed = {
        up: false,
        right: false,
        down: false,
        left: false
    };
    this.id = id;
    this.speed = 1;
    updateSurroundings(this);
    updateMovementPossibilities(this);

}

$(document).keydown(function (e) {

            switch (e.keyCode) {

/*ENTER*/           case 13: {
                        if (timer.stopped) {
                            timer.start();
                        } else {
                            timer.stop();
                        }
                    } break;

/*Player 1*/

/*W*/               case 87: {
                        players[0].keysPressed.up = true;
                    } break;

/*D*/               case 68: {
                        players[0].keysPressed.right = true;
                    } break;

/*S*/               case 83: {
                        players[0].keysPressed.down = true;
                    } break;

/*A*/               case 65: {
                        players[0].keysPressed.left = true;
                    } break;

/*Player 2*/

/*UP*/              case 38: {
                        players[1].keysPressed.up = true;
                    } break;

/*RIGHT*/           case 39: {
                        players[1].keysPressed.right = true;
                    } break;

/*DOWN*/            case 40: {
                        players[1].keysPressed.down = true;
                    } break;

/*LEFT*/            case 37: {
                        players[1].keysPressed.left = true;
                    } break;

            }

});

$(document).keyup(function (e) {

            switch (e.keyCode) {

/*Player 1*/

/*W*/           case 87: {
                    players[0].keysPressed.up = false;
                } break;

/*D*/           case 68: {
                    players[0].keysPressed.right = false;
                } break;

/*S*/           case 83: {
                    players[0].keysPressed.down = false;
                } break;

/*A*/           case 65: {
                    players[0].keysPressed.left = false;
                } break;

/*Player 2*/

/*UP*/          case 38: {
                    players[1].keysPressed.up = false;
                } break;

/*RIGHT*/       case 39: {
                    players[1].keysPressed.right = false;
                } break;

/*DOWN*/        case 40: {
                    players[1].keysPressed.down = false;
                } break;

/*LEFT*/        case 37: {
                    players[1].keysPressed.left = false;
                } break;

            }

});

function Timer() {

    this.interval = 0;
    this.stopped = true;
    this.timeout;
    this.timeStarted;
    this.isLoop = false;
    this.tick = function () { }
    this.ticki = function () {

        if (!self.stopped) {

            self.tick();

            if (self.isLoop) {
                self.continue();
            } else {
                self.stopped = true;
            }

        }

    }
    this.start = function () {
        self.timeStarted = Date.now();
        self.stopped = false;
        self.continue();
        console.log("timer started");
    }
    this.continue = function () {
        self.timeout = setTimeout(self.ticki, self.interval);
    }
    this.stop = function () {
        self.stopped = true;
        console.log("timer stopped");
    }
    this.add = function (now, time) {
        var newTime = self.interval - (now - self.timeStarted) + time;
        clearTimeout(self.timeout);
        self.timeout = setTimeout(self.ticki, newTime);
    }
    var self = this;

}

