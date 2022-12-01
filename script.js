function createMovieElement({ score, title, summary, year }) {
  let mainDiv = document.createElement("div");
  mainDiv.id = title;

  mainDiv.insertAdjacentHTML(
    `beforeEnd`,
    `
  <div class="card" >
  <div class="card-header text-white">Nota: ${score}/10</div>
  <div class="card-body">
    <h5 class="card-title text-light">${title}</h5>
    <p class="card-text">
      ${summary}
    </p>
    <div class="card-footer">Lancamento: ${year}</div>
  </div>
  `
  );
  return mainDiv;
}

async function getMovieList() {
  //   list films prime video;
  let url = "https://imdb-api.com/en/API/IMDbList/k_4i6sjtv3/ls563191619";
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const movieList = await fetch(url, requestOptions)
    .then((response) => response.json())
    .catch((error) => console.log("error", error));

  return movieList;
}
async function getMovie(idIMDb) {
  let urlBase = "https://imdb-api.com/API/Wikipedia/k_4i6sjtv3/";
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  let response = await fetch(urlBase + idIMDb, requestOptions);

  return response.json();
}

async function fillData() {
  const moviesList = await getMovieList();
  for (i = 0; i < 10; i++) {
    let summary = await getMovie(moviesList.items[i].id);
    if (summary != "" && summary != undefined) {
      let movie = {
        title: moviesList.items[i].title,
        summary:
          summary.plotShort.plainText === ""
            ? "Sem resumo"
            : summary.plotShort.plainText,
        year: moviesList.items[i].year,
        score: moviesList.items[i].imDbRating,
      };
      setFilme(movie);
    }
  }
  document.getElementById("importIMDb").style.display = "none";
  refreshPage();
}

//adicionar filme no localStorage
function setFilme(movie) {
  localStorage.setItem(movie.title, JSON.stringify(movie));
}
const refreshPage = () => {
  const body = document.getElementById("moviesList");
  body.replaceChildren();
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = JSON.parse(localStorage.getItem(key));
    body.appendChild(createMovieElement(value));
  }
};

//Verificacao dos campos do formulario para adicionar um filme
function verifyTitle() {
  let spanAlert = document.getElementById("spanAlertTitle");
  let inputTitle = document.getElementById("inputTitle");
  let itsEmpity =
    document.getElementById("inputTitle").value === "" ? false : true;

  if (itsEmpity) {
    spanAlert.style.display = "none";
    inputTitle.style.cssText = `border-color:rgba(0,255,0,.5);
                       transition: 0.15s`;

    let item = document.getElementById("inputTitle");
    if (localStorage.getItem(item.value)) {
      spanAlert.innerText = "Filme ja existe";
      spanAlert.style.display = "block";
      inputTitle.style.cssText = `border-color:rgba(255,0,0,.5);
                                  transition: 0.15s`;
      return false;
    }
    return itsEmpity;
  } else {
    spanAlert.style.display = "block";
    inputTitle.style.cssText = `border-color:rgba(255,0,0,.5);
                       transition: 0.15s`;
    return itsEmpity;
  }
}
function verifyNewTitle() {
  let oldTitle = document.getElementById("inputGroupSelect01").value;
  let newTitle = document.getElementById("editMovieTitleId");
  let spanAlert = document.getElementById("spanAlertNewTitle");
  if (oldTitle === newTitle.value) {
    spanAlert.style.display = "none";
    return true;
  } else if (localStorage.getItem(newTitle.value)) {
    spanAlert.style.display = "block";
    return false;
  } else {
    spanAlert.style.display = "none";
    return true;
  }
}
function verifySummary() {
  let itsEmpity =
    document.getElementById("inputSummary").value === "" ? false : true;
  if (itsEmpity) {
    document.getElementById("spanAlertSummary").style.display = "none";
    document.getElementById(
      "inputSummary"
    ).style.cssText = `border-color:rgba(0,255,0,.5);
                       transition: 0.15s`;
    return itsEmpity;
  } else {
    document.getElementById("spanAlertSummary").style.display = "block";
    document.getElementById(
      "inputSummary"
    ).style.cssText = `border-color:rgba(255,0,0,.5);
                       transition: 0.15s`;
    return itsEmpity;
  }
}
function verifyYear() {
  let alertYear = document.getElementById("spanAlertYear");
  let yearElement = document.getElementById("inputYear");
  if (yearElement.value > 2100 || yearElement.value < 1894) {
    alertYear.style.display = "block";
    yearElement.style.cssText = `border-color:rgba(255,0,0,.5);
                                    transition: 0.15s`;
    return false;
  } else {
    alertYear.style.display = "none";
    yearElement.style.cssText = `border-color:rgba(0,255,0,.5);
                                   transition: 0.15s`;
    return true;
  }
}
function verifyNewYear() {
  let alertYear = document.getElementById("spanAlertNewYear");
  let yearElement = document.getElementById("inputNewYear");
  if (yearElement.value > 2100 || yearElement.value < 1894) {
    alertYear.style.display = "block";
    yearElement.style.cssText = `border-color:rgba(255,0,0,.5);
                                    transition: 0.15s`;
    return false;
  } else {
    alertYear.style.display = "none";
    yearElement.style.cssText = `border-color:rgba(0,255,0,.5);
                                   transition: 0.15s`;
    return true;
  }
}
function verifyScore() {
  let score = document.getElementById("inputScore").value;
  let prev = document.getElementById("showPreview");
  prev.innerText = "Nota: " + score;
  if (score === "") {
    return false;
  } else {
    return true;
  }
}
function verifyNewScore() {
  let score = document.getElementById("inputNewScore").value;
  let prev = document.getElementById("showNewPreview");
  prev.innerText = "Nota: " + score;
  if (score === "") {
    return false;
  } else {
    return true;
  }
}

