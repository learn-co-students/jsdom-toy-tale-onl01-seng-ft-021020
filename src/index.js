
let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  
  const addBtn = document.querySelector('#new-toy-btn')
  const toyFormContainer = document.querySelector('.container')


  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  fetchToys();

  form = document.querySelector('.add-toy-form')
  form.addEventListener('submit', submitData)

});

// GET fetch all toy objects.
function fetchToys() {
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(json => createCard(json))
}

function createCard(json) {
  const collection = document.querySelector('div#toy-collection');
  // for each toy
  for (const toy of json) {
    let newDiv = document.createElement('div') // create div
    newDiv.className = "card" // with class = "card"
    newDiv.id = toy.id
    createName(toy, newDiv)
    createPhoto(toy, newDiv)
    totalLikes(toy, newDiv)
    addButton(toy, newDiv)
    collection.appendChild(newDiv); // append to toyCollection
  }
}

// h2 tag with the toy's name
function createName(toy, card) {
  let name = document.createElement('h2')
  name.innerText = toy.name
  card.appendChild(name)
}

// img tag with: src of the toy's image // class of "toy-avatar"
function createPhoto(toy, card) {
  let img = document.createElement('img')
  img.src = toy.image
  img.className = "toy-avatar"
  card.appendChild(img)
}

// p tag with total likes
function totalLikes(toy, card) {
  let likes = document.createElement('p')
  likes.innerHTML = `<span>${toy.likes} </span> likes`
  card.appendChild(likes)
}

// button with class="like-btn"
function addButton(toy, card) {
  let newButton = document.createElement('button')
  newButton.addEventListener('click', function() {
    increaseCount(toy);
  })
  newButton.className = "like-btn"
  newButton.style = "width: 30px;height:30px;cursor:pointer;"
  newButton.innerText = "♥"
  card.appendChild(newButton)
}

// POST fetch() request sent to http://localhost:3000/toys


function submitData() {

  let formData = {
    "name": document.querySelectorAll('.input-text')[0].value,
    "image": document.querySelectorAll('.input-text')[1].value,
    "likes": "0"
  }

  let configObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(formData)
  };

  fetch("http://localhost:3000/toys", configObj)
      .then(response => response.json())
      .then(json => console.log(json))
}

function increaseCount(toy) {
  let span = document.getElementById(`${toy.id}`).querySelector("span")
  let previewsLikes = parseInt(span.innerText, 10)
  previewsLikes += 1
  span.innerText = previewsLikes.toString()

  let configObj = {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
          "likes": parseInt(toy.likes) + 1
        })
  };


fetch(`http://localhost:3000/toys/${toy.id}`, configObj)
}
