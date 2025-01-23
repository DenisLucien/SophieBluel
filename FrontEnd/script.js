// DEFINITION DES FONCTIONS DE NOTRE CODE
async function callWorks() {
  const tWorks = await fetch("http://localhost:5678/api/works").then((works) =>
    works.json()
  );
  return tWorks;
}

async function callCatgr() {
  const ctgr = await fetch("http://localhost:5678/api/categories").then(
    (ctgr) => ctgr.json()
  );
  return ctgr;
}

function deleteWorks() {
  const gallerytab = document.querySelectorAll(".gallery");
  for (let a = 0; a < gallerytab.length; a++) {
    const gallery = gallerytab[a];
    gallery.innerHTML = "";
  }
}
// Fonction qui display les works des différentes galeries
async function displayWorks(tablWorks) {
  deleteWorks();
  const gallerytab = document.querySelectorAll(".gallery");

  console.log("gallery : " + gallerytab);
  for (let a = 0; a < gallerytab.length; a++) {
    const gallery = gallerytab[a];
    for (let i = 0; i < tablWorks.length; i++) {
      const workElement = document.createElement("figure");
      const imageElement = document.createElement("img");
      const titreElement = document.createElement("figcaption");
      const trashIcon = document.createElement("i");
      imageElement.src = tablWorks[i].imageUrl;
      imageElement.alt = "";
      titreElement.innerText = tablWorks[i].title;
      trashIcon.className = "fa-solid fa-trash-can";
      gallery.appendChild(workElement);
      workElement.appendChild(imageElement);

      if (gallerytab[a].className === "gallery modale") {
        workElement.appendChild(trashIcon);
      }
      if (gallerytab[a].className === "gallery") {
        workElement.appendChild(titreElement);
      }
    }
  }
}

// function testlistener(){
//     const galerie=document.querySelector(".gallery");
//     galerie.addEventListener("click",function(event) {
//         deleteWorks();
//     })

// }

function suppDoublonsTab(tab) {
  let boolTab = [];
  let doublonsSupprimes = [];
  if (tab !== null) {
    // CREATION D'UN TABLEAU BOOLEEN INITALISE A FALSE QUI NOUS INDIQUERA LES DOUBLONS
    let copieTab = tab;
    boolTab.length = tab.length;

    for (let i = 0; i < boolTab.length; i++) {
      boolTab[i] = false;
    }

    for (let i = 0; i < copieTab.length; i++) {
      if (boolTab[i] === false) {
        doublonsSupprimes.push(copieTab[i]);
      }
      for (let j = 0; j < copieTab.length; j++) {
        if (
          boolTab[i] === false &&
          boolTab[copieTab.length - 1 - j] === false
        ) {
          if (
            copieTab[copieTab.length - 1 - j] === copieTab[i] &&
            i !== copieTab.length - 1 - j
          ) {
            boolTab[copieTab.length - 1 - j] = true;
          }
        }
      }
    }
  }
  return doublonsSupprimes;
}
// Une fonction qui retire les doublons bien plus courte
function delDupes(tab) {
  var deduped = Array.from(new Set(tab));
  return deduped;
}

function createFilters(tCat) {
  const filtersRef = document.querySelector(".filters");
  const oneFilter = document.createElement("button");
  oneFilter.setAttribute("class", "filterButton");
  oneFilter.innerText = "Tous";
  filtersRef.appendChild(oneFilter);
  for (let i = 0; i < tCat.length; i++) {
    const filtersRef = document.querySelector(".filters");
    const oneFilter = document.createElement("button");
    oneFilter.setAttribute("class", "filterButton");
    oneFilter.innerText = tCat[i];
    filtersRef.appendChild(oneFilter);
  }
}

//FONCTION QUI FAIT FONCTIONNER LES BOUTONS FILTRE
async function addListenerFilters(tAllWorks) {
  const copieAllWorks = tAllWorks;
  const tFiltersDiv = document.querySelectorAll(".filters button");
  const tWorksCat = tAllWorks.map((tAllWorks) => tAllWorks.category.name);
  console.log("boutons: ");
  console.log(tFiltersDiv);
  for (let i = 0; i < tFiltersDiv.length; i++) {
    tFiltersDiv[i].addEventListener("click", async function (event) {
      for (let i = 0; i < tFiltersDiv.length; i++) {
        tFiltersDiv[i].setAttribute("class", "filterButton");
        // console.log( "classlist = "+tFiltersDiv[i].classList);
      }
      // console.log("before change :"+event.target);
      event.target.classList.replace("filterButton", "new");
      // console.log("after change : "+event.target.classList);
      if (event.target.innerText === "Tous") {
        displayWorks(copieAllWorks);
      } else {
        let tFiltered = copieAllWorks.filter(
          (copieAllWorks) =>
            copieAllWorks.category.name === event.target.innerText
        );
        displayWorks(tFiltered);
      }
    });
  }
}

