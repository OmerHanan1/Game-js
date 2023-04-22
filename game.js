import * as CONST from "./gameConsts.js"
import * as STATE from "./gameState.js"
import {Player} from "./player.js"
import {Projectile} from "./projectile.js" 
import {InvaderProjectile} from "./InvaderProjectile.js"
import {Invader} from "./invader.js"

export function game(){
    CONST.AUDIO_CONST.backgroundMusic.play()
    setInterval(updateTimer, 1000);

    let lastShotTime = Date.now()
    let lastUpdateInvader = Date.now()
    let lastUpdateInvaderProjectile = Date.now()
    
    const player = new Player()
    initializeInvaders()

    function animate(){
        requestAnimationFrame(animate)

        STATE.ctx.fillStyle = "black"
        STATE.ctx.fillRect(0, 0, STATE.canvas.width, STATE.canvas.height)

        player.update()
        player.draw()

        handleCollisionBetweenProjectilesAndInvaders(player)
        // handleCollisionBetweenProjectilesAndPlayer()

        if((Date.now() - lastUpdateInvader) > CONST.INVADER_CONST.timeBetweenMoves){
            updateInvaders()
            lastUpdateInvader = Date.now()
        }
        drawInvaders()
        

        if (STATE.keyPressedState.space && (Date.now() - lastShotTime) > CONST.PROJECTILE_CONST.timeBetweenShots){
            player.shoot()
            lastShotTime = Date.now()
        }

        garbageCollect()
    }
    animate()

    // let stopgame = false
    // if(stopgame)
    //     return

    addEventListener("keydown", (event) => {
        event.preventDefault()
        if (event.key == "ArrowLeft")
            STATE.keyPressedState.left = true
    
        if (event.key == "ArrowRight")
            STATE.keyPressedState.right = true
    
        if (event.key == "ArrowUp")
            STATE.keyPressedState.up = true
    
        if (event.key == "ArrowDown")
            STATE.keyPressedState.down = true
    
        if (event.key == " "){
            STATE.keyPressedState.space = true
        }
    });
    
    addEventListener("keyup", (event) => {
        event.preventDefault()
        if (event.key == "ArrowLeft")
            STATE.keyPressedState.left = false
    
        if (event.key == "ArrowRight")
            STATE.keyPressedState.right = false
    
        if (event.key == "ArrowUp")
            STATE.keyPressedState.up = false
    
        if (event.key == "ArrowDown")
            STATE.keyPressedState.down = false
    
        if (event.key == " "){
            STATE.keyPressedState.space = false
        }
    });
}

function initializeInvaders(){
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

function updateInvaders(){
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
        invadersRow.invaderList.forEach((invader) => {
            invader.update(invadersRow.isMovingLeft, invadersRow.isMovingRight)            
        })

        invadersRow.invaderList.forEach((invader, index) => {
                if (Math.random() < 0.01){
                    invader.shoot()
                }
        })
    }
}

function drawInvaders(){
    for(const [key, invadersRow] of Object.entries(STATE.invaderList)) {
        invadersRow.invaderList.forEach((invader) => {
            invader.draw()
        })
    }
}

function garbageCollect(){
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

    // for(const [key, invadersRow] of Object.entries(invaders)) {
    //     if(invadersRow.invaderList.length == 0)
    //         delete invaders[key]
    // }
}

function handleCollisionBetweenProjectilesAndInvaders(player){
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
    if (STATE.invaderProjectileList != undefined)
    {
        STATE.invaderProjectileList.forEach((projectile, projectileIndex) => {
            let position = player.position
            const playerLocation = 
            {
                left: position['x'] - CONST.SPACESHIP_CONST.width,
                right: position['x'] + CONST.SPACESHIP_CONST.width,
                up: position['y'] - CONST.SPACESHIP_CONST.height,
                down: position['y'] + CONST.SPACESHIP_CONST.height
            }
            if((projectile.position.x < playerLocation.right) && (projectile.position.x > playerLocation.left) &&
            (projectile.position.y > playerLocation.up) &&(projectile.position.y < playerLocation.down)){
                STATE.invaderProjectileList.splice(projectileIndex, 1)
                console.log("player hit")
            }
        })
    }
}

function updateScore(){
    const destroyedInRow1 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row1.invaderList.length
    const destroyedInRow2 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row2.invaderList.length
    const destroyedInRow3 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row3.invaderList.length
    const destroyedInRow4 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row4.invaderList.length
    STATE.gameState.score = destroyedInRow1*5 + destroyedInRow2*10 + destroyedInRow3*15 + destroyedInRow4*20
    document.getElementById('score').innerHTML = STATE.gameState.score
}

function updateTimer(){
    if(STATE.gameState.time == 0)
        return
    STATE.gameState.time--
    document.getElementById('timer').innerHTML = STATE.gameState.time
}

function getPlayerPosition(player)
{
    return player.position()
}