//variable//

//const email = document.querySelector("form #email");
//const password = document.querySelector("form #password");
//const form = document.querySelector("form");
//const messageErreur = document.getElementById("contact");
//creation tbleau//

const loginApi = "http://localhost:5678/api/users/login";

document.getElementById("loginform").addEventListener("submit", handleSubmit);
async function handleSubmit(event) {
    event.preventDefault();
    let user = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value,
    };
    
    let response = await fetch(loginApi, {
    method: "POST", 
    headers: {
        "Content-Type": "application/json", 
        
    },
    body: JSON.stringify(user),
 });
 if(response.status != 200){
    const errorBox = document.createElement("div");
    errorBox.className = "error-login";
    errorBox.innerHTML = "il y a un erreur";
    document.querySelector("form").prepend(errorBox);
}else{
    let result = await response.json();
    const token = result.token;
 sessionStorage.setItem("authToken", token);
 window.location.href = "../index.html";
 }
}