//Ajout d'un listener au bouton submit de la page login pour effectuer les
//requêtes, le stockage, les messages d'erreurs etc...
function addListenerLogin() {
  var el = document.querySelector("main form input[type='submit']");

  el.addEventListener("click", async function (event) {
    event.preventDefault();
    const mail = document.getElementById("email").value;
    const pwd = document.getElementById("password").value;
    const chargeUtile = {
      email: mail,
      password: pwd,
    };

    console.log(document.getElementById("email").value);
    console.log(document.getElementById("password").value);

    console.log(chargeUtile);

    // console.log("charge util"+chargeUtile.email);
    // console.log(chargeUtile.password);

    const rep = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(chargeUtile),
    });

    if (rep.ok) {
      console.log("la rep :");
      console.log(rep);
      console.log(rep.status);
      const data = await rep.json();
      localStorage.setItem("logintoken", data.token);
      console.log("Connexion réussie");
      //   document.querySelector("nav a").innerText = "logout";
      window.location.href = "index.html";
      console.log("move to index");

      //   document.querySelector("nav a").innerText = "logout";
      document.querySelector(".message404 p").className = "hidden";
    }
    if (rep.status === 404) {
      document.querySelector(".message404 p").className = "displayed";
    }
    console.log(rep.status === 404);
  });
}

function addListenerModale() {
  document
    .querySelector(".fa-xmark")
    .addEventListener("click", function (event) {
      document.querySelector(".modalon").className = "modaleGal off";
      document.querySelector(".body").className = "body bodyOff";
      document.querySelector(".divBody").className = "divBody divBodyOff";
    });

  document
    .querySelector(".modalon")
    .addEventListener("click", function (event) {
      document.querySelector(".modalon").className = "modaleGal off";
      document.querySelector(".body").className = "body bodyOff";
      document.querySelector(".divBody").className = "divBody divBodyOff";
    });
}

function addListenerEditBtn() {
  const bannerEditDiv = document.querySelector(".on");
  const projetEditDiv = document.querySelector(".mesprojets");

  bannerEditDiv.addEventListener("click", function (event) {
    document.querySelector(".modaleGal").className = ".modaleGal modalon";
    addListenerModale();
    document.querySelector(".body").className = "body bodyOn";
    document.querySelector(".divBody").className = "divBody divBodyOn";
  });
  projetEditDiv.addEventListener("click", function (event) {
    document.querySelector(".modaleGal").className = ".modaleGal modalon";
    addListenerModale();
    document.querySelector(".body").className = "body bodyOn";
    document.querySelector(".divBody").className = "divBody divBodyOn";
  });
}

//Fonction qui adapte l'affichage en fonction de si l'on est connecté ou non
//ATTENTION: ELLE AJOUTE EGALEMENT LE LISTENER AU BOUTON EDIT QUI AFFICHE LA MODALE
function adaptLoginLogout() {
  //Si on est déconnecté
  if (
    localStorage.getItem("logintoken") === "" ||
    localStorage.getItem("logintoken") === null
  ) {
    if (document.body.className !== "loginbody") {
      document.querySelector(".logbanner").className = "off";
      document.querySelector(".editPrj").className = "off";
      document.querySelector(".filters").className = "filters filterson";
      console.log("logedout  logbanner off");
    }
    document.querySelector("nav a").innerText = "login";
  }
  //Si on est connecté
  else {
    if (document.body.className !== "loginbody") {
      document.querySelector(".logbanner").className = "on";
      document.querySelector(".filters").className = "filters off";
      console.log("logedin logbanner on");
      addListenerEditBtn();
    }
    document.querySelector("nav a").innerText = "logout";
  }
  console.log("localSto:" + localStorage.getItem("logintoken"));
}

function addEventListenerLogout() {
  const boutonLog = document.querySelector("nav a");
  boutonLog.addEventListener("click", async function (event) {
    if (document.querySelector("nav a").innerText === "logout") {
      event.preventDefault();
      window.location.href = "index.html";
      localStorage.removeItem("logintoken");
      //   console.log(localStorage.getItem("logintoken"));
    }
  });
}

// UTILISATION D'UNE FONCTION ANONYME AUTO INVOQUEE POUR UTILISER AWAIT DANS
// NOTRE CODE, ELLE COMPORTE LE CODE A EXECUTER
(async function () {
  //   console.log(document.querySelector(".modaleGal").className);
  //   document.querySelector(".modaleGal").className = "modaleGal modalon";
  //   console.log(document.querySelector(".modalon").className);

  adaptLoginLogout();
  addEventListenerLogout();
  if (document.body.className === "loginbody") {
    addListenerLogin();
  } else {
    // console.log(document.querySelector(".logbanner").classList);
    const tabWorks = await callWorks();
    console.log("Tableau Works :");
    console.log(tabWorks);
    console.log("url : " + document.body.classList);
    const tabCategories = await callCatgr();
    await deleteWorks();
    await displayWorks(tabWorks);
    const copieWorks = tabWorks.map((tabWorks) => tabWorks.category.name);
    console.log(copieWorks);
    console.log("Les doublons supprimes");
    const categories = suppDoublonsTab(copieWorks);
    // const categories=callCatgr();
    createFilters(categories);
    addListenerFilters(tabWorks);
    delDupes(copieWorks);
    // console.log(document.querySelector(".logbanner").classList[1]);
    console.log(document.body.className !== "loginbody");
  }
})();
