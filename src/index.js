let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyColletion = document.getElementById("toy-collection");
  const submitButton = document.querySelector(".submit");

  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // delegation of click on parent
  toyColletion.addEventListener("click", function addLikes(event) {
    if (event.target.className == "like-btn") {
      let likebutton = event.target.previousElementSibling;
      let likes = parseInt(likebutton.innerText.slice(0, 2));
      likebutton.innerHTML = `${++likes} Likes`;
      updateLikes(likes, event);
    }
  });

  submitButton.addEventListener("click", function createToy(event) {
    event.preventDefault();
    const inputs = document.querySelectorAll(".input-text");
    let toy = {
      name: inputs[0].value,
      image: inputs[1].value,
      likes: 0,
    };
    configurationObject = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(toy),
    };
    // post the new toy to the DB
    fetch("http://localhost:3000/toys", configurationObject)
      .then((response) => response.json())
      .then((json) => {
        renderToy(json);
      });
  });

  fetch("http://localhost:3000/toys")
    .then((response) => response.json())
    .then((json) => {
      data = json;
      for (const entry of json) {
        renderToy(entry);
      }
    });

  function updateLikes(likes, event) {
    configurationObject = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        likes: likes,
      }),
    };
    // Update Likes on the DB
    fetch(`http://localhost:3000/toys/${event.target.id}`, configurationObject);
  }

  function renderToy({ id, name, image, likes } = {}) {
    let html = ` 
  <div class="card">
    <h2>${name}</h2>
    <img src=${image} class="toy-avatar" alt=${name + id} />
    <p>${likes} Likes </p>
    <button id='${id}' class="like-btn">Like <3</button>
  </div>`;
    toyColletion.innerHTML += html;
  }
});