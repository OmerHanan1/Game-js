// on load page
let modalShowing;

$(document).ready(function () {
    $("div.welcome").show();
    $("div.login").hide()
    $("div.signup").hide();
    $("div.game").hide();
    $("div.modal").hide();
    modalShowing = false
});

$(document).keyup(function(e) {
    if (e.key === "Escape") { // escape key maps to keycode `27`
        if(modalShowing){
            closeModal()
        }
    }
});

// decalring users
const admin_user = {username:"p",password:"testuser", first_name:"admin", last_name:"admin", email:"admin@admin.test", birth_date: "9/11/2001"}
const users = [admin_user]


// on click events
function onClickLogin(){
    showLoginPage()
}

function onClickSignUp(){
    showSignUpPage()
}

function onClickLogo(){
    showWelcomePage()
}

function onClickAbout(){
    showModal()
}

// on form submit events
function onSubmitSignUpForm(){
    const username = $("#username").val()
    const password = $("#password").val()
    const confirm_password = $("#confirm_password").val()
    const first_name = $("#first_name").val()
    const last_name = $("#last_name").val()
    const email = $("#email").val()
    const birth_date = $("#birth_date").val()

    is_valid = validate_details(username, password, confirm_password, first_name, last_name, email, birth_date)
    if (!is_valid) return

    new_user = {username:username, password:password, first_name:first_name, last_name:last_name, email:email,birth_date:birth_date}
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


// utils

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
    modalShowing = true
}

function closeModal(){
    $("div.modal").hide();
    modalShowing = false
}

function validate_details(username, password, confirm_password, first_name, last_name, email, birth_date){
    if (!isAlphaNumeric(password)){
        alert("password must contain at least 8 characters (digits and letters only)")
        return false
    }
    if (password!==confirm_password){
        alert("password must match confirm password")
        return false
    }
    if (!isLettersOnly(first_name)){
        alert("first name must contain letters only")
        return false
    }
    if (!isLettersOnly(last_name)){
        alert("last name must contain letters only")
        return false
    }
    return true
}

function isAlphaNumeric(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 47 && code < 58) && // numeric (0-9)
            !(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
        }
    }
    return true;
}

function isLettersOnly(str) {
    var code, i, len;

    for (i = 0, len = str.length; i < len; i++) {
        code = str.charCodeAt(i);
        if (!(code > 64 && code < 91) && // upper alpha (A-Z)
            !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
        }
    }
    return true;
}