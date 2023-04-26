import * as CONST from "./gameConsts.js"

export const keyPressedState = {
    left: false,
    right: false,
    up: false,
    down:false,
    shooting:false
}

export const projectileList = []
export const invaderProjectileList = []

export const invaderList = {
    row1: {invaderList:[], isMovingLeft:true, isMovingRight:false},
    row2: {invaderList:[], isMovingLeft:false, isMovingRight:true},
    row3: {invaderList:[], isMovingLeft:false, isMovingRight:true},
    row4: {invaderList:[], isMovingLeft:true, isMovingRight:false}
}

export const gameState = {
    time: 120,
    score: 0,
    numLives: 3,
    isPlaying: false,
    isStarted: false
}  

export const canvas = document.querySelector('canvas');
canvas.width = CONST.CANVAS_SIZE.width
canvas.height = CONST.CANVAS_SIZE.height

export const ctx = canvas.getContext("2d")

