// DEFINITION DES FONCTIONS DE NOTRE CODE

var ajouterphotohtml;
var lesCategories;
var disWorks;
var tabWorks;

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

function ctgrIntoIdCtgr(ctgr) {
  let id = 1;
  for (let i = 0; i < lesCategories.length; i++) {
    if (ctgr === lesCategories[i].name) {
      id = i + 1;
    }
  }
  return id;
}

function ctgrIdIntoObject(ctgrId) {
  var ctgrObj;
  for (let i = 0; i < lesCategories.length; i++) {
    if (ctgrId === lesCategories[i].id) {
      ctgrObj = {
        id: ctgrId,
        name: lesCategories[i].name,
      };
    }
  }
  return ctgrObj;
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

  // console.log("gallery : " + gallerytab);
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
        trashIcon.addEventListener("click", async function (event) {
          // console.log(tablWorks[i].id + " " + tablWorks[i].title);
          // console.log(`http://localhost:5678/api/works/${tablWorks[i].id}`);
          const reponse = await fetch(
            `http://localhost:5678/api/works/${tablWorks[i].id}`,
            {
              method: "DELETE",
              headers: {
                Accept: "*/*",
                Authorization: `Bearer ${localStorage.getItem("logintoken")}`,
              },
            }
          );

          if (reponse.ok) {
            console.log("delete reussi");
            tablWorks.splice(i, 1);
            disWorks = tablWorks;
            window.localStorage.setItem("tabWorks", JSON.stringify(tablWorks));

            setTimeout(() => {
              console.log("displaying works after del");
              displayWorks(tablWorks);
            }, "200");
          }
        });
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
  // console.log("boutons: ");
  // console.log(tFiltersDiv);
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

    // console.log(document.getElementById("email").value);
    // console.log(document.getElementById("password").value);

    // console.log(chargeUtile);
    const rep = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(chargeUtile),
    });

    if (rep.ok) {
      // console.log("la rep :");
      // console.log(rep);
      // console.log(rep.status);
      const data = await rep.json();
      await localStorage.setItem("logintoken", data.token);
      // console.log("le local storage");
      // console.log(localStorage);
      // console.log("Connexion réussie");
      //   document.querySelector("nav a").innerText = "logout";
      window.location.href = "index.html";
      // console.log("move to index");

      //   document.querySelector("nav a").innerText = "logout";
      document.querySelector(".message404 p").className = "hidden";
    } else {
      document.querySelector(".message404 p").className = "displayed";
    }
  });
}

function addListenerModaleAdd() {
  document
    .querySelector(".xMarkPhoto")
    .addEventListener("click", function (event) {
      setTimeout(() => {
        document.querySelector(".addPhoto").className = "addPhoto off";
        document.querySelector(".modaleGal").className = "modaleGal off";
        document.querySelector(".body").className = "body bodyOff";
        document.querySelector(".divBody").className = "divBody divBodyOff";
      }, "200");
    });

  document
    .querySelector(".fa-arrow-left")
    .addEventListener("click", function (event) {
      setTimeout(() => {
        document.querySelector(".addPhoto").className = "addPhoto off";
      }, "200");
    });

  document.addEventListener("click", function (event) {
    if (
      document.querySelector(".fa-arrow-left").contains(event.target) ===
        false &&
      document.querySelector(".xMarkPhoto").contains(event.target) === false &&
      document.querySelector(".modaleGal").contains(event.target) === false &&
      document.querySelector(".addPhoto").contains(event.target) === false &&
      document.querySelector(".editPrj").contains(event.target) === false &&
      document.querySelector(".logbanner").contains(event.target) === false &&
      document.querySelector(".addPhoto").className === "addPhoto addPhotoOn" &&
      document.querySelector(".modaleGal").className === "modaleGal modalon"
    ) {
      console.log("documents add");
      setTimeout(() => {
        document.querySelector(".addPhoto").className = "addPhoto off";
        document.querySelector(".modaleGal").className = "modaleGal off";
        document.querySelector(".body").className = "body bodyOff";
        document.querySelector(".divBody").className = "divBody divBodyOff";
        document.querySelector(".ajouterphoto").innerHTML = ajouterphotohtml;
        document.querySelector(".btnValiderAddPhoto").style.background =
          "#A7A7A7";
      }, "200");
    }
  });

  document
    .querySelector(".btnValiderAddPhoto")
    .addEventListener("click", async function (event) {
      var fileImage = document.getElementById("btnAjouterPhoto").files[0];
      // console.log(fileImage + fileImage.src);

      // console.log(fReader);
      console.log("dsdqsd");
      console.log(document.getElementById("btnAjouterPhoto").files[0]);
      if (
        document.querySelector(".ajouterphoto img") !== null &&
        document.getElementById("titre").value !== "" &&
        document.getElementById("categorie").value !== ""
      ) {
        // const imgsrc = document.querySelector(".ajouterphoto img").src;
        const letitre = document.getElementById("titre").value;
        const lacategorie = ctgrIntoIdCtgr(
          document.getElementById("categorie").value
        );
        const chargeU = new FormData();
        chargeU.append("image", fileImage);
        chargeU.append("title", letitre);
        chargeU.append("category", lacategorie);
        console.log(chargeU);
        const reponse = await fetch(`http://localhost:5678/api/works`, {
          method: "POST",
          headers: {
            // "Content-Type": "multipart/form-data",
            // accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("logintoken")}`,
          },
          body: chargeU,
        });
        if (reponse.ok) {
          console.log("upload Ok");
          disWorks = await callWorks();
          console.log(disWorks);
          setTimeout(() => {
            console.log("displaying works");
            displayWorks(disWorks);
            console.log(document.querySelector(".addPhoto").className);
            document.querySelector(".addPhoto").className = "addPhoto off";
            document.querySelector(".ajouterphoto").innerHTML =
              ajouterphotohtml;
            document.querySelector(".btnValiderAddPhoto").style.background =
              "#A7A7A7";
          }, "200");
        }
      }
    });
}

