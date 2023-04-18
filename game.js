import * as CONST from "./gameConsts.js"

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext("2d")

canvas.width = CONST.CANVAS_SIZE.width
canvas.height = CONST.CANVAS_SIZE.height

ctx.fillStyle = "black"
ctx.fillRect(0, 0, canvas.width, canvas.height)

class Player {
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
        if (keyPressedState.left && keyPressedState.up){
            this.moveLeft()
            this.moveUp()
        }
        //left and down
        else if (keyPressedState.left && keyPressedState.down){
            this.moveLeft()
            this.moveDown()
        }
        //right and down
        else if (keyPressedState.right && keyPressedState.down){
            this.moveRight()
            this.moveDown()
        }
        //right and up
        else if (keyPressedState.right && keyPressedState.up){
            this.moveRight()
            this.moveUp()
        }
        // left 
        else if (keyPressedState.left)
            this.moveLeft()
        // right 
        else if (keyPressedState.right)            
            this.moveRight()
        // up 
        else if (keyPressedState.up)            
            this.moveUp()
        // down 
        else if (keyPressedState.down)            
            this.moveDown()
    }

    draw(){
        ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height)
    }

    shoot(){
        const curr_x = this.position.x + this.width/2
        const curr_y = this.position.y
        let isMovingLeft = false
        let isMovingRight = false
        if(keyPressedState.left)
            isMovingLeft = true
        else if(keyPressedState.right)
            isMovingRight = true
        const projectile = new Projectile({x: curr_x, y: curr_y}, isMovingLeft, isMovingRight)
        projectileList.push(projectile)
    }
}

class Projectile { 
    constructor(position ,isMovingLeft, isMovingRight){
        this.position = position
        this.velocity = CONST.PROJECTILE_CONST.velocity
        this.radius = CONST.PROJECTILE_CONST.radius
        this.color = CONST.PROJECTILE_CONST.color
        this.isMovingLeft = isMovingLeft
        this.isMovingRight = isMovingRight
    }

    draw(){
        ctx.beginPath()
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.closePath()
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

const keyPressedState = {
    left: false,
    right: false,
    up: false,
    down:false,
    space:false
}

const projectileList = []

export function game(){
    CONST.AUDIO_CONST.backgroundMusic.play()
    let lastShotTime = Date.now();
    const player = new Player()    
    function animate(){
        requestAnimationFrame(animate)

        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        player.update()
        player.draw()
        if (keyPressedState.space && (Date.now() - lastShotTime) > CONST.PROJECTILE_CONST.timeBetweenShots){
            player.shoot()
            lastShotTime = Date.now()
        }
        
        projectileList.forEach((projectile, index) => {
            if(projectile.isOutOfBounds())
                projectileList.splice(index, 1)
            else
                projectile.update()
        })
    }
    animate()
}

addEventListener("keydown", (event) => {
    event.preventDefault()
    if (event.key == "ArrowLeft")
        keyPressedState.left = true

    if (event.key == "ArrowRight")
        keyPressedState.right = true

    if (event.key == "ArrowUp")
        keyPressedState.up = true

    if (event.key == "ArrowDown")
        keyPressedState.down = true

    if (event.key == " "){
        keyPressedState.space = true
    }
});

addEventListener("keyup", (event) => {
    event.preventDefault()
    if (event.key == "ArrowLeft")
        keyPressedState.left = false

    if (event.key == "ArrowRight")
        keyPressedState.right = false

    if (event.key == "ArrowUp")
        keyPressedState.up = false

    if (event.key == "ArrowDown")
        keyPressedState.down = false

    if (event.key == " "){
        keyPressedState.space = false
    }
});