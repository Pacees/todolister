const tbody = document.getElementById("tbody");

document.addEventListener("DOMContentLoaded", pageLoaded);

async function pageLoaded(){
    const res = await fetch(`${origin}/operations/books`);
    const json = await res.json();
    
    for await(let book of json){
        addToUI(book);
    };

    document.getElementById("tbody").addEventListener("click", async function (e){
        if(e.target.className === "change-name"){

            const answer = prompt("Change name to", e.target.parentElement.previousElementSibling.previousElementSibling.innerHTML);
            if(!answer){}
            else {
                const id = e.target.parentElement.previousElementSibling.previousElementSibling.previousElementSibling.innerHTML;
                const res = await fetch(`${origin}/operations/books/${id}`, {
                    method: "PUT",
                    headers: {"Content-type": "application/json"},
                    body: JSON.stringify({
                        changeName: answer
                    })
                });
    
                const json = await res.json();
                console.log(json);
                window.location.reload();

        };
        } else if(e.target.className === "delete"){
            const id = e.target.parentElement.parentElement.firstElementChild.innerHTML;

            if(confirm("Are you sure to permamently delete this book?")){
                const res = await fetch(`${origin}/operations/books/${id}`, {method: "DELETE"});
                const json = await res.json();
                console.log(json);
                location.reload();
            };

        }


    });
}

function addToUI(book) {
    if(!book) return;

    const tr = document.createElement("tr");

    const idtd = document.createElement("td");
    idtd.innerHTML = book._id;

    const nametd = document.createElement("td");
    nametd.innerHTML = book.name;

    const todostd = document.createElement("td");
    todostd.innerHTML = book.todos.length;

    const operationstd = document.createElement("td");
    operationstd.innerHTML = '<a href="#c" class="change-name">Change Name</a><a href="#d" class="delete">Delete</a>'

    tr.appendChild(idtd);
    tr.appendChild(nametd);
    tr.appendChild(todostd);
    tr.appendChild(operationstd);

    tbody.appendChild(tr);
}