//limpa o formulario
function formReset() {
  let form = document.getElementById("formAdd");

  document.getElementById("spanAlertYear").style.cssText = `display: none `;
  document.getElementById("spanAlertTitle").style.cssText = `display: none`;
  document.getElementById("spanAlertSummary").style.cssText = `display: none`;

  document.getElementById("inputYear").style.cssText = `border: `;
  document.getElementById("inputTitle").style.cssText = `border:`;
  document.getElementById("inputSummary").style.cssText = `border:`;

  document.getElementById("inputScore").value = "";
  document.getElementById("showPreview").innerText = "Nota:";

  form.reset();
}
function resetEdit() {
  document.getElementById("spanAreaEditMovie").replaceChildren();
}
function checkForm() {
  let valid = verifyTitle() && verifySummary() && verifyYear();
  return valid;
}
function submitFormAddMovie() {
  let isValid = checkForm();
  if (isValid === true) {
    let title = document.getElementById("inputTitle");
    let summary = document.getElementById("inputSummary");
    let year = document.getElementById("inputYear");
    let score = document.getElementById("inputScore");
    let p = document.getElementById("textConfirmNewMOv");
    $("#modalAdicionar").modal("hide");
    $("#modalAddMovieCheck").modal("show");

    p.innerHTML = `Nome do filme: ${title.value}<br>
                  Resumo: ${summary.value}<br>
                  Lançamento ${year.value}<br>
                  Nota: ${score.value}<br>`;
    let cofirm = document.getElementById("checkedInfoAddMovie");
    cofirm.addEventListener("click", () => {
      setFilme({
        title: title.value,
        summary: summary.value,
        year: year.value,
        score: score.value,
      });

      $("#modalAddMovieCheck").modal("hide");
      formReset();
      refreshPage();
    });
    document
      .getElementById("checkedInfoAddBack")
      .addEventListener("click", () => {
        $("#modalAdicionar").modal("show");
        $("#modalAddMovieCheck").modal("hide");
      });
  }
}

