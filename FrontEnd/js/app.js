/*verifier que son json server et bien en route*/
 /*verifier*/
 const gallery = document.querySelector(".gallery");


/*function pour qui retourn le tableau  des wors*/

async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    return await response.json();
}
getWorks();
 
/*Affichage des works dans le dom */
async function affichageWorks() {
const arrayWorks = await getWorks();    
 arrayWorks.forEach((work) => {
 const figure = document.createElement("figure");
 const img = document.createElement("img")
 const figcaption = document.createElement("figcaption");
 img.src = work.imageUrl;
 figcaption.textContent = work.title;
 //figure.classList.add(");
 figure.appendChild(img);
 figure.appendChild(figcaption);
 gallery.appendChild(figure);
 });   
}
affichageWorks()
