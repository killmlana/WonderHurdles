const login_button = document.getElementById('login_button');

login_button.addEventListener('click', () => {
    login_button.disabled = true;

    const email_input = document.getElementById('email_input');
    const password_input = document.getElementById('password_input');

    const email = email_input.value;
    const password = password_input.value;

    const url = './login_post'; 
    const data = { email: email, password: password };

    fetch(url, {
        body: JSON.stringify(data),
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Invalid email or password!'); 
        }
    })
    .then(data => {
        console.log(data);

        if (data.status === 'failed') {
            throw new Error('Invalid email or password!');
        }

        const token = data.token;
        localStorage.setItem('token', token);

        // Use this token to authenticate subsequent requests
        alert('Login successful!');
        // Redirect to another page or update UI after successful login
        window.location.href = '/modules';
    })
    .catch(error => {
        alert(error.message); // Alert with the error message
        email_input.value = '';
        password_input.value = '';
        login_button.disabled = false;
    });
});

