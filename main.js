import {game} from "./game.js"
import {validate_details} from "./form_validation.js"
import * as STATE from "./gameState.js" 
import * as CONST from "./gameConsts.js"

// on load page
let isModalShowing;
let onGamePage;

$(document).ready(function () {
    $("div.welcome").show();
    $("div.login").hide()
    $("div.signup").hide();
    $("div.game").hide();
    $("div.config").hide();
    $("div.modal").hide();
    $("div.records").hide();
    $("div.game-over-modal").hide();
    isModalShowing = false
    onGamePage = false
});

$(document).keyup(function(e) {
    if (e.key === "Escape") { 
        if(isModalShowing){
            closeModal()
        }
    }
});

const inputVal = document.getElementById("shooting_input");
inputVal.value = CONST.SPACESHIP_CONST.shootingKey
inputVal.addEventListener("keydown", (event) => {
    event.preventDefault()
    inputVal.value = event.key
});

// decalring users
const admin_user = {username:"p",password:"testuser", first_name:"admin", last_name:"admin", email:"admin@admin.test", birth_date: "9/11/2001"}
const users = [admin_user]


// click events

// welcome page
$("#login_button").click(() => showLoginPage())
$("#signup_button").click(() => showSignUpPage())

// navbar
$("#navbar_login_button").click(() => showLoginPage());
$("#navbar_signup_button").click(() => showSignUpPage());
$("#navbar_about_button").click(() => showModal());
$("#navbar_logo_button").click(() => showWelcomePage());

// modal
$("#close_modal_button_1").click(() => closeModal());
$("#close_modal_button_2").click(() => closeModal());

// game
$("#new_game_button").click(() => {
    finishGame();
    sleep(1000).then(()=>{startNewGame();})
})
$("#records-table-button").click(() => {
    showRecordsPage();
})

$("#back-to-game-button").click(() => {
    showGamePage();
})

// form submition
$("form.signup-form").submit((event) => {
    event.preventDefault();
    onSubmitSignUpForm();
    return false;
});

$("form.login-form").submit((event) => {
    event.preventDefault();
    onSubmitLoginForm();
    const tableBody = document.querySelector('#records-table tbody');
    tableBody.innerHTML = '';
    return false;
});

$("#submit_shooting_button").click(() => onSubmitShootingButton());


// on form submit events
function onSubmitSignUpForm(){
    const username = $("#username").val()
    const password = $("#password").val()
    const confirm_password = $("#confirm_password").val()
    const first_name = $("#first_name").val()
    const last_name = $("#last_name").val()
    const email = $("#email").val()
    const birth_date = $("#birth_date").val()

    const is_valid = validate_details(username, password, confirm_password, first_name, last_name, email, birth_date)
    if (!is_valid) return

    const new_user = {username:username, password:password, first_name:first_name, last_name:last_name, email:email,birth_date:birth_date}
    users.push(new_user)
    alert("signed up successfully")
    showLoginPage()
}

function onSubmitLoginForm(){
    const username = $("#login_username").val()
    const password = $("#login_password").val()
    for (const user of users){
        if (username === user.username){
            if (password === user.password){
                alert("loged in successfully")
                STATE.gameState.user = username           
                showConfigPage()
            }
            else{
                alert("password is incorrect")
            }
            return
        }
    }
    alert("incorrect username")
}

function onSubmitShootingButton(){
    inputVal.value = document.getElementById("shooting_input").value;
    if(inputVal.value == "ArrowLeft" || inputVal.value == "ArrowRight" 
    || inputVal.value == "ArrowUp" || inputVal.value == "ArrowDown" | inputVal.value == "Escape"){
        alert("Choose different key than arrow keys or ESC")
        return
    }
    CONST.SPACESHIP_CONST.shootingKey = inputVal.value
    CONST.PROJECTILE_CONST.color = document.getElementById("projrctile_color_input").value;
    showGamePage()
}


// page navigation
function showLoginPage(){
    $("div.welcome").hide();
    $("div.login").show();
    $("div.signup").hide();
    $("div.game").hide();
    $("div.modal").hide();
    $("div.config").hide();
    $("div.records").hide();
    $("div.game-over-modal").hide();
    if(STATE.gameState.gameStarted && onGamePage)
        pauseGame()
    onGamePage = false
}

function showSignUpPage(){
    $("div.welcome").hide();
    $("div.login").hide()
    $("div.signup").show();
    $("div.game").hide();
    $("div.modal").hide();
    $("div.config").hide();
    $("div.records").hide();
    $("div.game-over-modal").hide();
    if(STATE.gameState.gameStarted && onGamePage)
        pauseGame()
    onGamePage = false
}

function showGamePage(){
    $("div.welcome").hide();
    $("div.login").hide();
    $("div.signup").hide();
    $("div.game").show();
    $("div.modal").hide();
    $("div.config").hide();
    $("div.records").hide();
    $("div.game-over-modal").hide();
    onGamePage = true
    if(STATE.gameState.gameStarted)
        continueGame()
    else
        startNewGame()
}

function showWelcomePage(){
    $("div.welcome").show();
    $("div.login").hide();
    $("div.signup").hide();
    $("div.game").hide();
    $("div.modal").hide();
    $("div.config").hide();
    $("div.records").hide();
    $("div.game-over-modal").hide();
    if(STATE.gameState.gameStarted && onGamePage)
        pauseGame()
    onGamePage = false
}

function showConfigPage(){
    $("div.welcome").hide();
    $("div.login").hide();
    $("div.signup").hide();
    $("div.game").hide();
    $("div.modal").hide();
    $("div.config").show();
    $("div.records").hide();
    $("div.game-over-modal").hide();
    if(STATE.gameState.gameStarted && onGamePage)
        pauseGame()
    onGamePage = false
}

function showRecordsPage(){
    $("div.welcome").hide();
    $("div.login").hide();
    $("div.signup").hide();
    $("div.game").hide();
    $("div.modal").hide();
    $("div.config").hide();
    $("div.records").show();
    $("div.game-over-modal").hide();
    if(STATE.gameState.gameStarted && onGamePage)
        pauseGame()
    onGamePage = false
}

function showModal(){
    $("div.modal").show();
    isModalShowing = true
    if(STATE.gameState.gameStarted && onGamePage)
        pauseGame()
}

function closeModal(){
    $("div.modal").hide();
    isModalShowing = false
    if(STATE.gameState.gameStarted && onGamePage)
        continueGame()
}

function startNewGame(){
    STATE.gameState.isOver = false
    STATE.gameState.gameStarted = false
    setTimeout(game, 2000);
}

function finishGame(){
    console.log("finished")
    STATE.gameState.isOver = true
}

function pauseGame(){
    console.log("paused")
    STATE.gameState.isStopped = true
}

function continueGame(){
    console.log("continued")
    STATE.gameState.isStopped = false
    setTimeout(game, 2000);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}