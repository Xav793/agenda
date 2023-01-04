let selectedDate = {};

const calendar = new VanillaCalendar({
  selector: "#myCalendar",
  onSelect: (data, elem) => {
    selectedDate = new Date(data.date).toLocaleDateString().split("T")[0];
    displayTache(selectedDate);
  },
  months: [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Aout",
    "Septembre",
    "Octobre",
    "Novembre",
    "Decembre",
  ],
  shortWeekday: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
});

const viewCalendar = document.querySelector("#myCalendar");
const agendaForm = document.querySelector(".cardAgenda");
const viewTache = document.querySelector(".agenda");
const tacheList = document.querySelector("#tacheList");
const tacheTitle = document.querySelector("#tacheTitle");
const ajoutTache = document.querySelector(".ajout");

viewCalendar.addEventListener("click", () => {
  viewTache.style.display = "block";
});

agendaForm.addEventListener("submit", addTache);

tacheList.addEventListener("click", suppTache);

function openForm() {
  return (agendaForm.style.display = "block");
}

/**
 *
 *Ajout d'une tache à l'agenda
 *
 */
function addTache(e) {
  e.preventDefault();
  const formData = new FormData(agendaForm);
  const tache = formData.get("tache");
  const description = formData.get("description");
  const heure = formData.get("heure");
  const duree = formData.get("duree");
  const date = selectedDate;
  const newTache = {
    id: Date.now(),
    tache,
    description,
    heure,
    duree,
    date,
  };
  console.log(newTache);

  if (date !== "" && tache !== "") {
    saveAgenda(newTache);
    agendaForm.reset();
    displayTache(selectedDate);
  } else {
    if (date !== "" && tache == "") {
      alert("Veuillez rentrer une tache");
    } else if (date !== selectedDate && tache !== "") {
      alert("Veuillez choisir une date");
    }
  }
}

/**
 *
 * Sauvegarde d'une tache dans le local storage
 */
function saveAgenda(tache) {
  let taches = JSON.parse(localStorage.getItem("taches")) || [];
  taches = [...taches, tache];
  localStorage.setItem("taches", JSON.stringify(taches));
}

/**
 *
 * Affichage d'une seule tache selon la date
 */
function displayTache(date) {
  let taches = JSON.parse(localStorage.getItem("taches")) || [];
  let tacheAtThisDate = taches.filter((t) => t.date === date);

  if (tacheAtThisDate.length === 1) {
    const tache = tacheAtThisDate[0];
    tacheTitle.innerHTML = "Tache";
    tacheList.innerHTML = ` <button class='buttonFormAgenda' onclick="openForm()">Ajouter une tache</button><div>
    
    <h4 class="labelAgenda hAgenda">${tache.tache}</h4>
    <ul class='ulAgenda'>
    <li><span class='strongAgenda'>Horaire:</span> ${
      tache.heure ? tache.heure : "Aucun horaire"
    }</li>
    <li><span class='strongAgenda'>Description:</span> ${
      tache.description !== "" ? tache.description : "Aucune description"
    }</li>
    <li><span class='strongAgenda'>Durée :</span>${tache.duree} ${
      tache.duree !== "" ? "minutes" : "Aucune durée prévue"
    }</li>
    </ul>
    <button class='buttonFormAgenda' data-id='${tache.id}'>Supprimer</button>
    </div>`;
  } else if (tacheAtThisDate.length > 1) {
    tacheTitle.innerHTML = "Taches";
    tacheList.innerHTML =
      '<button class="buttonFormAgenda" onclick="openForm()">Ajouter une tache</button>';
    displayTaches(tacheAtThisDate);
  } else {
    tacheTitle.innerHTML = "Aucune tache";
    tacheList.innerHTML = `<div>
    
    <h4 class='hAgenda labelAgenda'>Pas de taches de prévues ce jour</h4>
    <button class="buttonFormAgenda" onclick="openForm()">Ajouter une tache</button>
    </div>

    `;
  }
}

/**
 *
 * Affichage de la liste des taches
 */
function displayTaches(taches) {
  let content = [];

  taches.forEach((tache) => {
    const singleTacheHTML = `<div>
    <h4 class="labelAgenda hAgenda">${tache.tache}</h4>
    <ul class='ulAgenda'>
    <li><span class='strongAgenda'>Horaire:</span> ${
      tache.heure ? tache.heure : "Aucun horaire"
    }</li>
    <li><span class='strongAgenda'>Description:</span> ${
      tache.description !== "" ? tache.description : "Aucune description"
    }</li>
    <li> <span class='strongAgenda'>Durée:</span> ${tache.duree} ${
      tache.duree !== "" ? "minutes" : "Aucune durée prévue"
    }</li>
    </ul>
    <button class="buttonFormAgenda" data-id='${tache.id}'>Supprimer</button>
    </div>
    `;
    content = [...content, singleTacheHTML];
  });
  tacheList.innerHTML += content.join("");
}

/**
 *
 *Suppression d'une tache
 */
function suppTache(e) {
  if (e.target.nodeName.toLowerCase() !== "button") {
    return;
  } else {
    const tacheId = Number(e.target.dataset.id);
    let taches = JSON.parse(localStorage.getItem("taches")) || [];
    taches = taches.filter((tache) => tache.id !== tacheId);
    localStorage.setItem("taches", JSON.stringify(taches));
    displayTache(selectedDate);
  }
}
