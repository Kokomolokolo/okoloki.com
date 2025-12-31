function postToDB(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username")
    const password = formData.get("password")
    console.log(username, password)
    fetch("/post_data", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Server", data);
    });
}

function deleteData(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const username = formData.get("username")
    const password = formData.get("password")
    fetch("/delete_data", {
        method: "DELETE",
        headers: {
           "Content-Type": "application/json"
        },
        body: JSON.stringify({
           username: username,
           password: password
        })
    })
    .then(response => response.json())
    .catch(error => console.log('ERROR:', error))
}
