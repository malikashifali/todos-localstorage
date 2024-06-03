// empty field values 
const emptyFieldValues = () => {
    document.getElementById("title").value = ""
    document.getElementById("location").value = ""
    document.getElementById("description").value = ""
}

// set field values 
const setFieldValues = (id, value) => {
    return document.getElementById(id).value = value
}

// get field value 
const getFieldValue = id => document.getElementById(id).value

// show output function
const showOutput = (output) => {
    document.getElementById("output").innerHTML = output
}

// toastify notification 
const showNotification = (msg, type) => {

    let bgColor;

    switch (type) {
        case "success":
            bgColor = "linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%)";
            break;
        case "error":
            bgColor = "linear-gradient(to right, #f9d423 0%, #ff4e50 100%)";
            break;

        default:
            break;
    }

    Toastify({
        text: msg,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: bgColor
        },
        onClick: function () { } // Callback after click
    }).showToast();
}

// handle Submit 
const handleSubmit = () => {
    event.preventDefault()

    let title = document.getElementById("title").value;
    let location = document.getElementById("location").value;
    let description = document.getElementById("description").value;

    title = title.trim();
    location = location.trim();
    description = description.trim();

    if (title.length < 3) {
        alert("Please enter title correctly");
        return;
    }
    if (location.length < 3) {
        alert("Please enter location correctly");
        return;
    }
    if (description.length < 3) {
        alert("Please enter description correctly");
        return;
    }

    let user = { title, location, description };

    user.id = Math.random().toString(36).slice(2);
    user.dateCreated = new Date().getTime();
    user.status = "active";

    const users = JSON.parse(localStorage.getItem("users")) || [];

    users.push(user);

    localStorage.setItem("users", JSON.stringify(users));

    showNotification("User has been successfully added", "success");
    emptyFieldValues();
    outputTable();
}

// Show Output
const outputTable = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (!users.length) {
        showOutput(`<h5 class="text-center p-5">Hurray! there is no single user available</h5>`);
        return;
    }

    let tableStartingCode = `<div class="table-responsive"><table class="table text-center">`;
    let tableHead = `<tr><th>#</th><th>Title</th><th>Location</th><th>Description</th><th>Actions</th></tr>`;
    let tableEndingCode = `</table></div>`;
    let tableBody = "";
    users.forEach((todo, index) => {
        tableBody += `<tr><td>${index + 1}</td><td>${todo.title}</td><td>${todo.location}</td><td>${todo.description}</td><td><button class='btn btn-sm btn-info' data-value='${todo.id}' onClick='editTodo(event)'>Edit</button><button class='btn btn-sm ms-2 btn-danger' data-value='${todo.id}' onClick='handleDelete(event)'>Delete</button></td></tr>`;
    });
    let table = tableStartingCode + tableHead + tableBody + tableEndingCode;
    showOutput(table);
}

// handle delete 
const handleDelete = (event) => {
    let todoId = event.target.getAttribute('data-value');

    const todos = JSON.parse(localStorage.getItem("users"));
    let todosAfterDelete = todos.filter((todo) => {
        return todo.id !== todoId;
    });

    localStorage.setItem("users", JSON.stringify(todosAfterDelete));
    showNotification("User has been successfully deleted", "success");
    outputTable();
}

// edit todo 
const editTodo = (event) => {
    let todoId = event.target.getAttribute('data-value');

    const todos = JSON.parse(localStorage.getItem("users"));

    let todo = todos.find((todo) => {
        return todo.id == todoId;
    });

    const { title, location, description } = todo;

    setFieldValues("title", title);
    setFieldValues("location", location);
    setFieldValues("description", description);

    localStorage.setItem("todoForEdit", JSON.stringify(todo));

    document.getElementById("addTaskBtn").style.display = "none";
    document.getElementById("editTaskBtn").style.display = "block";
}

// handle Edit 
const handleEdit = () => {
    const users = JSON.parse(localStorage.getItem("users"));

    const todoForEdit = JSON.parse(localStorage.getItem("todoForEdit"));

    let updatedTitle = getFieldValue("title");
    let updatedLocation = getFieldValue("location");
    let updatedDescription = getFieldValue("description");

    const updatedTodo = { ...todoForEdit, title: updatedTitle, location: updatedLocation, description: updatedDescription };

    updatedTodo.dateModified = new Date().getTime();

    const updatedUsers = users.map((user) => {
        if (user.id === updatedTodo.id) {
            return updatedTodo;
        }
        return user;
    });

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    showNotification("User has been successfully updated", "success");
    emptyFieldValues();
    document.getElementById("addTaskBtn").style.display = "block";
    document.getElementById("editTaskBtn").style.display = "none";
    outputTable();
}

// window onload function 
window.onload = () => {
    let userName = prompt("please enter your name")
    console.log(userName)

    !userName ?  document.getElementById("user").innerHTML = "unknown user" : document.getElementById("user").innerHTML = userName
    
    outputTable();
    document.getElementById("year").innerHTML = new Date().getFullYear();
}