
document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.querySelector(".table tbody");
  
    
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5050/api/todousers/viewusers", {
            method: 'GET',
        });
        const responseData = await response.json();
    
        console.log("Data from backend:", responseData);

        const users = responseData.data;
        
        tableBody.innerHTML = "";

        let count = 1;
  
        users.forEach((user) => {
          const row = `
            <tr>
              <td>${count}</td>
              <td>${user.username}</td>
              <td>${user.email}</td>
              <td>
                <button class="button-edit" id="editUser" data-id="${user._id}"><i class="fa fa-solid fa-pencil"></i></button>
                <button class="button-trash" id="deleteUser" data-id="${user._id}"><i class="fa fa-solid fa-trash"></i></button>
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
  
    fetchUsers();


  // Function to handle delete user
  const deleteUser = async (event) => {
    try {
        const userId = event.target.dataset.id;

        const confirmDelete = window.confirm("Are you sure you want to delete this user?");

        if (confirmDelete) {
            const response = await fetch(`http://localhost:5050/api/todousers/deleteUser/${userId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                event.target.closest("tr").remove();
                console.log("User deleted successfully");
            } else {
                console.error("Error deleting user:", response.statusText);
            }
        }
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};


// Function to handle edituser name
  const editUser = async (event) => {
    try {
      const userId = event.target.dataset.id;
      console.log('User ID:', userId);

      // Create a form for editing the user's username
      const editFormContainer = document.createElement("div");
      editFormContainer.style.position = "fixed";
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
      label.for = "newUsername";
      label.textContent = "New Username:";

      const input = document.createElement("input");
      input.type = "text";
      input.id = "newUsername";
      input.name = "newUsername";
      input.required = true;

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
        form.appendChild(submitButton);
        form.appendChild(cancelButton);

        // Add form to the container
        editFormContainer.appendChild(form);

        // Add the form container to the body
        document.body.appendChild(editFormContainer);

        submitButton.addEventListener("click", async (e) => {
            e.preventDefault();
          

            const newUsernameInput = document.getElementById('newUsername');
            const newUsername = newUsernameInput.value.trim();
            console.log('New Username:', newUsername);
            
            const response = await fetch(`http://localhost:5050/api/todousers/editUser/${userId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: newUsername }),
            });

            if (response.ok) {
                console.log("User edited successfully");

                editFormContainer.remove();
            } else {
                console.error("Error editing user:", response.statusText);
            }
        });
        cancelButton.addEventListener("click", () => {
            editFormContainer.remove();
        });

    } catch (error) {
      console.error("Error editing user:", error);
    }
  };

  
  document.addEventListener("click", (e) => {
    e.preventDefault();
    
    if (e.target && e.target.id === "deleteUser") {
      deleteUser(e);
    }     
    
    else if(e.target && e.target.id ==="editUser"){
      editUser(e);
    }
  });
});
  