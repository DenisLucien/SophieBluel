// DEFINITION DES FONCTIONS DE NOTRE CODE
async function callWorks()
{
    const tWorks = await fetch("http://localhost:5678/api/works").then(works => works.json());
    return tWorks;

}

async function callCatgr()
{
    const ctgr = await fetch("http://localhost:5678/api/categories").then(ctgr => ctgr.json());
    return ctgr;


}

function deleteWorks(){
    const galerie=document.querySelector(".gallery");
    // console.log("innerHtml : "+galerie.innerHTML);
    // console.log("par ID : "+  portfolio.innerHTML);
    galerie.innerHTML="";
}

async function displayWorks(tablWorks)
{
    deleteWorks();
    const gallery = document.querySelector(".gallery");

    for(let i=0;i<tablWorks.length;i++){
        const workElement=document.createElement("figure");
        const imageElement=document.createElement("img");
        const titreElement=document.createElement("figcaption");
        imageElement.src=tablWorks[i].imageUrl;
        imageElement.alt="";
        titreElement.innerText=tablWorks[i].title;
        gallery.appendChild(workElement);
        workElement.appendChild(imageElement);
        workElement.appendChild(titreElement);
    }
}



// function testlistener(){
//     const galerie=document.querySelector(".gallery");
//     galerie.addEventListener("click",function(event) {
//         deleteWorks();
//     })

// }

function suppDoublonsTab(tab){
    let boolTab = [];
    let doublonsSupprimes=[];
    if(tab!==null)
    {
        // CREATION D'UN TABLEAU BOOLEEN INITALISE A FALSE QUI NOUS INDIQUERA LES DOUBLONS
        let copieTab=tab;
        boolTab.length=tab.length;

        for(let i=0;i<boolTab.length;i++){
            boolTab[i]=false;
        }

        for(let i=0;i<copieTab.length;i++){
            if (boolTab[i]===false){
                doublonsSupprimes.push(copieTab[i]);
            }
            for(let j=0;j<copieTab.length;j++)
            {
                if(boolTab[i]===false&&boolTab[copieTab.length-1-j]===false)
                {
                    if(copieTab[copieTab.length-1-j]===copieTab[i]&&(i!==copieTab.length-1-j))
                    {
                        boolTab[copieTab.length-1-j]=true
                    }
                }
            }
        }
    }
    return doublonsSupprimes;
}
// Une fonction qui retire les doublons bien plus courte
function delDupes(tab)
{

    var deduped = Array.from(new Set(tab));


    console.log(tab);
    console.log(deduped);
    return deduped;
}

function displayFilters(tCat)
{
    const filtersRef=document.querySelector(".filters");
    const oneFilter=document.createElement("button");
    oneFilter.setAttribute('class','filterButton');
    oneFilter.innerText="Tous";
    filtersRef.appendChild(oneFilter);
    for(let i=0;i<tCat.length;i++)
    {
        const filtersRef=document.querySelector(".filters");
        const oneFilter=document.createElement("button");
        oneFilter.setAttribute('class','filterButton');
        oneFilter.innerText=tCat[i];
        filtersRef.appendChild(oneFilter);
    }


}


//FONCTION QUI FAIT FONCTIONNER LES BOUTONS FILTRE
async function addListenerFilters(tAllWorks){
    const copieAllWorks=tAllWorks;
    const tFiltersDiv=document.querySelectorAll(".filters button");
    const tWorksCat=tAllWorks.map(tAllWorks=>tAllWorks.category.name);
    console.log("boutons: ");
    console.log(tFiltersDiv);
    for(let i=0;i<tFiltersDiv.length;i++)
    {
        tFiltersDiv[i].addEventListener("click", async function(event){
            for(let i=0;i<tFiltersDiv.length;i++)
            {
                tFiltersDiv[i].setAttribute('class','filterButton');
                // console.log( "classlist = "+tFiltersDiv[i].classList);
            }
            // console.log("before change :"+event.target);
            event.target.classList.replace('filterButton','new');
            // console.log("after change : "+event.target.classList);
            if(event.target.innerText==="Tous")
            {
                displayWorks(copieAllWorks);
            }
            else
            {
                let tFiltered= copieAllWorks.filter((copieAllWorks)=>copieAllWorks.category.name===event.target.innerText);
                displayWorks(tFiltered);
            }

        })
    }
}



// UTILISATION D'UNE FONCTION ANONYME AUTO INVOQUEE POUR UTILISER AWAIT DANS
// NOTRE CODE, ELLE COMPORTE LE CODE A EXECUTER
(async function(){
    const tabWorks=await callWorks();
    const tabCategories=await callCatgr();
    console.log(tabCategories);
    console.log(tabWorks);
    console.log(tabWorks[0].category.name);
    await deleteWorks();
    await displayWorks(tabWorks);
    // testlistener();
    const copieWorks= tabWorks.map(tabWorks=>tabWorks.category.name);
    console.log(copieWorks)
    console.log("Les doublons supprimes");
    const categories =suppDoublonsTab(copieWorks);
    console.log("categories :"+categories[0]+"cacecez");
    displayFilters(categories);
    addListenerFilters(tabWorks);
    delDupes(copieWorks);



})();


