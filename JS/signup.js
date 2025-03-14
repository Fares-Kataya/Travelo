document.addEventListener('DOMContentLoaded', function () {
	/*
    -this event fierd after submit the sign up form to validate the signup data then add it to local storge and make cookies 
    */
	/* document.getElementById('signupForm').addEventListener('submit', function (e) {
            e.preventDefault();
            let fullName = document.getElementById('fullName').value.trim();
            let email = document.getElementById('email').value.trim();
            let password = document.getElementById('password').value.trim();
            document
                .querySelectorAll('.error-message')
                .forEach((el) => el.remove());
            let valid = true;
            if (!/^[A-Za-z\s]+$/.test(fullName)) {
                showError('fullName', 'Full name must contain only letters.');
                valid = false;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showError('email', 'Please enter a valid email address.');
                valid = false;
            }
            const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
            if (!passwordPattern.test(password)) {
                showError(
                    'password',
                    'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a symbol (@$#!%*?&) .'
                );
                valid = false;
            }
            function showError(inputId, message) {
                let inputElement = document.getElementById(inputId);
                let errorElement = document.createElement('div');
                errorElement.className = 'error-message text-danger mt-1';
                errorElement.innerText = message;
                inputElement.parentNode.appendChild(errorElement);
            }
            if (valid) {
                let expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 30);
                localStorage.clear();
                localStorage.setItem("user_name",fullName);
                localStorage.setItem("user_email",email);
                localStorage.setItem("user_password",password);
                document.cookie=`user_name=${fullName}; expires=${expireDate.toUTCString()};`;
                document.cookie=`user_email=${email}; expires=${expireDate.toUTCString()};`;
            }
        }); */
});
