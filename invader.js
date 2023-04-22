import * as CONST from "./gameConsts.js"
import * as STATE from "./gameState.js"
import { InvaderProjectile } from "./invaderProjectile.js"

export class Invader { 
    constructor(position){
        this.img = CONST.INVADER_IMAGE
        this.position = position
        this.width = CONST.INVADER_CONST.width
        this.height = CONST.INVADER_CONST.height
        this.velocity = CONST.INVADER_CONST.velocity
    }

    draw(){
        STATE.ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height)
    }

    update(isMovingLeft, isMovingRight){
        if(isMovingLeft)
            this.position.x -= this.width
        if(isMovingRight)
            this.position.x += this.width
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
        const projectile = new InvaderProjectile({x: curr_x, y: curr_y}, isMovingLeft, isMovingRight)
        STATE.projectileList.push(projectile)
        CONST.AUDIO_CONST.shoot.play()
    }
        
}