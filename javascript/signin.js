
       
document.addEventListener("DOMContentLoaded", function(){


const signIn = document.getElementById("signIn");
const email = document.getElementById("email");
const password = document.getElementById("password");
const messageDiv = document.getElementById("message");

// clear validation messages when typing starts
email.addEventListener("input", clearMessage);
password.addEventListener("input", clearMessage);

signIn.addEventListener("submit", async (e) => {
    e.preventDefault();
    const check = checkLogin();
    if(! check){
        return
    }  
    
    const formData = {
      email: email.value,
      password: password.value
    };

    try {
        const response = await fetch('http://localhost:5050/api/todousers/login', {
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

      //signIn.reset()


});

//******************login validation**************************
 const checkLogin = () => {
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();

    if(emailValue === ""){
        setErrorFor(email, "email is required");
        return false;
    }else if(!realEmail(emailValue)){
        setErrorFor(email, "email is not real");
        return false;
    }
    else{
        setSuccessFor(email);
    }

    if(passwordValue === ""){
        setErrorFor(password, "password is required");
        return false;
    }else if(!realPassword(passwordValue)){
        setErrorFor(password, "has 8-characters and digit-upper-lowercase-specialCharacter");
        return false;
    }
    else{
        setSuccessFor(password);
        return true;
    }

    
}

function setErrorFor(input, message){
    const loginControl = input.parentElement;
    const small = loginControl.querySelector("small");

    small.innerText = message;

    loginControl.className = "loginfield error";

}

function clearMessage() {
    const loginControl = this.parentElement;
    loginControl.classList.remove("error");
    loginControl.classList.remove("success");
    const small = loginControl.querySelector("small");
    small.innerText = "";
}

function realEmail(email){
    return /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/.test(email);
}

function setSuccessFor(input){
    const loginControl = input.parentElement;
    loginControl.className = "loginfield success";
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
        