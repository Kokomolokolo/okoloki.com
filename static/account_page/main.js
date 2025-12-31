import { deleteData } from '../postgres_debug/script.js';



async function delete_data() {
    const username = document.querySelector("#username").textContent.trim();
    const password = document.querySelector("#password").value; 

    if(!username || !password) {
        return;
    }
    try {
        const status = await deleteData(username, password);
        if (status === 200) {
            document.getElementById("fail").innerHTML = "Account deleted successfully!";
            window.location.href = "/logout"
        } else {
            document.getElementById("fail").innerHTML = "Invalid credentials.";
        }
    } catch (error) {
        console.error("Unexpected error:", error);
        document.getElementById("fail").innerHTML = "Server error. Try again later.";
    }
    
}


document.querySelector("#delete-button").addEventListener("click", delete_data)