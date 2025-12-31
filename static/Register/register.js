import { postData } from '../postgres_debug/script.js';

async function register() {
    const username = document.getElementById("uname").value
    const password = document.getElementById("psw").value

    // add and to database
    // waring if already in database
    if(!username || !password) {
        document.getElementById("fail").innerHTML = "Enter username and password!"; 
        return;
    }
    try {
        const success = await postData(username, password);
        console.log(success)
        if (success == "test") {
            console.log("Register successful!");
            window.location.href = "/login_site"; // Redirect to Homepage
        } else {
            document.getElementById("fail").innerHTML = "Failed to register! Username already in use.";
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        document.getElementById("fail").innerHTML = "Server error. Try again later.";
    }
}
function showPassword() {
    const password = document.getElementById("psw")
    if(password.type == "password") password.type = "text";
    else if(password.type == "text") password.type = "password";
    else alert("AAAHHHHHHHHHHHH")
}

document.getElementById("showpsw").addEventListener("click", showPassword);
document.getElementById("registerButton").addEventListener("click", register)