function addListenerModale() {
  document.querySelector(".xMark").addEventListener("click", function (event) {
    document.querySelector(".modaleGal").className = "modaleGal off";
    document.querySelector(".body").className = "body bodyOff";
    document.querySelector(".divBody").className = "divBody divBodyOff";
  });

  document.addEventListener("click", function (event) {
    if (
      document.querySelector(".modaleGal").contains(event.target) === false &&
      document.querySelector(".editPrj").contains(event.target) === false &&
      document.querySelector(".logbanner").contains(event.target) === false &&
      document.querySelector(".addPhoto").className === "addPhoto off"
    ) {
      console.log("Off by document conditions");
      document.querySelector(".modaleGal").className = "modaleGal off";
      document.querySelector(".body").className = "body bodyOff";
      document.querySelector(".divBody").className = "divBody divBodyOff";
    }
  });
  document
    .querySelector(".btnAddPhoto")
    .addEventListener("click", async function (event) {
      document.querySelector(".addPhoto").className = "addPhoto addPhotoOn";
      console.log("listeners modale add chargés");
      addListenerModaleAdd();
    });

  document
    .querySelector(".btnAjouterPhoto")
    .addEventListener("onchange", function (event) {
      newPhoto.src = document.querySelector(".btnAjouterPhoto").value;
      console.log(document.querySelector(".btnAjouterPhoto").value);
      console.log("url changée");
    });
}

//Fonction lors de l'upload de l'image qui affiche la prévisualisation
function theOnchange(event) {
  let ajouterphoto = document.querySelector(".ajouterphoto");
  let newPhoto = document.createElement("img");
  var fReader = new FileReader();
  fReader.readAsDataURL(document.getElementById("btnAjouterPhoto").files[0]);
  fReader.onloadend = function (event) {
    newPhoto.src = event.target.result;
  };
  const linputfile = document.getElementById("btnAjouterPhoto");
  ajouterphoto.innerHTML = "";
  console.log(linputfile.value);
  ajouterphoto.appendChild(newPhoto);
  ajouterphoto.appendChild(linputfile);
  document.querySelector(".btnValiderAddPhoto").style.background = "#1d6154";
}

function addListenerEditBtn() {
  const bannerEditDiv = document.querySelector(".on");
  const projetEditDiv = document.querySelector(".mesprojets");

  bannerEditDiv.addEventListener("click", function (event) {
    document.querySelector(".modaleGal").className = "modaleGal modalon";
    addListenerModale();
    document.querySelector(".body").className = "body bodyOn";
    document.querySelector(".divBody").className = "divBody divBodyOn";
  });
  projetEditDiv.addEventListener("click", function (event) {
    document.querySelector(".modaleGal").className = "modaleGal modalon";
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
      document.querySelector(".logbanner").className = "logbanner on";
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
  lesCategories = await callCatgr();
  // addListenerModaleAdd();
  adaptLoginLogout();
  addEventListenerLogout();
  if (document.body.className === "loginbody") {
    addListenerLogin();
  } else {
    ajouterphotohtml = document.querySelector(".ajouterphoto").innerHTML;
    tabWorks = await callWorks();
    disWorks = tabWorks;
    console.log(disWorks);
    localStorage.setItem("tabWorks", JSON.stringify(tabWorks));
    const tabCategories = await callCatgr();
    const catname = tabCategories.map((tabCategories) => tabCategories.name);
    await deleteWorks();
    await displayWorks(tabWorks);
    const copieWorks = tabWorks.map((tabWorks) => tabWorks.category.name);
    // const categories = suppDoublonsTab(copieWorks);
    createFilters(catname);
    addListenerFilters(tabWorks);
    // delDupes(copieWorks);
  }
})();
