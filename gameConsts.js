// spaceship image
export const SPACESHIP_IMAGE = new Image()
// SPACESHIP_IMAGE.src = "./assets/spaceship.png"
SPACESHIP_IMAGE.src = "./assets/spaceship_1_no_background.png"

// invader image
export const FIRST_ROW_INVADER = new Image()
FIRST_ROW_INVADER.src = "./assets/invader.png"

export const SECOND_ROW_INVADER = new Image()
SECOND_ROW_INVADER.src = "./assets/alien_enemy_1_no_background.png"

export const THIRD_ROW_INVADER = new Image()
THIRD_ROW_INVADER.src = "./assets/alien_enemy_2_nobg.png"

export const FOURTH_ROW_INVADER = new Image()
FOURTH_ROW_INVADER.src = "./assets/spaceship_2_nobg.png"

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
    width: 120,
    height: 80,
    startingPosition: {
        x: 550,
        y: 450
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


// game const
export const GAME_CONST = {
    time: 120,
    score: 0,
    numLives: 3
}


