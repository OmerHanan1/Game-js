import * as CONST from "./gameConsts.js"
import * as STATE from "./gameState.js"

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
}