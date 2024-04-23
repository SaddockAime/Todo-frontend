


// document.addEventListener("DOMContentLoaded", function () {

//     const editUsers = document.getElementById('editUsers');
//     const editMessages = document.getElementById('editMessages');

//     editUsers.addEventListener('click', function(){
//         window.location.href = 'user.html';
//     });

//     editMessages.addEventListener('click', function() {
//         window.location.href = 'message.html'        
//     })
    
    
//   });


const addForm = document.getElementById('addForm');


function showAdd() {
    addForm.style.display = 'flex';
}

function cancelAdd() {
    addForm.style.display = 'none';
}



document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector(".table tbody");
  
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/todomessage/viewMessages", {
            method: 'GET',
        });
        const responseData = await response.json();
    
        console.log("Data from backend:", responseData);

        const messages = responseData.data;
        
        tableBody.innerHTML = "";
        let count = 1;

        messages.forEach((sender) => {
          const row = `
            <tr>
              <td>${count}</td>
              <td>${sender.name}</td>
              <td>${sender.email}</td>
              <td>${sender.message}</td>
              <td>
                <button class="button-edit" id="editMessage" data-id="${sender._id}"><i class="fa fa-solid fa-pencil"></i></button>
                <button class="button-trash" id="deleteMessage" data-id="${sender._id}"><i class="fa fa-solid fa-trash"></i></button>
              </td>
            </tr>
          `;
          tableBody.innerHTML += row;
          count++;
        });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchMessages();


  // Function to handle delete message
  const deleteMessage = async (event) => {
    try {
        const messageId = event.target.dataset.id;

        const confirmDelete = window.confirm("Are you sure you want to delete this message?");

        if (confirmDelete) {
            const response = await fetch(`http://localhost:5050/api/todomessage/deleteMessage/${messageId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                event.target.closest("tr").remove();
                console.log("Message deleted successfully");
            } else {
                console.error("Error deleting message:", response.statusText);
            }
        }
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};



const editMessage = async (event) => {
    try {
    //   const token = localStorage.getItem("token");
    //     //console.log(token)
    //     if(!token){
    //       console.log("No token was found in local storage");
    //     }
      const userId = event.target.dataset.id;
      console.log('User ID:', userId);

      // Create a form for editing the message
      const editFormContainer = document.createElement("div");
      editFormContainer.style.position = "fixed";
      editFormContainer.style.display = "flex";
      editFormContainer.style.top = "50%";
      editFormContainer.style.left = "50%";
      editFormContainer.style.transform = "translate(-50%, -50%)";
      editFormContainer.style.backgroundColor = "white";
      editFormContainer.style.color = "#000000";
      editFormContainer.style.padding = "1rem";
      editFormContainer.style.border = "1px solid black";
      editFormContainer.style.zIndex = 1000;

      // Create form elements
      const form = document.createElement("form");
      form.id = "editUserForm";

      const label = document.createElement("label");
      label.for = "newName";
      label.textContent = "New name:";

      const input = document.createElement("input");
      input.type = "text";
      input.id = "newName";
      input.name = "newName";
      input.required = true;

      const labelEmail = document.createElement("label");
      labelEmail.for = "newEmail";
      labelEmail.textContent = "New newEmail:";

      const inputEmail = document.createElement("input");
      inputEmail.type = "text";
      inputEmail.id = "newEmail";
      inputEmail.name = "newEmail";
      inputEmail.required = true;

      const labelMessage = document.createElement("label");
      labelMessage.for = "newMessage";
      labelMessage.textContent = "New newMessage:";

      const inputMessage = document.createElement("input");
      inputMessage.type = "text";
      inputMessage.id = "newMessage";
      inputMessage.name = "newMessage";
      inputMessage.required = true;

      const submitButton = document.createElement("button");
        submitButton.type = "submit";
        submitButton.textContent = "Save";

        const cancelButton = document.createElement("button");
        cancelButton.type = "button";
        cancelButton.textContent = "Cancel";
        cancelButton.style.marginLeft = "0.5rem";

        // Add form elements to form
        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(labelEmail);
        form.appendChild(inputEmail);
        form.appendChild(labelMessage);
        form.appendChild(inputMessage);
        form.appendChild(submitButton);
        form.appendChild(cancelButton);

        // Add form to the container
        editFormContainer.appendChild(form);

        // Add the form container to the body
        document.body.appendChild(editFormContainer);

        submitButton.addEventListener("click", async (e) => {
            e.preventDefault();
          

            const newNameInput = document.getElementById('newName');
            const newName = newNameInput.value.trim();
            const newEmailInput = document.getElementById('newEmail');
            const newEmail = newEmailInput.value.trim();
            const newMessageInput = document.getElementById('newMessage');
            const newMessage = newMessageInput.value.trim();

            console.log('New Username:', newName);
            
            const response = await fetch(`http://localhost:5050/api/todomessage/updateMessage/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name: newName, email: newEmail, message: newMessage }),
            });

            if (response.ok) {
                console.log("Message edited successfully");
                editFormContainer.remove();
                window.location.reload();
            } else {
                console.error("Error editing message:", response.statusText);
            }
        });
        cancelButton.addEventListener("click", () => {
            editFormContainer.remove();
        });

    } catch (error) {
      console.error("Error editing message:", error);
    }
  };






