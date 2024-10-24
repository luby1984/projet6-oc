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

    const figure = document.createElement("figure");
    const img = document.createElement("img")
    const figcaption = document.createElement("figcaption");

    img.src = work.imageUrl;
    figcaption.textContent = work.title;
    figure.classList.add("galleryStyle");
    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);

    createWorkClone(work, figure);
}
function createWorkClone(work, originalFigure) {
    const figureClone = originalFigure.cloneNode(true);
    const figcaptionClone = figureClone.querySelector("figcaption");
    
    if (figcaptionClone) {
        figcaptionClone.remove(); // Rimuove la descrizione
    }

    const trashIcon = document.createElement("i");
    trashIcon.classList.add("fa-solid", "fa-trash-can", "trash-icon");

    // Aggiungi l'evento per la cancellazione
    trashIcon.addEventListener('click', function (event) {
        event.stopPropagation();
        event.preventDefault();
        console.log(`Cliccato sul cestino per l'elemento con ID: ${work.id}`); // Log di debug
        deleteWork(work.id, figureClone, event); // Chiamata alla funzione deleteWork
    });

    figureClone.appendChild(trashIcon);

    // Aggiungi la figura clonata alla gallery-modal
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
        button.addEventListener("click", (e) => {
           const btnId = e.target.id;
            gallery.innerHTML = "";
            document.querySelector(".gallery-modal").innerHTML = "";
            if (btnId !== "0") {
                const worksTriCategory = worksbook.filter((work) => {
                    return work.categoryId == btnId;
                });
                worksTriCategory.forEach((work) => {
                    createWorks(work);
                });
            } else {
                displayWorks();
            }
            console.log(btnId);
        });
    });
}
filterCategory()


function displayAdminMode() {
    if (sessionStorage.authToken) {
        const editBanner = document.createElement("div");
        editBanner.className = "edit";
        editBanner.innerHTML =
            '<p><a href= "#modal1" class="js-modal"><i class="fa-regular fa-pen-to-square"></i>Mode édition</a></p>';
        document.body.prepend(editBanner);
        document.querySelector(".log-button").textContent = "logout";
        //creation de link "mode editio"
        const editionMode = document.createElement("a");
        editionMode.className = "js-modal mode-edition";
        editionMode.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>Mode édition';
        editionMode.href = "#modal1" 
        document.querySelector(".projets-container").append(editionMode);
        console.log(editionMode);
        console.log( document.querySelector("#portfolio"))
        //pour casher le buttons filtres quand on ete dans la modalite mode editio
        filtres.style.display = "none"; 
        document.querySelector(".projets-title").classList.add("edit-mode");
        }else{
            document.querySelector(".projets-title").classList.remove("edit-mode");
        }
    
}
displayAdminMode();

let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

const openModal = function (e) {
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href"));
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    focusables[0].focus();
    modal.style.display = null;
    modal.removeAttribute("aria-hidden")
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal.
    querySelectorAll(".js-modal-close")
        .forEach((e) => e.addEventListener("click", closeModal))

    modal
        .querySelector(".js-modal-stop")
        .addEventListener("click", stopPropagation);
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

const stopPropagation = function (e) {
    e.stopPropagation();
}

const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.finIndex(f => f === modal.querySelector(":focus"))
    if (e.shiftKey === true) {
        index--
    } else {
        index++;
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus()
}


document.querySelectorAll(".js-modal").forEach(a => {
    a.addEventListener("click", openModal);

});
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {

    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e)

    }
});

async function deleteWork(workId, figureElement, event) {
     event.stopPropagation();

    const confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if (!confirmation) return; // Si l'utilisateur annule

    try {
        console.log(`Richiesta di cancellazione dell'elemento con ID: ${workId}`);
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
            console.log('Elemento da rimuovere', figureElement);
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
//Toggle function

const addPhotoButton = document.querySelector(".add-photo-button");
const backButton = document.querySelector(".js-modal-back");

addPhotoButton.addEventListener("click", toggleModal);
backButton.addEventListener("click", toggleModal);

function toggleModal() {
    const modalGallery = document.querySelector(".modal-gallery");
    const addModal = document.querySelector(".add-modal")
    if (modalGallery.style.display === "block" ||
        modalGallery.style.display === ""
    ) {
        modalGallery.style.display = "none";
        addModal.style.display = "block";
    } else {
        modalGallery.style.display = "block";
        addModal.style.display = "none";

    }
}

//  Add photo input
let img = document.createElement("img");
let file;
document.querySelector("#file").style.display = "none"

document.getElementById("file").addEventListener("change", function (event) {
     file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
        if (file.size <= 4 * 1024 * 1024) { // 4MB max
            const reader = new FileReader();
            reader.onload = function (e) {
               // const img = document.createElement("img");
                img.src = e.target.result;
                img.alt = "Uploaded Photo";
                document.getElementById("photo-container").appendChild(img);
                document.querySelector('.picture-loaded').style.display = "none";
            };
            reader.readAsDataURL(file);
        } else {
            alert("La taille du fichier dépasse 4 Mo");
        }
    } else {
        alert("Veuillez sélectionner une image au format JPG ou PNG");
    }
});
//handle picture submit 

const titleInput = document.getElementById("title");
let titleValue = "";

let selectedValue = "1";

document.getElementById("category").addEventListener("change", function () {
    selectedValue = this.value;
});

titleInput.addEventListener("input", function () {
    titleValue = titleInput.value;
    console.log("Titre actuel:", titleValue);
});
 const addPictureForm = document.getElementById("picture-form");

 addPictureForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const hasImage = document.querySelector("#photo-container").firstChild;
    if (hasImage && titleValue) {
        const formData = new FormData();
        if (file) {
         formData.append("image", file);
        }
     
         formData.append("title", titleValue);
         formData.append("category", selectedValue);
     
         const token = sessionStorage.authToken;
         if(!token) {
             console.log("Token d'authentification manquant.");
             return;
         }
     
         try {
             let response = await fetch('http://localhost:5678/api/works', {
                 method: "POST",
                 headers: {
                     Authorization: "Bearer " + token,
                 },
                 body: formData, // Invia direttamente il formData
             });
     
             if (response.status !== 200) {
                 const errorBox = document.createElement("div");
                 errorBox.className = "error-login";
                 errorBox.innerHTML = "il y a un erreur";
                 document.querySelector("form").prepend(errorBox);
             } else {
                 let result = await response.json();
                 console.log(result);
             }
         } catch (error) {
             console.error("Errore durante l'invio della richiesta:", error);
         }
        console.log("hasImage and titleValue is true");
    } else {
        alert("Vuillez remplir touts les champes");
    }

    // Creazione di un nuovo oggetto formData
 
});