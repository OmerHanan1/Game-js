import * as CONST from "./gameConsts.js"
import * as STATE from "./gameState.js"
import {Invader} from "./invader.js"


export function initializeInvaders(){
    let j = 0
    for(const [key, invadersRow] of Object.entries(STATE.invaderList)) {
        for(let i = 0; i < CONST.INVADER_CONST.numInvadersInRow; i++){
            const startingPosition = {
                x: CONST.INVADER_CONST.startingPosition.x + i*CONST.INVADER_CONST.width,
                y: CONST.INVADER_CONST.startingPosition.y - j*CONST.INVADER_CONST.height
            } 
            invadersRow.invaderList.push(new Invader(startingPosition))
        }
        j++
    }
}

export function updateInvaders(){
    let random_boolean;
    for(const [key, invadersRow] of Object.entries(STATE.invaderList)) {
        random_boolean = Math.random() < 0.5
        if (invadersRow.invaderList.length == 0)
            continue
        if ((invadersRow.invaderList[0].position.x < CONST.INVADER_CONST.bounds.left) && invadersRow.isMovingLeft){
            invadersRow.isMovingLeft = false
            invadersRow.isMovingRight = true
        }
        else if ((invadersRow.invaderList[invadersRow.invaderList.length-1].position.x > CONST.INVADER_CONST.bounds.right) 
        && invadersRow.isMovingRight){
            invadersRow.isMovingLeft = true
            invadersRow.isMovingRight = false
        }
        else if (random_boolean){
            if(invadersRow.isMovingLeft){
                invadersRow.isMovingLeft = false
                invadersRow.isMovingRight = true
            }
            else if(invadersRow.isMovingRight){
                invadersRow.isMovingLeft = true
                invadersRow.isMovingRight = false
            }
        }

        let isShootingAllowed = isInvadersShootingAllowed()
        invadersRow.invaderList.forEach((invader) => {
            invader.update(invadersRow.isMovingLeft, invadersRow.isMovingRight)
            if ((Math.random() < 0.3) && isShootingAllowed)
                invader.shoot()
                isShootingAllowed = false
        })

    }
}

export function isInvadersShootingAllowed(){
    let allowedToshoot = true;
    if (STATE.invaderProjectileList != undefined){
        for(let i=0; i <STATE.invaderProjectileList.length; i++){
            if (STATE.invaderProjectileList[i].position.y < CONST.CANVAS_SIZE.height*(3/4)){
                allowedToshoot = false
                break
            }
        }
    }
    return allowedToshoot
}

export function drawInvaders(){
    for(const [key, invadersRow] of Object.entries(STATE.invaderList)) {
        invadersRow.invaderList.forEach((invader) => {
            invader.draw()
        })
    }
}


export function handleCollision(player){
    // handle invader and playerProjectile 
    STATE.projectileList.forEach((projectile, projectileIndex) => {
        for(const [key, invadersRow] of Object.entries(STATE.invaderList)) {
            invadersRow.invaderList.forEach((invader, invaderIndex) => {
                const invaderLocation = {
                    left: invader.position.x,
                    right: invader.position.x + CONST.INVADER_CONST.width,
                    up: invader.position.y,
                    down: invader.position.y + CONST.INVADER_CONST.height
                }
                if((projectile.position.x < invaderLocation.right) && (projectile.position.x > invaderLocation.left) &&
                (projectile.position.y > invaderLocation.up) &&(projectile.position.y < invaderLocation.down)){
                    STATE.projectileList.splice(projectileIndex, 1)
                    invadersRow.invaderList.splice(invaderIndex, 1)
                    CONST.AUDIO_CONST.explosion.play()
                    updateScore()
                }
            })
        }
    })

    // handle player and invaderProjectile 
    if (STATE.invaderProjectileList != undefined)
    {
        STATE.invaderProjectileList.forEach((projectile, projectileIndex) => {
            let position = player.position
            const playerLocation = 
            {
                left: position.x,
                right: position.x + CONST.SPACESHIP_CONST.width,
                up: position.y,
                down: position.y + CONST.SPACESHIP_CONST.height
            }
            if((projectile.position.x < playerLocation.right) && (projectile.position.x > playerLocation.left) &&
            (projectile.position.y > playerLocation.up) &&(projectile.position.y < playerLocation.down)){
                STATE.invaderProjectileList.splice(projectileIndex, 1)
                CONST.AUDIO_CONST.hit.play()
                updateLives()
            }
        })
    }
}

export function updateInvaderSpeed(){
    CONST.INVADER_CONST.speedMultiplier = CONST.INVADER_CONST.speedMultiplier + 0.1
    CONST.INVADER_CONST.timeBetweenMoves /= CONST.INVADER_CONST.speedMultiplier
    for(const [key, invadersRow] of Object.entries(STATE.invaderList)) {
        invadersRow.invaderList.forEach((invader) => {
            invader.velocity *= CONST.INVADER_CONST.speedMultiplier
        })
    }
}

export function garbageCollect(){
    STATE.projectileList.forEach((projectile, index) => {
        if(projectile.isOutOfBounds())
            STATE.projectileList.splice(index, 1)
        else
            projectile.update()
    })
    STATE.invaderProjectileList.forEach((projectile, index) => {
        if(projectile.isOutOfBounds())
            STATE.invaderProjectileList.splice(index, 1)
        else
            projectile.update()
    })
}

export function updateScore(){
    const destroyedInRow1 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row1.invaderList.length
    const destroyedInRow2 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row2.invaderList.length
    const destroyedInRow3 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row3.invaderList.length
    const destroyedInRow4 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row4.invaderList.length
    STATE.gameState.score = destroyedInRow1*5 + destroyedInRow2*10 + destroyedInRow3*15 + destroyedInRow4*20
    document.getElementById('score').innerHTML = "score: " + STATE.gameState.score
}

export function updateTimer(){
    if(STATE.gameState.time == 0)
        return
    STATE.gameState.time--
    document.getElementById('timer').innerHTML = "time: " + STATE.gameState.time
}

export function updateLives(){
    if(STATE.gameState.numLives == 0)
        return
    STATE.gameState.numLives--
    document.getElementById('lives').innerHTML = "lives: " + STATE.gameState.numLives
}

export function areAllInvadersDead(){
    for(const [key, invadersRow] of Object.entries(STATE.invaderList)) {
        if(invadersRow.invaderList.length > 0)
            return false
    }
    return true
}

export function handleGameOver(){
    if(STATE.gameState.numLives == 0)
        alert("You Lost")
    else if (STATE.gameState.time == 0){
        if(STATE.gameState.score < 100)
            alert("you can do better")
        else
            alert("Winner!")
    }
    else if(areAllInvadersDead())
        alert("Champion!")
    else
        return
    STATE.gameState.isOver = true
}


export function clearGame(){
    for(const [key, invadersRow] of Object.entries(STATE.invaderList)) {
        invadersRow.invaderList = []
    }
    STATE.projectileList.splice(0,STATE.projectileList.length);
    STATE.invaderProjectileList.splice(0,STATE.invaderProjectileList.length);
    CONST.INVADER_CONST.speedMultiplier = 1
}