//Editar Filme
function editMovie() {
  let movieToEdit = document.getElementById("inputGroupSelect01").value;
  let selectMovie = document.getElementById("spanAreaEditMovie");

  if (movieToEdit === "") {
    selectMovie.replaceChildren();
    selectMovie.insertAdjacentHTML(
      "beforeEnd",
      ` 
    <span class="spanAlert" style='display:block'>Filme Invalido</span>
    `
    );
  } else {
    selectMovie.replaceChildren();
    let movie = JSON.parse(localStorage.getItem(movieToEdit));
    selectMovie.insertAdjacentHTML(
      "beforeEnd",
      `
    <form
    id='formEdit'>
    <div class="form-group">
      <label for="inputTitle">Nome do Filme</label>
      <input
        type="text"
        class="form-control" placeholder="Nome do Filme" id="editMovieTitleId" value= '${movie.title}' />
        <span  class="spanAlert" id="spanAlertNewTitle">Filme ja existe</span>
    </div>
    <div class="form-group">
      <label for="inputNewSummary">Resumo do Filme</label>
      <textarea
        type="textarea"
        class="form-control"
        id="inputNewSummary"
        placeholder="Resumo do Filme"
      >${movie.summary}</textarea>

    </div>
    <div class="form-group">
      <label for="inputNewYear">Ano de Lancamento</label>
      <input
        type="number"
        min="1800"
        max="2050"
        class="form-control"
        id="inputNewYear"
        placeholder="Ano de Lancamento"
        onkeyup="verifyNewYear()"
        value="${movie.year}"
      />
      <span class="spanAlert" id="spanAlertNewYear"
        >Digite um ano valido</span
      >
    </div>
    <div class="form-group">
      <label for="inputScore" id="showNewPreview">Nota: ${movie.score}</label>
      <input
        type="range"
        min="0"
        max="10"
        step="0.1"
        class="form-control-range"
        id="inputNewScore"
        oninput="verifyNewScore()"
        value="${movie.score}"
      />
    </div>
  </form>
    `
    );
  }
}
function saveChanges() {
  let movieToEdit = document.getElementById("inputGroupSelect01");
  let newTitle = document.getElementById("editMovieTitleId");
  let newSummary = document.getElementById("inputNewSummary");
  let newScore = document.getElementById("inputNewScore");
  let newYear = document.getElementById("inputNewYear");
  if (
    movieToEdit.value != "" &&
    1894 < newYear.value &&
    newYear.value < 2100 &&
    verifyNewTitle()
  ) {
    $("#modalEdit").modal("hide");
    $("#modalEditMovieCheck").modal("show");
    let p = document.getElementById("textConfirmEditMOv");
    let movie = JSON.parse(localStorage.getItem(movieToEdit.value));

    p.innerHTML = `
                  Nome: ${
                    newTitle.value === "" ? movie.title : newTitle.value
                  }<br>
                  Resumo:${
                    newSummary.value === "" ? movie.summary : newSummary.value
                  } <br>
                  Ano de Lancamento: ${
                    newYear.value === "" ? movie.year : newYear.value
                  }<br>
                  Nota:${newScore.value} <br>
                `;
    document
      .getElementById("checkedInfoEditMovie")
      .addEventListener("click", () => {
        let newInfoMovie = {
          title: newTitle.value === "" ? movie.title : newTitle.value,
          summary: newSummary.value === "" ? movie.summary : newSummary.value,
          score: newScore.value,
          year: newYear.value === "" ? movie.year : newYear.value,
        };
        localStorage.removeItem(movieToEdit.value);
        setFilme(newInfoMovie);
        $("#modalEditMovieCheck").modal("hide");
        resetEdit();
        refreshPage();
      });
  }
}
function backToEditOp() {
  $("#modalEditMovieCheck").modal("hide");
  $("#modalEdit").modal("show");
}

function loadMovieOp() {
  let select = document.getElementById("inputGroupSelect01");
  let selectR = document.getElementById("inputGroupSelect02");

  select.replaceChildren();
  selectR.replaceChildren();
  $("#inputGroupSelect01").append(
    "<option selected value=''>Escolher...</option>"
  );
  $("#inputGroupSelect02").append(
    "<option selected value=''>Escolher...</option>"
  );
  for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    $("#inputGroupSelect01").append(`<option value='${key}'> ${key}</option>`);
    $("#inputGroupSelect02").append(`<option value='${key}'> ${key}</option>`);
  }
}

//deletar um filme
function verifyMovieToDelete() {
  let movieToRemove = document.getElementById("inputGroupSelect02").value;
  let selectMovie = document.getElementById("spanAreaDeleteMovie");
  if (movieToRemove === "") {
    selectMovie.replaceChildren();
    selectMovie.insertAdjacentHTML(
      "beforeEnd",
      ` 
    <span class="spanAlert" style='display:block'>Filme Invalido</span>
    `
    );
  } else {
    selectMovie.replaceChildren();
  }
}
function resetFormDelete() {
  document.getElementById("spanAreaDeleteMovie").replaceChildren();
}
function deleteMovie() {
  let movieToRemove = document.getElementById("inputGroupSelect02");
  if (!(movieToRemove.value === "")) {
    $("#modalDelete").modal("hide");
    $("#modalDeleteMovieCheck").modal("show");
    let p = document.getElementById("textConfirmDeleteMOv");
    p.innerText = `Tem certeza que deseja remover o filme ${movieToRemove.value} ?`;
    document
      .getElementById("checkedInfoDeleteMovie")
      .addEventListener("click", () => {
        localStorage.removeItem(movieToRemove.value);
        $("#modalDeleteMovieCheck").modal("hide");
        refreshPage();
      });
  } else {
    verifyMovieToDelete();
  }
}
function backToRemoveOp() {
  $("#modalDeleteMovieCheck").modal("hide");
  $("#modalDelete").modal("show");
}

refreshPage();
