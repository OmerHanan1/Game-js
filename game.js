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

class Invader { 
    constructor(position){
        this.img = CONST.INVADER_IMAGE
        this.position = position
        this.width = CONST.INVADER_CONST.width
        this.height = CONST.INVADER_CONST.height
        this.velocity = CONST.INVADER_CONST.velocity
    }

    draw(){
        ctx.drawImage(this.img, this.position.x, this.position.y, this.width, this.height)
    }

    update(isMovingLeft, isMovingRight){
        if(isMovingLeft)
            this.position.x -= this.width
        if(isMovingRight)
            this.position.x += this.width
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
const invaders = {
    row1: {invaderList:[], isMovingLeft:true, isMovingRight:false},
    row2: {invaderList:[], isMovingLeft:false, isMovingRight:true},
    row3: {invaderList:[], isMovingLeft:false, isMovingRight:true},
    row4: {invaderList:[], isMovingLeft:true, isMovingRight:false}
}

function initializeInvaders(){
    let j = 0
    for(const [key, invadersRow] of Object.entries(invaders)) {
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
    for(const [key, invadersRow] of Object.entries(invaders)) {
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
    }
}

function drawInvaders(){
    for(const [key, invadersRow] of Object.entries(invaders)) {
        invadersRow.invaderList.forEach((invader) => {
            invader.draw()
        })
    }
}

function garbageCollect(){
    projectileList.forEach((projectile, index) => {
        if(projectile.isOutOfBounds())
            projectileList.splice(index, 1)
        else
            projectile.update()
    })
    for(const [key, invadersRow] of Object.entries(invaders)) {
        if(invadersRow.invaderList.length == 0)
            delete invaders[key]
    }
}

function handleCollision(){
    projectileList.forEach((projectile, projectileIndex) => {
        for(const [key, invadersRow] of Object.entries(invaders)) {
            invadersRow.invaderList.forEach((invader, invaderIndex) => {
                const invaderLocation = {
                    left: invader.position.x,
                    right: invader.position.x + CONST.INVADER_CONST.width,
                    up: invader.position.y,
                    down: invader.position.y + CONST.INVADER_CONST.height
                }
                if((projectile.position.x < invaderLocation.right) && (projectile.position.x > invaderLocation.left) &&
                (projectile.position.y > invaderLocation.up) &&(projectile.position.y < invaderLocation.down)){
                    projectileList.splice(projectileIndex, 1)
                    invadersRow.invaderList.splice(invaderIndex, 1)
                    CONST.AUDIO_CONST.explosion.play()
                    console.log(invaders)
                }
            })
        }
    })
}

export function game(){
    CONST.AUDIO_CONST.backgroundMusic.play()

    let lastShotTime = Date.now()
    let lastUpdateInvader = Date.now()
    
    const player = new Player()
    initializeInvaders()

    function animate(){
        requestAnimationFrame(animate)

        ctx.fillStyle = "black"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        player.update()
        player.draw()

        handleCollision()

        if((Date.now() - lastUpdateInvader) > CONST.INVADER_CONST.timeBetweenMoves){
            updateInvaders()
            lastUpdateInvader = Date.now()
        }
        drawInvaders()

        if (keyPressedState.space && (Date.now() - lastShotTime) > CONST.PROJECTILE_CONST.timeBetweenShots){
            player.shoot()
            lastShotTime = Date.now()
        }

        garbageCollect()
    }
    animate()

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
}