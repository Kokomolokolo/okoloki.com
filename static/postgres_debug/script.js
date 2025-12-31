export async function fetchData() {
    const response = await fetch('/data');
    const data = await response.json();
    console.log(data)
}

export async function postData(username, password) {
    const data = { username, password };
  
    return fetch('/post_data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(result => {
      return "test";
    })
    .catch(error => {
      return 401;
    });
  }
  

export async function deleteData(username, password) {
    const data = {
        username,
        password
    }
    try {
        const response = await fetch('/delete_data', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
	    credentials: "include"
        });

        const result = await response.json();
        console.log('Server Response:', result);

        if (response.ok) {
            return 200;
            // wieterleiten shit
        } else {
            return (401, result.error);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

export async function loginUser(username, password) {
    const data = {
        username,
        password
    }
    
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
	    credentials: "include"
        });

        const result = await response.json();
        console.log('Server Response:', result);

        if (response.ok) {
            return 200;
            // wieterleiten shit
        } else {
            return (401, result.error);
        }
    } catch (error) {
        console.error('Network error:', error);
    }
}

