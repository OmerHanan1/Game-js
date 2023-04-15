import {shoko} from "./game.js"
import {validate_details} from "./form_validation.js"

// on load page
let isModalShowing;

$(document).ready(function () {
    $("div.welcome").show();
    $("div.login").hide()
    $("div.signup").hide();
    $("div.game").hide();
    $("div.modal").hide();
    shoko()
    isModalShowing = false
});

$(document).keyup(function(e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        if(isModalShowing){
            closeModal()
        }
    }
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



// form submition
$("form.signup-form").submit((event) => {
    event.preventDefault();
    onSubmitSignUpForm();
    return false;
});

$("form.login-form").submit((event) => {
    event.preventDefault();
    onSubmitLoginForm();
    return false;
});


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
                showGamePage()            
            }
            else{
                alert("password is incorrect")
            }
            return
        }
    }
    alert("incorrect username")
}


// page navigation
function showLoginPage(){
    $("div.welcome").hide();
    $("div.login").show();
    $("div.signup").hide();
    $("div.game").hide();
    $("div.modal").hide();
}

function showSignUpPage(){
    $("div.welcome").hide();
    $("div.login").hide()
    $("div.signup").show();
    $("div.game").hide();
    $("div.modal").hide();
}

function showGamePage(){
    $("div.welcome").hide();
    $("div.login").hide();
    $("div.signup").hide();
    $("div.game").show();
    $("div.modal").hide();
}

function showWelcomePage(){
    $("div.welcome").show();
    $("div.login").hide();
    $("div.signup").hide();
    $("div.game").hide();
    $("div.modal").hide();
}

function showModal(){
    $("div.modal").show();
    isModalShowing = true
}

function closeModal(){
    $("div.modal").hide();
    isModalShowing = false
}