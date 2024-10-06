const login_button = document.getElementById('login_button');

login_button.addEventListener('click', () => {
    login_button.disabled = true;

    const email_input = document.getElementById('email_input');
    const password_input = document.getElementById('password_input');

    const email = email_input.value;
    const password = password_input.value;

    const url = './signup_post';
    const data = { email: email, password: password };

    fetch(url, { body: JSON.stringify(data), method: 'POST', headers: { 'Content-Type': 'application/json' } }).then(response => {
        if (response.status !== 200) {
            throw new Error('Failed to sign up!');
        }

        response.json().then(data => {
            console.log(data);

            if (data.status === 'failed') {
                throw new Error('Failed to sign up!');
            }

            const token = data.token;
            localStorage.setItem('token', token);

            // use this token to authenticate requests
            alert('SignUp successful!');
            window.location.href = '/signin';
        });
    }).catch(error => {
        alert('Failed To SignUp!');
        email_input.value = '';
        password_input.value = '';
        login_button.disabled = false;
    });

});

