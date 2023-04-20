import * as CONST from "./gameConsts.js"
import * as STATE from "./gameState.js"

export class Projectile { 
    constructor(position ,isMovingLeft, isMovingRight){
        this.position = position
        this.velocity = CONST.PROJECTILE_CONST.velocity
        this.radius = CONST.PROJECTILE_CONST.radius
        this.color = CONST.PROJECTILE_CONST.color
        this.isMovingLeft = isMovingLeft
        this.isMovingRight = isMovingRight
    }

    draw(){
        STATE.ctx.beginPath()
        STATE.ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        STATE.ctx.fillStyle = this.color
        STATE.ctx.fill()
        STATE.ctx.closePath()
    }

    update(){
        this.draw()
        if(this.isMovingLeft)
            this.position.x -= this.velocity.x
        else if(this.isMovingRight)
            this.position.x += this.velocity.x
        this.position.y -= this.velocity.y
    }

    isOutOfBounds(){
        return (this.position.x > CONST.PROJECTILE_CONST.bounds.right || 
            this.position.x < CONST.PROJECTILE_CONST.bounds.left|| 
            this.position.y > CONST.PROJECTILE_CONST.bounds.down||
            this.position.y < CONST.PROJECTILE_CONST.bounds.up)
    }
}