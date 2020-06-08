let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
      toyFormContainer.addEventListener("submit",function(event){
        event.preventDefault()
        AddToy(event.target)
      })
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  retrieveData()

});


function retrieveData(){
  let configObj = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
  };

  return fetch("http://localhost:3000/toys", configObj)
  .then(function(response){
    // debugger
    return response.json()
  })
  .then(function(object){
  
    object.forEach(toy => createToy(htmlify(toy)))
  })

}

function createToy(htmlToy){
  
  let allToys = document.getElementById("toy-collection")
  let divElem = document.createElement('div')
  divElem.className = "card"
  divElem.innerHTML += htmlToy
  
  allToys.appendChild(divElem)
  likeListener()
}

function htmlify(toy){
  return (
    `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes </p>
      <button class="like-btn">Like <3</button>
   `)
}

function AddToy(newToy){
  debugger
  let configObj = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      name: newToy.name.value, 
      image: newToy.image.value, 
      likes: 0
    })
  }

    return fetch('http://localhost:3000/toys', configObj)
    .then(function(response){
      return response.json()
    })
    .then(function(object){
      createToy(htmlify(object))
    })
}

function likeListener() {
  document.querySelectorAll('.like-btn').forEach(lbtn => {
    lbtn.addEventListener('click', addLike)
  });
}

function addLike(event) {
  let newCount = parseInt(event.target.previousElementSibling.textContent.split(" ")[0]) + 1;
  event.target.previousElementSibling.textContent = `${newCount} Likes`;
  let patchConfig = {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      "Access-Control-Allow-Origin": '*'
    },
    body: JSON.stringify({ "likes": newCount })
  };
  debugger
  return fetch(`http://localhost:3000/toys/${event.target.id}`, patchConfig) 
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}