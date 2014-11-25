// MUST HAVE FEATURES
// Player moves - Complete
// Player doesn't fall off screen - Complete
// Bug moves - Complete
// Collision
    // xCoord + bugWidth
    // in update is player on dangerous row and if so is the nose greater than top left of player and then call reset



// Constants
var PLAYER_START_X = 200,
    PLAYER_START_Y = 380;

var STEP_X = 101,
    STEP_Y = 83;

var LEFT_WALL = -5,
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

// Enemies
    // varying speed - Complete
    // random placement at start

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // Coords on canvas
    this.x = getRandomXStart();
    this.y = getRandomYStart();

    // Random speed multipler
    this.speed = getRandomSpeed();
    console.log("New!!!" + this.x);
    // Collision detections frame
    var top = 0;
    var bottom = 0;
    var left = 0;
    var right = 0;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}

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
    }
    else {
        this.x = newX;       
    }

}



// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Position on canvas
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    
    // Collision detections frame
    this.top = "";
    var bottom = "";
    var left = "";
    var right = "";
    
    this.sprite = 'images/char-boy.png';
}

// Draw the player on the screen, required method for game
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

Player.prototype.update = function(axis, step) {
    if (axis === "x") {
        var newX = this.x + step;
        if (newX <= RIGHT_WALL && newX >= LEFT_WALL) {
            this.x = newX;
        }
    }
    else if (axis === "y") {
        var newY = this.y + step;
        if (newY >= TOP_WALL && newY <= BOTTOM_WALL) {
            this.y = newY;
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