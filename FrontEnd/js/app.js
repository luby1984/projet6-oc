/*verifier que son json server et bien en route*/


 /*verifier*/
 const gallery = document.querySelector(".gallery");
 const filtres = document.querySelector(".filtres");
 //const galleryModal = document.querySelector(".gallery-modal")


/*function pour qui retourn le tableau  des works*/

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
  
}
getWorks();
 
/*Affichage des works dans le dom */
async function displayWorks() {
const worksbook = await getWorks();    
 worksbook.forEach((work) => {
createWorks(work);
});
}
displayWorks();
 
function createWorks(work) {
    //console.log (work)
 const figure = document.createElement("figure");
 const img = document.createElement("img")
 const figcaption = document.createElement("figcaption");
 img.src = work.imageUrl;
 figcaption.textContent = work.title;
figure.classList.add("galleryStyle");
 figure.appendChild(img);
 figure.appendChild(figcaption);
 gallery.appendChild(figure);

 const figureClone = figure.cloneNode(true); 
  const figcaptionClone = figureClone.querySelector("figcaption");
  if (figcaptionClone) {
    figcaptionClone.remove(); // Rimuove la descrizione
  }

   const trashIcon = document.createElement("i");
   trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");
    //ajoute l'evenement por la suppression
    trashIcon.addEventListener('click', function(event) {
        event.stopPropagation
        deleteWork(work.id, figureClone); // Appel de la fonction deleteWork
    });
   figureClone.appendChild(trashIcon);
   

   // Ajouter la figure clonée à la gallery-modal
   document.querySelector(".gallery-modal").appendChild(figureClone);
}
            /*affichage des button */

/*recuperez le tableau de categories*/

 async function getCategorys() {
    const response = await fetch("http://localhost:5678/api/categories");
    return await response.json();
   // const responseJson = await response.json();
   // console.log(responseJson);
 }
 getCategorys();

 /*affichage des buttons par categorys*/

 async function displayCategorysButtons() {
    const categorys = await getCategorys();
    console.log(categorys);
    categorys.forEach((category) => {
        const btn = document.createElement("button");
        btn.textContent = category.name;
        btn.id = category.id;
        filtres.appendChild(btn);       
    });
 }

displayCategorysButtons();

//filtrer ou click sur le button  par category//
async function filterCategory() {
    const worksbook = await getWorks();
    console.log(worksbook);
    //selection de tout le  4 bouttons//
    const buttons = document.querySelectorAll(".filtres button");
buttons.forEach((button) => {
button.addEventListener("click", (e)=>{
    btnId = e.target.id;
    gallery.innerHTML = "";
    if ( btnId !== "0") {
     const worksTriCategory = worksbook.filter((work)=>{
        return work.categoryId == btnId;
     });
     worksTriCategory.forEach((work) => {
        createWorks(work);
     });    
    }else {
        displayWorks();
    }
    console.log(btnId);
});   
});
} 
filterCategory()


function displayAdminMode(){
 if (sessionStorage.authToken){
   const editBanner = document.createElement("div");
    editBanner.className = "edit";
    editBanner.innerHTML = 
    '<p><a href= "#modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a></p>';
    document.body.prepend(editBanner);
 }   
}
displayAdminMode();

  let modal = null;
  const focusableSelector = "button, a, input, textarea";
  let focusables = [];

 const openModal = function (e){
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    focusables[0].focus();
    modal.style.display = null;
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation);
 };
 const closeModal = function (e) {
    if (modal === null) return;
    e.preventDefault();
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true")
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-close").removeEventListener("click", closeModal);
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation);
    modal = null;
 };

 const stopPropagation = function (e){
    e.stopPropagation();
 }

 const focusInModal = function (e) {
     e.preventDefault();
    let index = focusables.finIndex(f => f === modal.querySelector(":focus"))
    if(e.shiftKey === true) {
        index--
    }else{
        index++;
    }
    if (index >= focusables.length){
        index = 0 
    }
    if (index < 0){
    index = focusables.length - 1
    }
        focusables[index].focus()
 }

 
 document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal);  

 });
 window.addEventListener("keydown", function (e) {
     if (e.key === "Escape" || e.key === "Esc") {
         closeModal(e);
        }
        if (e.key === "Tab" && modal !== null) {
            focusInModal(e)
            
        }
    });

    async function deleteWork(workId, figureElement) {
        const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
        if (!confirmation) return; // Si l'utilisateur annule
    
        try {
            const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('authToken'), // Authentification si nécessaire
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.ok) {
                console.log(`Projet avec ID ${workId} supprimé`);
                // Supprimer l'élément du DOM
                figureElement.remove();
            } else {
                console.error("Erreur lors de la suppression", response.statusText);
                alert("Une erreur s'est produite lors de la suppression.");
            }
        } catch (error) {
            console.error("Erreur réseau ou serveur", error);
            alert("Impossible de supprimer le projet pour le moment.");
        }
    }
    //modal switch
    
  

