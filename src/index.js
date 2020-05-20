let addToy = false;
const toyContainer = document.getElementById("toy-collection")
const createToyForm = document.querySelector('.add-toy-form')
const toysUrl = "http://localhost:3000/toys"
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");

  addToys()

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
});

function addToys() {
  return fetch(toysUrl) 
    .then(resp => resp.json())
    .then(function(json) { 
      json.forEach(toy => createToyCard(toy))
    })
}

function createToyCard(toy) { 
  const toyContainer = document.getElementById("toy-collection")
   
  const card = document.createElement('div')
  card.setAttribute('class', 'card')
  toyContainer.appendChild(card)
  
  const h2 = document.createElement(`h2`)
  h2.innerText = toy.name
  card.appendChild(h2)

  const img = document.createElement(`img`)
  img.setAttribute(`class`, `toy-avatar`)
  img.src = toy.image
  card.appendChild(img)

  const p = document.createElement('p')
  p.innerText = `${toy.likes} Likes`
  card.appendChild(p)

  const likeBtn = document.createElement(`button`)
  
  likeBtn.setAttribute(`class`, `Like-btn`)
  likeBtn.innerText = "Like <3"
  likeBtn.addEventListener('click', () => {
    p.innerText = `${++toy.likes} Likes`
    updateToy(toy)
  })
  card.appendChild(likeBtn)
}
 
function updateToy (toy) {
  return fetch(toysUrl + `/${toy.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toy)
  }).then(resp => resp.json())
}

createToyForm.addEventListener('submit', e => {
  e.preventDefault()
  addNewToy(e)
  createToyForm.reset()
})

const addNewToy = e => {
  let newToy = {
    name: e.target.name.value,
    image: e.target.image.value,
    likes: 0
  }
  createToy(newToy)
}

const createToy = toy => {
  fetch(toysUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(toy)
  })
    .then(resp => resp.json())
    .then(addToys(toy))
}




