import * as CONST from "./gameConsts.js"
import * as STATE from "./gameState.js"
import {Player} from "./player.js"
import {Invader} from "./invader.js"

let player;
let lastShotTime;
let lastUpdateInvader;
let lastSpeedUpdateInvader;
let numSpeedUpdates;

export function game(){
    
    let intervalID = setInterval(updateTimer, 1000);
    CONST.AUDIO_CONST.backgroundMusic.play()

    if (!STATE.gameState.gameStarted){

        lastShotTime = Date.now()
        lastUpdateInvader = Date.now()
        lastSpeedUpdateInvader = Date.now()
        numSpeedUpdates = 0

        player = new Player()
        initializeInvaders()
        STATE.gameState.gameStarted = true
    }
    let myReq;

    function animate(){
        if (STATE.gameState.isPlaying){
            myReq = requestAnimationFrame(animate)
        }
        else{
            clearInterval(intervalID)
            CONST.AUDIO_CONST.backgroundMusic.pause()
            CONST.AUDIO_CONST.shoot.pause()
            CONST.AUDIO_CONST.bonus.pause()
            CONST.AUDIO_CONST.explosion.pause()
            CONST.AUDIO_CONST.hit.pause()

            CONST.AUDIO_CONST.gameOver.play()
            cancelAnimationFrame(myReq)
            removeEventListener("keydown", func1)
            removeEventListener("keyup", func2)
        }
        STATE.ctx.fillStyle = "black"
        STATE.ctx.fillRect(0, 0, STATE.canvas.width, STATE.canvas.height)
        player.update()
        player.draw()

        handleCollision(player)
        if((Date.now() - lastUpdateInvader) > CONST.INVADER_CONST.timeBetweenMoves){
            updateInvaders()
            lastUpdateInvader = Date.now()
        }
        drawInvaders()
        if (STATE.keyPressedState.space && (Date.now() - lastShotTime) > CONST.PROJECTILE_CONST.timeBetweenShots){
            player.shoot()
            lastShotTime = Date.now()
        }
        if (((Date.now() - lastSpeedUpdateInvader) > 5000) && numSpeedUpdates < 4){
            updateInvaderSpeed()
            CONST.AUDIO_CONST.bonus.play()
            lastSpeedUpdateInvader = Date.now()
            numSpeedUpdates++
        }
        garbageCollect()
        handleGameOver()
    }
    if(STATE.gameState.isPlaying){
        animate()
    }

    function func1(event){
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
    }

    function func2(event){
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
    }

    addEventListener("keydown", func1);
    addEventListener("keyup", func2);
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

        let isShootingAllowed = isInvadersShootingAllowed()
        invadersRow.invaderList.forEach((invader) => {
            invader.update(invadersRow.isMovingLeft, invadersRow.isMovingRight)
            if ((Math.random() < 0.3) && isShootingAllowed)
                invader.shoot()
                isShootingAllowed = false
        })

    }
}

function isInvadersShootingAllowed(){
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

function drawInvaders(){
    for(const [key, invadersRow] of Object.entries(STATE.invaderList)) {
        invadersRow.invaderList.forEach((invader) => {
            invader.draw()
        })
    }
}


function handleCollision(player){
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

function updateInvaderSpeed(){
    CONST.INVADER_CONST.speedMultiplier = CONST.INVADER_CONST.speedMultiplier + 0.1
    CONST.INVADER_CONST.timeBetweenMoves /= CONST.INVADER_CONST.speedMultiplier
    for(const [key, invadersRow] of Object.entries(STATE.invaderList)) {
        invadersRow.invaderList.forEach((invader) => {
            invader.velocity *= CONST.INVADER_CONST.speedMultiplier
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
}

function updateScore(){
    const destroyedInRow1 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row1.invaderList.length
    const destroyedInRow2 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row2.invaderList.length
    const destroyedInRow3 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row3.invaderList.length
    const destroyedInRow4 = CONST.INVADER_CONST.numInvadersInRow - STATE.invaderList.row4.invaderList.length
    STATE.gameState.score = destroyedInRow1*5 + destroyedInRow2*10 + destroyedInRow3*15 + destroyedInRow4*20
    document.getElementById('score').innerHTML = "score: " + STATE.gameState.score
}

function updateTimer(){
    if(STATE.gameState.time == 0)
        return
    STATE.gameState.time--
    document.getElementById('timer').innerHTML = "time: " + STATE.gameState.time
}

function updateLives(){
    if(STATE.gameState.numLives == 0)
        return
    STATE.gameState.numLives--
    document.getElementById('lives').innerHTML = "lives: " + STATE.gameState.numLives
}

function areAllInvadersDead(){
    for(const [key, invadersRow] of Object.entries(STATE.invaderList)) {
        if(invadersRow.invaderList.length > 0)
            return false
    }
    return true
}

function handleGameOver(){
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
    STATE.gameState.isPlaying = false
}