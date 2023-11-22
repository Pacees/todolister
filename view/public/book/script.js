const path = window.location.pathname.slice(6)

async function fetchBook(){
    const res = await fetch(`${origin}/operations/books/${path}`);
    const json = await res.json();
    return json;
}
// choosing elements
const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#new-todo");
const clearButton = document.querySelector("#clear-all");
const todoList = document.querySelector(".list");

// Event Listeners
todoForm.addEventListener("submit" , addTodo);
clearButton.addEventListener("click",clearAll)
todoList.addEventListener("click" , clickTodoList)
document.addEventListener("DOMContentLoaded", pageLoaded);

// Functions

async function pageLoaded(){

    // bring all todos
    const json = await fetchBook();
    console.log("Book object");
    console.log(json);
    if(json.error) return window.location.replace(`${origin}/my-books`);

    document.querySelector("#todo-header").innerHTML = json.name;

    for(let todo of json.todos){
        addToUI(todo);
    }

    const todos = document.querySelectorAll(".todo-text");
    const todosArray = Array.from(todos);

    const filtered = todosArray.filter(todo => json.completedTodos.indexOf(todo.value) !== -1);

    for(let completedTodo of filtered) {
        completedTodo.parentElement.className = "list-item completed";
    };
}

function addTodo(e){
    const newTodo = todoInput.value.trim();

    addToUI(newTodo);
    todoInput.value = ""
    addToDB(newTodo);

    e.preventDefault()

};

function addToUI(text){
    // create li
    const li = document.createElement("li");
    li.className = "list-item";

    // create input (text area)
    const textArea = document.createElement("input");
    textArea.type = "text";
    textArea.className = "todo-text";
    textArea.value = text;
    textArea.setAttribute("onkeypress","this.style.width = ((this.value.length + 1) * 8) + 'px';");

    //create buttons
    const todoButtons = document.createElement("div");
    todoButtons.className = "todo-buttons";
    todoButtons.innerHTML= '<button class="save-button">Save</button> <button class="complete-button"><i class="fa-solid fa-check"></i></button> <button class="edit-button"><i class="fa fa-pencil"></i></button> <button class="delete-button">x</button>';

    // places
    li.appendChild((textArea));
    li.appendChild(todoButtons);

    todoList.appendChild(li);

};


async function addToDB(newTodo){

    const res = await fetch(`${origin}/operations/books/${path}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            todo: newTodo
        })
    });
    const json = await res.json();

    if(json.error) return alert("Error\n" + json.error);
    console.log("Yeni Todo Eklendi")

}

function clickTodoList(e){ // All todoList click functions

    // Updating Todo updateForm
    if(e.target.className == "todo-text"){

        e.target.nextElementSibling.firstElementChild.style.display = "inline-block";
        saveButtonListener(e.target.value, e.target);

    } 
    
    // Click Edit Button
    else if (e.target.className == "edit-button" || e.target.className == "fa fa-pencil"){
        const form = e.target.parentElement.parentElement.previousElementSibling;
        form.focus();

        const saveButton = e.target.previousElementSibling?.previousElementSibling || e.target.parentElement.previousElementSibling.previousElementSibling;
        saveButton.style.display = "inline-block";

        let input = e.target.parentElement.previousElementSibling;
        if(input.className === "complete-button") input = e.target.parentElement.parentElement.previousElementSibling;
        
        saveButtonListener(input.value, input);

    } 
    
    // Click delete button
    else if(e.target.className == "delete-button"){
        e.target.parentElement.parentElement.remove();
        const inputValue = e.target.parentElement.previousElementSibling.value;
        deleteFromDB(inputValue);
    }

    // Click complete button
    else if(e.target.className == "fa-solid fa-check"){
        e.target.parentElement.parentElement.parentElement.className = "list-item completed";

        const input = e.target.parentElement.parentElement.previousElementSibling;
        input.setAttribute("disabled" , "");

        completeDB(input.value);
        }
};

async function completeDB(todo){
    
    const res = await fetch(`${origin}/operations/books/${path}`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"completed": todo})
    });

    const json = await res.json();
}

async function deleteFromDB(todoValue){

    const res = await fetch(`${origin}/operations/books/${path}`, {
        method: "PUT",
        headers: {"Content-type": "application/json"},
        body: JSON.stringify({deleteOne: todoValue})
    });
    const json = await res.json();
    if(json.error) alert("Error\n" + json.error);
};

async function clearAll(){
    const json = await fetchBook();

    if(!json.todos || !json.todos.length) return alert("There are no todos to delete");

        if(confirm("All todos will be deleted. Are you confirm?")){

            const todosUI = document.querySelectorAll(".list-item");
    
            todosUI.forEach(function(todo){
                todo.remove();
            });
    
            const res = await fetch(`${origin}/operations/books/${path}/todos`, {
                method: "DELETE"
            })
            
            if(res.status !== 204) {
                alert("Error");
            };
        }
};

function saveButtonListener(firstValue, input){
    console.log(firstValue);
    const saveButton = input.nextElementSibling.firstElementChild

    saveButton.addEventListener("click", async function(e) {

        e.target.style.display = "none";
        const res = await fetch(`${origin}/operations/books/${path}`, {
            method: "PUT",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({
                updateTodoFrom: firstValue,
                to: input.value
            })
        });
        const json = await res.json();
        if(json.error) return alert(json.error);
        alert("Todo updated successfully")
    })
}
