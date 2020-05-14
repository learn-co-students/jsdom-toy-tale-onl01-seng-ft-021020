let addToy = false;
const toyUrl = 'http://localhost:3000/toys'

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
  document.querySelector('.add-toy-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(this);
    let formValues = {} 
    formData.forEach((value, key) => {formValues[key] = value}) 
    toyPost(formValues);
  })
  getToys();
});

function getToys() {
  fetch(toyUrl)
    .then(response => response.json())
    .then(data => addToys(data))
}

function addToys(toys) {
  for(const toy of toys) {
    let toyCard = createToyCard(toy)
    document.getElementById('toy-collection').appendChild(toyCard) 
  };
  likeListener();
}

function addNewToy(toy) {
  let toyCard = createToyCard(toy)
  document.getElementById('toy-collection').appendChild(toyCard) 
  likeListener();
}

function createToyCard(toy) {
  (toy.likes === undefined) ? (toy.likes = 0) : toy.likes; 
  let card = document.createElement('div')  
  card.setAttribute('class', 'card')
  card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src=${toy.image} class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id=${toy.id}>Like <3</button>
    ` 
  return card
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

  return fetch(`${toyUrl}/${event.target.id}`, patchConfig) 
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error))
}

function toyPost(data) {
  let postConfig = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data)
  };
  fetch(toyUrl, postConfig)
    .then(response => response.json())
    .then(data => addNewToy(data))
    .catch(error => console.log(error))
}
