import { loginUser } from '../postgres_debug/script.js';


async function login() {
    const username = document.getElementById("uname").value
    const password = document.getElementById("psw").value

    // add and to database
    console.log(username, password)
    // waring if already in database
    if(!username || !password) {
        document.getElementById("fail").innerHTML = "Enter username and password!"; 
        return;
    }
    try {
        const success = await loginUser(username, password);
        console.log(success)
        if (success == 200) {
            console.log("Login successful!");
            window.location.href = "/"; // Redirect to another page
        } else {
            document.getElementById("fail").innerHTML = "Username or password is incorrect!";
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        document.getElementById("fail").innerHTML = "Server error. Try again later.";
    }
}
// Ich hab keine Ahnung wie man das mit "Remember me" macht. Also wird sich die ip addresse gemerkt oder wie soll das gehen?
// if(document.getElementById("remMe").checked == "true") console.log("hmmmm")


function showPassword() {
    const password = document.getElementById("psw")
    if(password.type == "password") password.type = "text";
    else if(password.type == "text") password.type = "password";
    else alert("AAAHHHHHHHHHHHH")
}

document.getElementById("showpsw").addEventListener("click", showPassword);
document.getElementById("loginButton").addEventListener("click", login)