const form = document.getElementById("form");
const name = document.getElementById("name");
const email = document.getElementById("email");
const text = document.getElementById("text");

// clear validation messages when typing starts
        name.addEventListener("input", clearMessage);
        email.addEventListener("input", clearMessage);
        text.addEventListener("input", clearMessage);

//contact form
form.addEventListener("submit", (e) => {
    e.preventDefault();

    checkInputs();
});

async function checkInputs(){
    const nameValue = name.value.trim();
    const emailValue = email.value.trim();
    const textValue = text.value.trim();

    if(nameValue === ""){
        setErrorFor(name, "Name is required");

    }else if(!setTextError(nameValue)){
        setErrorFor(name, "not a real name")
    }else if(nameValue.length < 3){
        setErrorFor(name, "insert full name");
    }else{
        setSuccessFor(name);
    }

    if(emailValue === ""){
        setErrorFor(email, "email is required");
    }else if(!realEmail(emailValue)){
        setErrorFor(email, "email is not valid");
    }else{
        setSuccessFor(email);
    }

    if(textValue === ""){
        setErrorFor(text, "message is required");
    }else if(!setTextError(textValue)){
        setErrorFor(text, "write real texts");
    }else if(textValue.length < 15){
        setErrorFor(text, "write a complete message");
    }else{
        setSuccessFor(text);
    }

    if(nameValue !="" & setTextError(nameValue) & 
        !nameValue.length<3 & emailValue !="" & realEmail(emailValue)
        & textValue !="" & setTextError(textValue) & textValue.length>=15){

            const messageData = {
                name: nameValue,
                email: emailValue,
                message: textValue
            };

            try {
                const response = await fetch('http://localhost:5050/api/todomessage/createMessage', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(messageData)
                  });
                  
                  const data = await response.json();
                  console.log('Messages', data);

                  if(response.ok){
                    addForm.style.display = 'none';
                    window.location.reload();
                  }
            } catch (error) {
                console.log('Error', error);
            }
    }
}

function setErrorFor(input, message){
    const contactControl = input.parentElement;
    const small = contactControl.querySelector("small");

    small.innerText = message;

    contactControl.className = "formfield error";
}

function clearMessage() {
    const contactControl = this.parentElement;
    contactControl.classList.remove("error");
    contactControl.classList.remove("success");
    const small = contactControl.querySelector("small");
    //small.innerText = "";
}

function setTextError(text){
    return /^[a-zA-Z\d!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?\s]+$/.test(text);
}

function setSuccessFor(input){
    const contactControl = input.parentElement;
    contactControl.className = "formfield success";
    setTimeout(() => {
        contactControl.className = contactControl.className.replace(" success", "");
    }, 1000);
}

function realEmail(email){
    return /^[a-zA-Z0-9.]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/.test(email);
}





















  document.addEventListener("click", (e) => {
    // e.preventDefault();
    
    if (e.target && e.target.id === "deleteMessage") {
      deleteMessage(e);
    }
    else if(e.target && e.target.id ==="editMessage"){
        editMessage(e);
      }     
  });
});
  