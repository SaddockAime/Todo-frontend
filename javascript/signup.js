

    document.addEventListener("DOMContentLoaded", function(){

        const signUp = document.getElementById("signUp");
        const username = document.getElementById("username");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const messageDiv = document.getElementById("message");

        // clear validation messages when typing starts
        username.addEventListener("input", clearMessage);
        email.addEventListener("input", clearMessage);
        password.addEventListener("input", clearMessage);
        
        //validating signup form and storing info on local storage
        signUp.addEventListener("submit", async (e) => {
            e.preventDefault();
        
            checkSignIn();
        });
        
        const checkSignIn = async () => {
            const usernameValue = username.value.trim();
            const emailValue = email.value.trim();
            const passwordValue = password.value.trim();

            if(usernameValue === ""){
                setErrorFor(username, "your name is required");
        
            }else if(!setTextError(usernameValue)){
                setErrorFor(username, "insert a good username")
            }else if(usernameValue.length < 3){
                setErrorFor(username, "insert complete username");
            }else{
                setSuccessFor(username);
            }
        
            if(emailValue === ""){
                setErrorFor(email, "email is required");
            }else if(!realEmail(emailValue)){
                setErrorFor(email, "email is not real");
            }else{
                setSuccessFor(email);
            }
        
            if(passwordValue === ""){
                setErrorFor(password, "password is required");
            }else if(!realPassword(passwordValue)){
                setErrorFor(password, "has 8-characters and digit-upper-lowercase-specialCharacter");
            }else{
                setSuccessFor(password);
            }

            if(usernameValue != "" & setTextError(usernameValue) &
                usernameValue.length > 2 & emailValue != "" & realEmail(emailValue) & 
                passwordValue != "" & realPassword(passwordValue)){
                    const formData = {
                        username: usernameValue,
                        email: emailValue,
                        password: passwordValue
                    };
                    try {
                        const response = await fetch('http://localhost:5050/api/todousers/signup', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json'
                          },
                          body: JSON.stringify(formData)
                        });
                  
                        const data = await response.json();
                        messageDiv.textContent = data.message;
                        if (response.status === 200) {
                            // Save JWT token in localStorage and redirect to home page
                            localStorage.setItem('token', data.token);
                            window.location.href = 'index.html';
                          }
                      } catch (error) {
                        console.error('Error', error);
                      }
            signUp.reset();
        }       
        }
        
        function setErrorFor(input, message){
            const signupControl = input.parentElement;
            const small = signupControl.querySelector("small");
        
            small.innerText = message;
        
            signupControl.className = "signupfield error";
        
        }

        function clearMessage() {
            const signupControl = this.parentElement;
            signupControl.classList.remove("error");
            signupControl.classList.remove("success");
            const small = signupControl.querySelector("small");
            small.innerText = "";
        }

        function setTextError(text){
            return /^[A-Za-z]+[A-Za-z0-9.@_-]+$/.test(text);
        }
        
        function realEmail(email){
            return /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/.test(email);
        }
        
        function setSuccessFor(input){
            const signupControl = input.parentElement;
            signupControl.className = "signupfield success";
            setTimeout(() => {
                signupControl.className = signupControl.className.replace(" success", "");
            }, 5000);
        }
        
        function realPassword(password){
            const minLength = 8;
            const hasUpperCase = /[A-Z]/.test(password);
            const hasLowerCase = /[a-z]/.test(password);
            const hasNumber = /\d/.test(password);
            const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
        
            if (password.length >= minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
                return true;
            } else {
                return false;
            }
        }


});