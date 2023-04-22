import * as CONST from "./gameConsts.js"
import * as STATE from "./gameState.js"

export class InvaderProjectile { 
    constructor(position){
        this.position = position
        this.velocity = CONST.INVADER_PROJECTILE_CONST.velocity
        this.radius = CONST.INVADER_PROJECTILE_CONST.radius
        this.color = CONST.INVADER_PROJECTILE_CONST.color
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
        this.position.y += this.velocity.y
    }

    isOutOfBounds(){
        return (this.position.x > CONST.INVADER_PROJECTILE_CONST.bounds.right || 
            this.position.x < CONST.INVADER_PROJECTILE_CONST.bounds.left|| 
            this.position.y > CONST.INVADER_PROJECTILE_CONST.bounds.down||
            this.position.y < CONST.INVADER_PROJECTILE_CONST.bounds.up)
    }
}