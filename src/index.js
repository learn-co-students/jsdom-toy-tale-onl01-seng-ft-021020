let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  toyFormContainer.addEventListener("submit", addNewToy);
  getToyCollection();
  toyCollection.addEventListener("click", checkLikeButton);
});

function checkLikeButton(event) {
    if (event.target.className === "like-btn") {
        incrementLikes(event);
    }
}

function addNewToy(event) {
    event.preventDefault();
    const [nameNode, urlNode] = event.target.querySelectorAll(".input-text");
    const newToyObject = {name: nameNode.value, image: urlNode.value, likes: 0};
    fetch("http://localhost:3000/toys", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(newToyObject)
    })
        .then(resp => resp.json())
        .then(data => createToyCard(data))
        .then(() => {
            nameNode.value = "";
            urlNode.value = "";
            this.style.display = "none";
        })
}

function getToyCollection(){
    let configObj = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    }

    return fetch("http://localhost:3000/toys", configObj)
        .then(function(response){
            return response.json();
        })
        .then(function(object){
            object.forEach(object => createToyCard(object))
        })
}

function createToyCard(object){
    let div = document.createElement("div");
    let h2 = document.createElement("h2");
    let image = document.createElement("img");
    let p = document.createElement("p");
    let button = document.createElement("button");
    let toyCollection = document.getElementById("toy-collection");

    div.className = "card";
    div.id = `${object.id}`;
    image.className = "toy-avatar";
    button.className = "like-btn";

    h2.textContent = object.name;
    image.src = object.image;
    p.textContent = `${object.likes} Likes`
    button.textContent = "Like <3";

    // button.addEventListener("click", incrementLikes);

    div.appendChild(h2);
    div.appendChild(image);
    div.appendChild(p);
    div.appendChild(button);
    toyCollection.appendChild(div);
}

function incrementLikes(event) {
    p = event.target.parentElement.querySelector("p");
    let likeNumber = parseInt(p.textContent.split(" ")[0]);
    const id = event.target.parentElement.id
    likeNumber += 1;
    p.textContent = `${likeNumber} Likes`;
    fetch(`http://localhost:3000/toys/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            "likes": likeNumber
        })
    })
}