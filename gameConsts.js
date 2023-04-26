// spaceship image
export const SPACESHIP_IMAGE = new Image()
SPACESHIP_IMAGE.src = "./assets/spaceship.png"

// invader image
export const INVADER_IMAGE = new Image()
INVADER_IMAGE.src = "./assets/invader.png"

// audio const
export const AUDIO_CONST = {
    backgroundMusic: new Audio("./assets/audio/backgroundMusic.wav"),
    explosion: new Audio("./assets/audio/explode.wav"),
    shoot: new Audio("./assets/audio/shoot.wav"),
    hit: new Audio("./assets/audio/hit.wav"),
    bonus: new Audio("./assets/audio/bonus.mp3"),
    gameOver: new Audio("./assets/audio/gameOver.mp3")
}


// canvas size
export const CANVAS_SIZE = {
    width: 1200,
    height: 600
}


// spaceship const
export const SPACESHIP_CONST = {
    shootingKey: " ",
    width: 75,
    height: 50,
    startingPosition: {
        x: 575,
        y: 500
    },
    speed: {
        x: 4,
        y: 2
    }
}


// spaceship bounds
SPACESHIP_CONST.bounds = {
    left: 0 + SPACESHIP_CONST.width/3,
    right: 1200 - SPACESHIP_CONST.width/0.75,  
    up: 360 + SPACESHIP_CONST.height/2,
    down: 600 - SPACESHIP_CONST.height/0.75
}


// projectile const
export const PROJECTILE_CONST = {
    velocity: {
        x: 1,
        y: 4
    },
    radius: 3, 
    color: "yellow",
    // in ms
    timeBetweenShots: 500,
    bounds: {
        left:0,
        right:CANVAS_SIZE.width,
        up:0,
        down:CANVAS_SIZE.height
    }
}


// invader size
export const INVADER_CONST = {
    numInvadersInRow: 5,
    startingPosition: {
        x: 500,
        y: 170
    },
    width: 50,
    height: 50,
    velocity: 10,
    speedMultiplier: 1,
    // in ms
    timeBetweenMoves: 500
}

INVADER_CONST.bounds = {
    left: 0 + 0.5*INVADER_CONST.width,
    right: CANVAS_SIZE.width - INVADER_CONST.width*1.5
}


// ivader projectile const
export const INVADER_PROJECTILE_CONST = {
    velocity: 4 * INVADER_CONST.speedMultiplier,
    radius: 5, 
    color: "red",
    bounds: {
        left:0,
        right:CANVAS_SIZE.width,
        up:0,
        down:CANVAS_SIZE.height
    }
}


