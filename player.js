import * as CONST from "./gameConsts.js"
import * as STATE from "./gameState.js"
import { Projectile } from "./projectile.js"

export class Player {
    constructor(){
        this.position = {
            x: CONST.SPACESHIP_CONST.startingPosition.x,
            y: CONST.SPACESHIP_CONST.startingPosition.y
        }
        this.img = CONST.SPACESHIP_IMAGE
        this.speed = CONST.SPACESHIP_CONST.speed
        this.width = CONST.SPACESHIP_CONST.width
        this.height = CONST.SPACESHIP_CONST.height
    }
    moveLeft(){
        if(!(this.position.x < CONST.SPACESHIP_CONST.bounds.left))
            this.position.x -= this.speed.x
    }
    moveRight(){
        if(!(this.position.x > CONST.SPACESHIP_CONST.bounds.right))
            this.position.x += this.speed.x
    }
    moveUp(){
        if(!(this.position.y < CONST.SPACESHIP_CONST.bounds.up))
            this.position.y -= this.speed.y
    }
    moveDown(){
        if(!(this.position.y > CONST.SPACESHIP_CONST.bounds.down))
            this.position.y += this.speed.y
    }
    update(){
        //left and up
        if (STATE.keyPressedState.left && STATE.keyPressedState.up){
            this.moveLeft()
            this.moveUp()
        }
        //left and down
        else if (STATE.keyPressedState.left && STATE.keyPressedState.down){
            this.moveLeft()
            this.moveDown()
        }
        //right and down
        else if (STATE.keyPressedState.right && STATE.keyPressedState.down){
            this.moveRight()
            this.moveDown()
        }
        //right and up
        else if (STATE.keyPressedState.right && STATE.keyPressedState.up){
            this.moveRight()
            this.moveUp()
        }
        // left 
        else if (STATE.keyPressedState.left)
            this.moveLeft()
        // right 
        else if (STATE.keyPressedState.right)            
            this.moveRight()
        // up 
        else if (STATE.keyPressedState.up)            
            this.moveUp()
        // down 
        else if (STATE.keyPressedState.down)            
            this.moveDown()
    }

    draw(){
        STATE.ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height)
    }

    shoot(){
        const curr_x = this.position.x + this.width/2
        const curr_y = this.position.y
        let isMovingLeft = false
        let isMovingRight = false
        if(STATE.keyPressedState.left)
            isMovingLeft = true
        else if(STATE.keyPressedState.right)
            isMovingRight = true
        const projectile = new Projectile({x: curr_x, y: curr_y}, isMovingLeft, isMovingRight)
        STATE.projectileList.push(projectile)
        CONST.AUDIO_CONST.shoot.play()
    }
}