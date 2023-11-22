console.log(origin);

// selectors
const container = document.querySelector(".all-container");
const userEmail = document.querySelector("#user-email");
const body = document.getElementsByTagName("body")[0];

const fullHeight = document.getElementById("fullheight");
const createContainer = document.getElementById("create-container");
const closeButton = document.getElementById("close-button");

const createForm = document.getElementById("create-form");
const nameInput = document.getElementById("name-input");


function addToUI(book) {
    if(!book) return;

    console.log(book);
    const link = document.createElement("a");
    link.setAttribute("href", `${origin}/book/${book._id}`);
    link.style.textDecoration = "none";
    link.style.color = "black";

    const divBg = document.createElement("div");
    divBg.className = "bg";

    const divContainer = document.createElement("div");
    divContainer.className = "container";

    const header = document.createElement("h1");
    header.innerHTML = book.name;

    // places
    link.appendChild(divBg);
    divBg.appendChild(divContainer);
    divContainer.appendChild(header);
    
    container.appendChild(link);

}


const pageLoaded = async () => {

    const res = await fetch(`${origin}/operations/books`);
    const json = await res.json();
    console.log(json)

    if(json.length) {

        for await (let book of json){
            addToUI(book);
        };
        
    }


    // create add button
    const divAddButton = document.createElement("div");
    divAddButton.className = "add-button";
        
    const divContainer = document.createElement("div");
    divContainer.className = "container";
        
    const header = document.createElement("h1");
    header.innerHTML = "+";
        
    // places
    divAddButton.appendChild(divContainer);
    divContainer.appendChild(header);

    container.appendChild(divAddButton);


    // add button 
    const addButton = document.querySelector(".add-button");

    const addNewBook = (e) => {
        fullHeight.style.display = "block";
        createContainer.style.display = "flex";
    }
    
    addButton.addEventListener("click", addNewBook);


};

const closeForm = e => {

    fullHeight.style.display = createContainer.style.display = "none";
};

const createNewBook = async e => {

    e.preventDefault();

    const name = nameInput.value.trim();
    if(nameInput.value.length > 80) return alert("This header is too long. Please pick up a shorter header");
    nameInput.value = "";

    const res = await fetch(`${origin}/operations/create-book`, {
        method: "POST",
        body: JSON.stringify({
            name
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    });
    const json = await res.json();

    if(json.success) return location.reload()
    alert("There was an error. Please contact with Arda");
}



// Event Listeners
document.addEventListener("DOMContentLoaded", pageLoaded);
closeButton.addEventListener("click", closeForm);
fullHeight.addEventListener("click", closeForm);
createForm.addEventListener("submit", createNewBook);



