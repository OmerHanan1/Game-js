export function validate_details(username, password, confirm_password, first_name, last_name, email, birth_date){
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