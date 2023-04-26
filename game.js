import * as CONST from "./gameConsts.js"
import * as STATE from "./gameState.js"
import * as UTILS from "./gameUtils.js"
import {Player} from "./player.js"

let player;
let lastShotTime;
let lastUpdateInvader;
let lastSpeedUpdateInvader;
let numSpeedUpdates;

export function game(){

    
    let intervalID = setInterval(UTILS.updateTimer, 1000);
    CONST.AUDIO_CONST.backgroundMusic.play()

    if (!STATE.gameState.gameStarted){

        lastShotTime = Date.now()
        lastUpdateInvader = Date.now()
        lastSpeedUpdateInvader = Date.now()
        numSpeedUpdates = 0

        player = new Player()
        UTILS.initializeInvaders()
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

        UTILS.handleCollision(player)
        if((Date.now() - lastUpdateInvader) > CONST.INVADER_CONST.timeBetweenMoves){
            UTILS.updateInvaders()
            lastUpdateInvader = Date.now()
        }
        UTILS.drawInvaders()
        if (STATE.keyPressedState.shooting && (Date.now() - lastShotTime) > CONST.PROJECTILE_CONST.timeBetweenShots){
            player.shoot()
            lastShotTime = Date.now()
        }
        if (((Date.now() - lastSpeedUpdateInvader) > 5000) && numSpeedUpdates < 4){
            UTILS.updateInvaderSpeed()
            CONST.AUDIO_CONST.bonus.play()
            lastSpeedUpdateInvader = Date.now()
            numSpeedUpdates++
        }
        UTILS.garbageCollect()
        UTILS.handleGameOver()
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
    
        if (event.key == CONST.SPACESHIP_CONST.shootingKey){
            STATE.keyPressedState.shooting = true
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
    
        if (event.key == CONST.SPACESHIP_CONST.shootingKey){
            STATE.keyPressedState.shooting = false
        }
    }

    addEventListener("keydown", func1);
    addEventListener("keyup", func2);
}