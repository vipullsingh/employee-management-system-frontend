
document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.querySelector('.card-front .section form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        const email = document.getElementById('logemail').value;
        const password = document.getElementById('logpass').value;

        // Make AJAX request to login endpoint
        fetch('https://employee-mangement-system.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Login request failed.');
                }
            })
            .then(function (data) {
                // Handle successful login
                let key = data.token;
                localStorage.setItem("token", key)
                console.log(data.message);
                alert(data.message)
                window.location.href = "./dashboard.html"
                // Redirect or perform other actions as needed
            })
            .catch(function (error) {
                // Handle login error
                console.error(error);
                alert(error)
                // Display error message to the user or perform other error handling
            });
    });

    const signupForm = document.querySelector('.card-back .section form');
    signupForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent form submission

        const email = document.getElementById('regemail').value;
        const password = document.getElementById('regpass').value;
        const confPass = document.getElementById('confirmlogpass').value;

        if (password != confPass) alert('Password are not same');

        // Make AJAX request to signup endpoint
        fetch('https://employee-mangement-system.onrender.com/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Signup request failed.');
                }
            })
            .then(function (data) {
                // Handle successful signup
                console.log(data.message);
                alert(data.message)
                // Redirect or perform other actions as needed
            })
            .catch(function (error) {
                // Handle signup error
                console.error(error);
                // Display error message to the user or perform other error handling
            });
    });
});
