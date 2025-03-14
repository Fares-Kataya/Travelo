document.addEventListener('DOMContentLoaded', function () {
	/*
    -this event fierd after submit the login form to validate the log data then make cookies 
    */
	/*  document.getElementById('loginForm').addEventListener('submit', function (e) {
            e.preventDefault();
            let email = document.getElementById('email').value.trim();
            let password = document.getElementById('password').value.trim();
            document
                .querySelectorAll('.error-message')
                .forEach((el) => el.remove());
            let valid = true;
           if(email!==localStorage.getItem("user_email")||password!==localStorage.getItem("user_password")){
            showError(
                'email',
                'Enter valid email and password'
            )
            valid=false;
           }
            function showError(inputId, message) {
                let inputElement = document.getElementById(inputId);
                let errorElement = document.createElement('div');
                errorElement.className = 'error-message text-danger mt-1';
                errorElement.innerText = message;
                inputElement.parentNode.appendChild(errorElement);
            }
            if (valid) {
                let fullName=localStorage.getItem("user_name")
                let email=localStorage.getItem("user_email")
                let expireDate = new Date();
                expireDate.setDate(expireDate.getDate() + 30);
                document.cookie=`user_name=${fullName}; expires=${expireDate.toUTCString()};`;
                document.cookie=`user_email=${email}; expires=${expireDate.toUTCString()};`;
            }
        }); */
});
