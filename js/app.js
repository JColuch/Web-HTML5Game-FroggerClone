// Game Constants
var PLAYER_START_X = 200,
    PLAYER_START_Y = 380;



var PLAYER_FRAME = {
    "left offset": 20,
    "top offset": 100,
    "sprite width": 82,
    "sprite height": 170
}

var ENEMY_FRAME = {
    "left offset": 3,
    "top offset": 90,
    "sprite width": 100,
    "sprite height": 170 
}

var STEP_X = 101,
    STEP_Y = 83;

var FINISH_LINE = 83,
    LEFT_WALL = -5,
    RIGHT_WALL = 500,
    TOP_WALL = -100,
    BOTTOM_WALL = 450;






// Utilities
// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getRandomSpeed() {
    return getRandomInt(1, 5);
}
function getRandomXStart() {
    var xStarts = [
        -300,
        -200,
        -100,
        -50
    ];

    var rand = getRandomInt(0,4);
    return xStarts[rand];
}
function getRandomYStart() {
    var yStarts = [
        60,
        140,
        225
    ];

    var rand = getRandomInt(0,3);
    return yStarts[rand];
}






var Sprite = function() {

}
Sprite.prototype.setCollisionFrame = function(settings) {
    this.left = this.x + settings["left offset"];
    this.right = this.x + settings["sprite width"];
    this.top = this.y + settings["top offset"];
    this.bottom = this.y + settings["sprite height"];   
}






var Enemy = function() {
    // Coords on canvas
    this.x = getRandomXStart();
    this.y = getRandomYStart();

    // Random speed multipler
    this.speed = getRandomSpeed();
    
    // Collision detections frame
    this.setCollisionFrame(ENEMY_FRAME);

    // The image/sprite for our enemies
    this.sprite = 'images/enemy-bug.png';
}
Enemy.prototype = Object.create(Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    var newX = (this.speed * 100 * dt) + this.x;

    if (newX > 500) {
        this.x = getRandomXStart();
        this.setCollisionFrame(ENEMY_FRAME);
    }
    else {
        this.x = newX;   
        this.setCollisionFrame(ENEMY_FRAME);
    }
}







// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Position on canvas
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    
    // Set collision frame
    this.setCollisionFrame(PLAYER_FRAME);
    
    this.sprite = 'images/char-boy.png';
}
Player.prototype = Object.create(Sprite.prototype);
Player.prototype.constructor = Player;


// ANOTHER OPTION IS TO CREATE A SUPER CLASS OF SPRITE

// THIS IS THE BEST WAY so all characters are inited with collision frame
// also inited with updateCollisin frame which accepts the fram settings

Player.prototype.reset = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;

    this.setCollisionFrame(PLAYER_FRAME);
}

Player.prototype.checkWin = function() {
    if (this.top < FINISH_LINE) {
        this.reset();
        alert("You won!!!");
    }
}

// Check Collisions
// Conditional Check Source: http://silentmatt.com/rectangle-intersection/
Player.prototype.checkCollisions = function() {
    for (var i in allEnemies) {
        var enemy = allEnemies[i];

        if (this.left < enemy.right &&
            this.right > enemy.left &&
            this.top < enemy.bottom &&
            this.bottom > enemy.top) {
            console.log("Collision!");
            return true;
        }
    }

    return false;
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function(axis, step) {
    if (this.checkCollisions()) {
        this.reset();
    }

    if (axis === "x") {
        var newX = this.x + step;
        if (newX <= RIGHT_WALL && newX >= LEFT_WALL) {
            this.x = newX;
            this.setCollisionFrame(PLAYER_FRAME);
        }
    }
    else if (axis === "y") {
        var newY = this.y + step;
        if (newY >= TOP_WALL && newY <= BOTTOM_WALL) {
            this.y = newY;  
            this.setCollisionFrame(PLAYER_FRAME);
            this.checkWin();
        }
    }
}


Player.prototype.handleInput = function(direction) {
    switch (direction) {
        case "left":
            this.update("x", -STEP_X);
            break;
        case "right":
            this.update("x", STEP_X)
            break;
        case "up":
            this.update("y", -STEP_Y)
            break;
        case "down":
            this.update("y", STEP_Y);
            break;
        default:
            return;
    }
}












// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [
    new Enemy(),
    new Enemy(),
    new Enemy(),
    new Enemy(),
    new Enemy()
];

var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});