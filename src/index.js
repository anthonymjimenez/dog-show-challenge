document.addEventListener("DOMContentLoaded", () => {
  const dogTable = document.getElementById("dog-table");
  const dogName = document.getElementById("dog-name");
  const dogSex = document.getElementById("dog-sex");
  const dogBreed = document.getElementById("dog-breed");
  const dogForm = document.getElementById("dog-form");
  const URL = `http://localhost:3000/dogs`;
  var GLOBALID;

  (() => {
    dogSex.value = "";
    dogBreed.value = "";
    dogName.value = "";
  })();

  const createNode = (elmType) => (str) => {
    const element = document.createElement(elmType);
    element.innerText = str;
    return element;
  };

  const getId = (id) => () => id;

  const createTd = createNode("td");
  const createBtn = createNode("button");

  const editText = (domObj, str) => (domObj.value = str);

  const editDog = async (id) => {
    const dogElement = await getDog(id);
    editText(dogName, dogElement.name);
    editText(dogBreed, dogElement.breed);
    editText(dogSex, dogElement.sex);
    GLOBALID = getId(id);
  };

  async function getDog(id) {
    let response = await fetch(`${URL}/${id}`);

    let dog = await response.json();

    return dog;
  }

  async function getDogs() {
    let response = await fetch(URL);

    let dogs = await response.json();

    return dogs;
  }

  addEventToForm();
  renderDogs();

  async function renderDogs() {
    let dogs = await getDogs();

    dogs.forEach((dog) => {
      const tr = document.createElement("tr");
      const editButton = createBtn("edit");

      editButton.addEventListener("click", () => editDog(dog.id));
      const name = createTd(dog.name);
      const breed = createTd(dog.breed);
      const sex = createTd(dog.sex);

      tr.append(name, breed, sex, editButton);
      tr.id = `A${dog.id}`;
      dogTable.append(tr);
    });
  }

  async function patchDog() {
    configObj = {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: dogName.value,
        breed: dogBreed.value,
        sex: dogSex.value,
      }),
    };

    let dogRes = await fetch(`${URL}/${GLOBALID()}`, configObj);
    let dog = await dogRes.json();
    const [name, breed, sex] = document.querySelector(`#A${dog.id}`).querySelectorAll("td");
    name.innerText = dog.name;
    breed.innerText = dog.breed;
    sex.innerText = dog.sex;
    // console.log(update)
  }

  function addEventToForm() {
    dogForm.addEventListener("submit", (e) => {
      e.preventDefault();
      patchDog();
    });
  }

  renderDogs();
});
