document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('login-form-submit').addEventListener('click', function() {
        // Get the username and password input values
        let username = document.getElementById('username').value;
        let password = document.getElementById('password').value;
        
        // Check the username and password
        if (username === 'user' && password === '123') {
            console.log('Login successful');
            
            // Show the success modal if login is successful
            var success = new bootstrap.Modal(document.getElementById('login_success'), {
                keyboard: true
            });
            success.show();
        } else {
            // Handle login failure (e.g., show an error message)
            var failed = new bootstrap.Modal(document.getElementById('login_failed'), {
                keyboard: false
            });
            failed.show();
        }
    });
});
