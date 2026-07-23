
let currentService = "";
let previousPage = "home";
let cameFromMenu = false;

/* =========================
   MENU 
========================= */

const menuBtn = document.getElementById("menuBtn");
const closeMenu = document.getElementById("closeMenu");
const sideMenu = document.getElementById("sideMenu");

menuBtn.onclick = () => { 
sideMenu.classList.add("active");
};

closeMenu.onclick = () => {
sideMenu.classList.remove("active");
};

/* =========================
   NAVIGATION ENTRE PAGES
========================= */

function showPage(pageId){

const pages = document.querySelectorAll(".page");

pages.forEach(page => {
page.classList.remove("active");
});

document.getElementById(pageId).classList.add("active");
const loading = document.getElementById("trackingLoading");

if(loading){
    loading.style.display = "none";
    clearTimeout(window.trackingLoadingTimeout);
}
cameFromMenu = sideMenu.classList.contains("active");
sideMenu.classList.remove("active");
}

/* =========================
   RETOUR INTELLIGENT
========================= */

function goBack(){

const current = document.querySelector(".page.active");

if(cameFromMenu){
sideMenu.classList.add("active");
cameFromMenu = false;
return;
}

if(current && current.id === "services"){
showPage("home");
return;
}

if(current && ["aide","comment","servicePage"].includes(current.id)){
sideMenu.classList.add("active");
return;
}

showPage("home");
}

/* =========================
   ONGLET ACCUEIL
========================= */

function showHomeTab(tab){

const sendForm = document.getElementById("sendForm");
const trackForm = document.getElementById("trackForm");

const sendTab = document.getElementById("sendTab");
const trackTab = document.getElementById("trackTab");

  const trackingLoading = document.getElementById("trackingLoading");
trackingLoading.style.display = "none";
if(tab === "send"){
sendForm.style.display = "block";
trackForm.style.display = "none";

sendTab.classList.add("active");
trackTab.classList.remove("active");
}

if(tab === "track"){
sendForm.style.display = "none";
trackForm.style.display = "block";

trackTab.classList.add("active");
sendTab.classList.remove("active");
}

if(typeof calculPrix === "function") calculPrix();
}

/* =========================
   WHATSAPP MENU
========================= */

function openWhatsApp(){

const phone = "678171894";
const message = "Bonjour, je souhaite vous contacter pour une livraison de colis.";

window.location.href =
`https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/* =========================
   SERVICE SELECTION
========================= */

function showService(type){

currentService = type;
previousPage = document.querySelector(".page.active").id;

showPage("servicePage");

const title = document.getElementById("serviceTitle");

const labels = {
moinschere: "Livraison en point relais📦⚡️",
standard: "Livraison Standard express 48h ✨📦",
lendemain: "Livraison Le lendemain (chrono 13)⏰🚚💨",
programmee: "Livraison Programmée⏰📦",
gros: "Livraison de Gros colis 🚚📦",
international: "Livraison Internationale (Europe)📦✈️"
};

title.innerText = labels[type] || "Service de livraison";

const label = document.getElementById("programmeeLabel");
const dateBox = document.getElementById("dateLivraison");
const warning = document.getElementById("warningDate");

const countrySelect = document.getElementById("countrySelect");
const countryDestination = document.getElementById("countryDestination");

/* pays visibles uniquement international */
if(type === "international"){
countrySelect.style.display = "block";
countryDestination.style.display = "block";
}else{
countrySelect.style.display = "none";
countryDestination.style.display = "none";
}

/* livraison programmée */
if(type === "programmee"){
label.style.display = "block";
dateBox.style.display = "block";
warning.style.display = "block";
}else{
label.style.display = "none";
dateBox.style.display = "none";
warning.style.display = "none";
}
const alertBox = document.getElementById("poidsAlert");
alertBox.style.display = "none";
alertBox.innerHTML = "";
clearTimeout(alertBox.hideTimeout);
setupPoids();
calculPrix();
}
/* =========================
   POIDS (MODIFIÉ)
========================= */

const poidsSelect = document.getElementById("poidsSelect");
const poidsInput = document.getElementById("poidsInput");
const prixInput = document.getElementById("prix");

function setupPoids(){

poidsSelect.innerHTML = "";

/* LENDemain + PROGRAMMÉE = INPUT */
if(currentService === "lendemain" || currentService === "programmee"){
poidsSelect.style.display = "none";
poidsInput.style.display = "block";
poidsInput.placeholder = "Entrez le poids de votre colis";
poidsInput.value = "";
poidsInput.oninput = calculPrix;
return;
}

/* GROS COLIS = INPUT */
if(currentService === "gros"){
poidsSelect.style.display = "none";
poidsInput.style.display = "block";
poidsInput.placeholder = "Entrez le poids de votre colis";
poidsInput.value = "";
poidsInput.oninput = calculPrix;
return;
}

/* 🌍 INTERNATIONAL = INPUT (MODIFIÉ) */
  /* 🌍 INTERNATIONAL = INPUT */
if(currentService === "international"){
    poidsSelect.style.display = "none";
    poidsInput.style.display = "block";
    poidsInput.placeholder = "Entrez le poids de votre colis";
    poidsInput.value = "";
    poidsInput.oninput = calculPrix;
    return;
}
  

/* AUTRES SERVICES = LISTE */
poidsInput.style.display = "none";
poidsSelect.style.display = "block";

let min = 1;
let max = 20;

if(currentService === "standard") min = 5, max = 100;
if(currentService !== "standard" && currentService !== "moinschere") max = 50;

for(let i = min; i <= max; i++){
let opt = document.createElement("option");
opt.value = i;
opt.textContent = i + " kg";
poidsSelect.appendChild(opt);
}

poidsSelect.onchange = calculPrix;
}

/* =========================
   PRIX (PARTIE 1 - BASE)
========================= */

function calculPrix(){
  const alertBox = document.getElementById("poidsAlert");
alertBox.style.display = "none";
alertBox.innerHTML = "";
clearTimeout(alertBox.hideTimeout);

let poids = 0;


/* ========= LENDemain ========= */
if(currentService === "lendemain"){
    poids = parseFloat(poidsInput.value);

    if(isNaN(poids) || poids <= 0){
        prixInput.value = "";
        return;
    }

    if(poids > 50){
      
        showPoidsAlert("Vous ne pouvez pas expédier un colis de plus de 50 kg avec le service Livraison Le lendemain. Veuillez plutôt choisir le service Livraison de Gros colis.");
        prixInput.value = "";
        return;
    }

    let tarif = 0;

    if(poids <= 1){
        tarif = 10.40;
    }else if(poids <= 2){
        tarif = 5.76;
    }else if(poids <= 3){
        tarif = 3.23;
    }else if(poids <= 5){
        tarif = 2.65;
    }else if(poids <= 8){
        tarif = 2.53;
    }else if(poids <= 10){
        tarif = 1.52;
    }else if(poids <= 13){
        tarif = 1.50;
    }else if(poids <= 15){
        tarif = 1.45;
    }else if(poids <= 18){
        tarif = 1.23;
    }else if(poids <= 20){
        tarif = 1.07;
    }else if(poids <= 23){
        tarif = 1.05;
    }else if(poids <= 25){
        tarif = 1.00;
    }else if(poids <= 28){
        tarif = 0.98;
    }else if(poids <= 30){
        tarif = 0.92;
    }else if(poids <= 40){
        tarif = 5.72;
    }else{
        tarif = 5.82;
    }

    let total = poids * tarif;
    prixInput.value = total.toFixed(2) + " €";
    return;
}

/* ========= PROGRAMMÉE ========= */
if(currentService === "programmee"){

poids = parseFloat(poidsInput.value);

if(isNaN(poids) || poids <= 0){
    prixInput.value = "";
    return;
}
  /* BLOCAGE AU-DESSUS DE 2000 KG */
if(poids > 2000){
    

    showPoidsAlert("Votre colis dépasse la limite autorisée de 2 000 kg pour une seule expédition.\n\nVeuillez répartir votre marchandise en deux ou plusieurs colis afin de garantir une livraison sécurisée et une meilleure prise en charge.");

    prixInput.value = "";
    return;
}


/* ===== 0 à 5 KG : COMPORTEMENT MOINS CHÈRE ===== */
if(poids <= 5){

    let tarif = 0;

    if(poids === 1){
        tarif = 5.90;
    }else if(poids <= 3){
        tarif = 3.20;
    }else if(poids <= 5){
        tarif = 3.18;
    }

    let total = poids * tarif;

    prixInput.value = total.toFixed(2) + " €";
    return;
}


/* ===== 5 à 50 KG : COMPORTEMENT STANDARD ===== */

if(poids > 5 && poids <= 50){

    let tarif = 0;
    let total = 0;

    if(poids > 5 && poids <= 10){
        tarif = 5.52;
    }else if(poids > 10 && poids <= 20){
        tarif = 3.52;
    }else if(poids > 20 && poids <= 30){
        tarif = 1.82;
    }else if(poids > 30 && poids <= 50){
        tarif = 1.86;
    }

    total = poids * tarif;

    prixInput.value = total.toFixed(2) + " €";
    return;
}


/* ===== 50 à 2000 KG : COMPORTEMENT GROS COLIS ===== */

if(poids > 50 && poids <= 2000){

    let tarif = 0;


    if(poids <= 60){
        tarif = 1.70;
    }else if(poids <= 70){
        tarif = 1.68;
    }else if(poids <= 80){
        tarif = 1.65;
    }else if(poids <= 90){
        tarif = 1.63;
    }else if(poids <= 100){
        tarif = 1.58;
    }else if(poids <= 120){
        tarif = 1.16;
    }else if(poids <= 140){
        tarif = 1.14;
    }else if(poids <= 150){
        tarif = 1.10;
    }else if(poids <= 180){
        tarif = 1.08;
    }else if(poids <= 200){
        tarif = 1.05;
    }else if(poids <= 280){
        tarif = 0.83;
    }else if(poids <= 310){
        tarif = 0.80;
    }else if(poids <= 350){
        tarif = 0.76;
    }else if(poids <= 400){
        tarif = 0.72;
    }else if(poids <= 450){
        tarif = 0.70;
    }else if(poids <= 500){
        tarif = 0.68;
    }else if(poids <= 600){
        tarif = 0.60;
    }else if(poids <= 700){
        tarif = 0.55;
    }else if(poids <= 800){
        tarif = 0.50;
    }else if(poids <= 900){
        tarif = 0.47;
    }else if(poids <= 1000){
        tarif = 0.45;
    }else{
        tarif = 0.40;

        const tranches = Math.floor((poids - 1001) / 50);
        tarif -= tranches * 0.01;

        if(tarif < 0.20){
            tarif = 0.20;
        }
    }

    let total = poids * tarif;

    prixInput.value = total.toFixed(2) + " €";
    return;
}


}
/* ========= GROS COLIS ========= */
/* ========/* ========= GROS COLIS ========= */
if(currentService === "gros"){
    poids = parseFloat(poidsInput.value);

    if(isNaN(poids) || poids <= 0){
        prixInput.value = "";
        return;
    }

    if(poids < 50){
      
        showPoidsAlert("Vous ne pouvez pas expédier un colis de moins de 50 kg avec le service Livraison de Gros colis. Veuillez plutôt choisir un autre service de livraison adapté au poids de votre colis.");
        prixInput.value = "";
        return;
    }

    let tarif = 0;

    if(poids === 50){
        tarif = 1.72;
    }else if(poids >= 51 && poids <= 60){
        tarif = 1.70;
    }else if(poids >= 61 && poids <= 70){
        tarif = 1.68;
    }else if(poids >= 71 && poids <= 80){
        tarif = 1.65;
    }else if(poids >= 81 && poids <= 90){
        tarif = 1.63;
    }else if(poids >= 91 && poids <= 100){
        tarif = 1.58;
    }else if(poids >= 101 && poids <= 120){
        tarif = 1.16;
    }else if(poids >= 121 && poids <= 140){
        tarif = 1.14;
    }else if(poids >= 141 && poids <= 150){
        tarif = 1.10;
    }else if(poids >= 151 && poids <= 180){
        tarif = 1.08;
    }else if(poids >= 181 && poids <= 200){
        tarif = 1.05;
    }else if(poids >= 201 && poids <= 280){
        tarif = 0.83;
    }else if(poids >= 281 && poids <= 310){
        tarif = 0.80;
    }else if(poids >= 311 && poids <= 350){
        tarif = 0.76;
    }else if(poids >= 351 && poids <= 400){
        tarif = 0.72;
    }else if(poids >= 401 && poids <= 450){
        tarif = 0.70;
    }else if(poids >= 451 && poids <= 500){
        tarif = 0.68;
    }else if(poids >= 501 && poids <= 600){
        tarif = 0.60;
    }else if(poids >= 601 && poids <= 700){
        tarif = 0.55;
    }else if(poids >= 701 && poids <= 800){
        tarif = 0.50;
    }else if(poids >= 801 && poids <= 900){
        tarif = 0.47;
    }else if(poids >= 901 && poids <= 1000){
        tarif = 0.45;
    }else{
      
if(poids > 2000){
        showPoidsAlert("Vous ne pouvez pas expédier un colis de plus de 2 000 kg en une seule expédition avec le service Livraison de Gros colis. Nous vous invitons à répartir votre marchandise en deux ou plusieurs expéditions afin de garantir une prise en charge rapide, sécurisée et conforme à nos conditions de transport.");
        prixInput.value = "";
        return;
    }

    // À partir de 1001 kg
    tarif = 0.40;

    // Le tarif baisse de 0,01 € tous les 50 kg
    const tranches = Math.floor((poids - 1001) / 50);
    tarif -= tranches * 0.01;

    // Tarif minimum
    if(tarif < 0.20){
        tarif = 0.20;
    }
}
// Calcul du prix final GROS COLIS
let total = poids * tarif;

prixInput.value = total.toFixed(2) + " €";

return;
    

}
  /* ========= INTERNATIONAL ========= */
/* ========= INTERNATIONAL ========= */
if(currentService === "international"){

    poids = parseFloat(poidsInput.value);

    if(isNaN(poids) || poids <= 0){
        prixInput.value = "";
        return;
    }

    if(poids > 50){
        showPoidsAlert("Vous ne pouvez pas expédier un colis de plus de 50 kg en une seule expédition avec le service Livraison Internationale. Nous vous conseillons de répartir votre marchandise en deux ou plusieurs colis afin de garantir une prise en charge rapide, sécurisée et conforme à nos conditions de transport.");
        prixInput.value = "";
        return;
    }

    const paysProches = ["Belgique", "Espagne", "Luxembourg"];

    const pays = document.getElementById("countryDestination").value;

    let tarif = 0;
    let total = 0;

    /* ===========================
       BELGIQUE / ESPAGNE / LUXEMBOURG
    =========================== */
    if(paysProches.includes(pays)){

        if(poids <= 0.5){
            total = 15.00;
        }else if(poids <= 1){
            tarif = 19.36;
            total = poids * tarif;
        }else if(poids <= 2){
            tarif = 11.06;
            total = poids * tarif;
        }else if(poids <= 5){
            tarif = 5.70;
            total = poids * tarif;
        }else if(poids <= 8){
            tarif = 5.56;
            total = poids * tarif;
        }else if(poids <= 10){
            tarif = 4.68;
            total = poids * tarif;
        }else if(poids <= 20){
            tarif = 4.68;
            total = poids * tarif;
        }else if(poids <= 25){
            tarif = 3.98;
            total = poids * tarif;
        }else if(poids <= 28){
            tarif = 3.32;
            total = poids * tarif;
        }else if(poids <= 30){
            tarif = 2.92;
            total = poids * tarif;
        }else if(poids <= 40){
            tarif = 2.32;
            total = poids * tarif;
        }else{
            tarif = 1.72;
            total = poids * tarif;
        }

    }

    /* ===========================
       AUTRES PAYS D'EUROPE
    =========================== */
    else{

        if(poids <= 0.5){
            total = 17.40;
        }else if(poids <= 1){
            tarif = 21.08;
            total = poids * tarif;
        }else if(poids <= 2){
            tarif = 11.88;
            total = poids * tarif;
        }else if(poids <= 4){
            tarif = 8.98;
            total = poids * tarif;
        }else if(poids <= 5){
            tarif = 7.06;
            total = poids * tarif;
        }else if(poids <= 8){
            tarif = 6.82;
            total = poids * tarif;
        }else if(poids <= 10){
            tarif = 5.58;
            total = poids * tarif;
        }else if(poids <= 14){
            tarif = 5.32;
            total = poids * tarif;
        }else if(poids <= 18){
            tarif = 5.08;
            total = poids * tarif;
        }else if(poids <= 20){
            tarif = 4.22;
            total = poids * tarif;
        }else if(poids <= 24){
            tarif = 4.18;
            total = poids * tarif;
        }else if(poids <= 28){
            tarif = 4.02;
            total = poids * tarif;
        }else if(poids <= 30){
            tarif = 3.41;
            total = poids * tarif;
        }else if(poids <= 33){
            tarif = 5.36;
            total = poids * tarif;
        }else if(poids <= 37){
            tarif = 5.28;
            total = poids * tarif;
        }else if(poids <= 40){
            tarif = 4.96;
            total = poids * tarif;
        }else if(poids <= 43){
            tarif = 4.93;
            total = poids * tarif;
        }else if(poids <= 47){
            tarif = 4.91;
            total = poids * tarif;
        }else{
            tarif = 4.86;
            total = poids * tarif;
        }

    }

    prixInput.value = total.toFixed(2) + " €";
    return;
}
 /* ========= MOINS CHÈRE ========= */
/* ========= MOINS CHÈRE ========= */
if(currentService === "moinschere"){
    poids = Number(poidsSelect.value);

    if(!poids || poids <= 0){
        prixInput.value = "";
        return;
    }

    let tarif = 0;

    if(poids === 1){
        tarif = 5.90;
    }else if(poids <= 3){
        tarif = 3.20;
    }else if(poids <= 5){
        tarif = 3.18;
    }else if(poids <= 8){
        tarif = 1.42;
    }else if(poids <= 10){
        tarif = 1.32;
    }else if(poids <= 20){
        tarif = 1.03;
    }

    let total = poids * tarif;

    prixInput.value = total.toFixed(2) + " €";
    return;
}


/* ========= STANDARD ========= */
/*/* ========= STANDARD ========= */
if(currentService === "standard"){
    poids = Number(poidsSelect.value);

    if(!poids || poids <= 0){
        prixInput.value = "";
        return;
    }

    let tarif = 0;
    let total = 0;

    if(poids === 5){
        total = 17.28;
    }else if(poids >= 6 && poids <= 10){
        tarif = 5.52;
        total = poids * tarif;
    }else if(poids > 10 && poids <= 20){
        tarif = 3.52;
        total = poids * tarif;
    }else if(poids > 20 && poids <= 30){
        tarif = 1.82;
        total = poids * tarif;
    }else if(poids > 30 && poids <= 50){
        tarif = 1.86;
        total = poids * tarif;
    }else if(poids > 50 && poids <= 100){
        tarif = 1.51;
        total = poids * tarif;
    }

    prixInput.value = total.toFixed(2) + " €";
    return;
}

/* ========= AUTRES SERVICES ========= */
poids = Number(poidsSelect.value);

if(!poids || poids <= 0){
prixInput.value = "";
return;
}

/* calcul par tranches */
let base = 5000;

if(poids <= 5) base = 3000;
else if(poids <= 10) base = 8000;
else if(poids <= 20) base = 12000;
else if(poids <= 50) base = 20000;
else base = 30000;

/* ❌ FCFA SUPPRIMÉ : remplacé par € */
prixInput.value = base.toFixed(2) + " €";
}
function showPoidsAlert(message){

const alertBox = document.getElementById("poidsAlert");

alertBox.innerHTML = "🔴 " + message;
alertBox.style.display = "block";

clearTimeout(alertBox.hideTimeout);

alertBox.hideTimeout = setTimeout(function(){
    alertBox.style.display = "none";
    alertBox.innerHTML = "";
},15000);

}
/* =========================
   DATES (14 JOURS)
========================= */

function generateDates(){

const dateLivraison = document.getElementById("dateLivraison");
dateLivraison.innerHTML = "";

let today = new Date();

for(let i = 1; i <= 14; i++){

let d = new Date();
d.setDate(today.getDate() + i);

let opt = document.createElement("option");
opt.value = d.toISOString().split("T")[0];
opt.textContent = d.toLocaleDateString("fr-FR");

dateLivraison.appendChild(opt);
}
}

generateDates();
/* =========================
   ENVOI WHATSAPP FINAL
========================= */

function sendWhatsapp(){
  



const erreur = document.getElementById("formError");
  
erreur.style.display = "none";
erreur.textContent = "";

const nom = document.getElementById("clientNom").value;
const tel = document.getElementById("clientTel").value;
const email = document.getElementById("clientEmail").value;
  const destNom = document.getElementById("destNom").value;
const destTel = document.getElementById("destTel").value;
const destEmail = document.getElementById("destEmail").value;
const description = document.getElementById("descriptionColis").value;
  /* Dimensions */

const longueur = document.getElementById("longueur").value;

const largeur = document.getElementById("largeur").value;

const hauteur = document.getElementById("hauteur").value;

/* pays */
const paysDepart = document.getElementById("countrySelect").value;
const paysDestination = document.getElementById("countryDestination").value;

const villeDepart = document.getElementById("villeDepart").value;
const cpDepart = document.getElementById("cpDepart").value;

const villeArrivee = document.getElementById("villeArrivee").value;
const cpArrivee = document.getElementById("cpArrivee").value;

/* poids */
let poids = "";

if(
currentService === "lendemain" ||
currentService === "programmee" ||
currentService === "gros" ||
currentService === "international"
){
poids = poidsInput.value + " kg";
}else{
poids = poidsSelect.value + " kg";
}

let prix = document.getElementById("prix").value;
  /* =========================
   VÉRIFICATION DU FORMULAIRE
========================= */

const champsObligatoires = [
    nom,
    tel,
    email,
    destNom,
    destTel,
    destEmail,
    description,
    longueur,
    largeur,
    hauteur,
    villeDepart,
    cpDepart,
    villeArrivee,
    cpArrivee,
    poids,
    prix
];

if(currentService === ""){
    erreur.innerHTML = "🔴 <strong>Veuillez d'abord choisir un service de livraison avant de poursuivre.</strong>";
    erreur.style.display = "block";
    erreur.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
    return;
}

if(currentService === "international"){
    champsObligatoires.push(paysDepart);
    champsObligatoires.push(paysDestination);
}

if(currentService === "programmee"){
    champsObligatoires.push(document.getElementById("dateLivraison").value);
}

const formulaireIncomplet = champsObligatoires.some(valeur => !String(valeur).trim());

if(formulaireIncomplet){
  erreur.style.animation = "none";
erreur.offsetHeight;
erreur.style.animation = "apparitionAlerte 0.3s ease";

    erreur.innerHTML =
    "⚠️ <strong>Impossible d'expédier votre colis.</strong><br><br>" +
    "Veuillez compléter toutes les informations obligatoires :<br>" +
    "• Vos informations personnelles<br>" +
    "• Les informations du destinataire<br>" +
    "• Le service de livraison choisi<br>" +
    "• Les informations concernant le colis (description, dimensions, poids, etc.)<br><br>" +
    "Une fois tous les champs correctement remplis, vous pourrez cliquer sur <strong>« Expédier maintenant »</strong>.";

    erreur.style.display = "block";

erreur.scrollIntoView({
    behavior: "smooth",
    block: "center"
});

// Le message disparaît automatiquement après 5 secondes
clearTimeout(erreur.hideTimeout);

erreur.hideTimeout = setTimeout(function () {
    erreur.style.display = "none";
    erreur.textContent = "";
}, 15000);

return;
}

/* date */
let date = document.getElementById("dateLivraison").value;

/* pays destination pour international */
let paysFinal = (currentService === "international") ? paysDestination : "France";

/* message WhatsApp */
const serviceChoisi = document.getElementById("serviceTitle").innerText;

let message =
`📦 ${serviceChoisi}

👤 Client: ${nom}
📞 Téléphone: ${tel}
📧 Email: ${email}
👤 Destinataire: ${destNom}
📞 Téléphone destinataire: ${destTel}
📧 Email destinataire: ${destEmail}

📦 Colis: ${description}

🌍 Pays de départ: ${currentService === "international" ? paysDepart : "France"}
📍 Départ: ${villeDepart} (${cpDepart})

🌍 Pays de destination: ${paysFinal}
📍 Arrivée: ${villeArrivee} (${cpArrivee})
📏 Dimensions :
• Longueur : ${longueur} m
• Largeur : ${largeur} m
• Hauteur : ${hauteur} m
⚖️ Poids: ${poids}
💰 Prix: ${prix}

📅 Date: ${date || "Non programmée"}`;
  console.log(message);
alert("Ouverture WhatsApp");

const phone = "237678171894";

window.location.href =
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

/* =========================
   CHARGEMENT DE LA ZONE BLEUE
========================= */

fetch("blue-section.html")
.then(response => {
    if (!response.ok) {
        throw new Error("Impossible de charger blue-section.html");
    }
    return response.text();
})
.then(html => {
    const container = document.getElementById("blueSectionContainer");

    if (!container) {
        console.error("Le conteneur blueSectionContainer est introuvable.");
        return;
    }

    container.innerHTML = html;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "blue-section.css";
    document.head.appendChild(css);

    const js = document.createElement("script");
    js.src = "blue-section.js";
    document.body.appendChild(js);
})
.catch(error => {
    console.error(error);
});
function retourAPropos() {
    showPage('home');

    setTimeout(() => {
        document.getElementById("blueSectionContainer").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 100);
}
function allerFormulaire() {
    showPage('home');

    setTimeout(() => {
        document.getElementById("formulaireExpedition").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }, 100);
}
const scrollTopBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", function(){

    const currentPage = document.querySelector(".page.active");

    // Cacher la flèche dans le menu
    if(sideMenu.classList.contains("active")){
        scrollTopBtn.style.display = "none";
        return;
    }

    // Cacher la flèche sur certaines pages
    if(
        currentPage.id === "comment" ||
        currentPage.id === "services" ||
        currentPage.id === "servicePage"
    ){
        scrollTopBtn.style.display = "none";
        return;
    }

    // Cacher la flèche sur "Suivre une expédition"
    if(
        currentPage.id === "home" &&
        document.getElementById("trackForm").style.display === "block"
    ){
        scrollTopBtn.style.display = "none";
        return;
    }

    const videoSection = document.querySelector(".trackingPresentation");

    if(!videoSection) return;

    const position = videoSection.getBoundingClientRect();

    if(position.top <= 250){
        scrollTopBtn.style.display = "block";
    }else{
        scrollTopBtn.style.display = "none";
    }

});
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
function changeLanguage(lang){

    const frBtn = document.getElementById("frBtn");
    const enBtn = document.getElementById("enBtn");

    frBtn.classList.remove("active");
    enBtn.classList.remove("active");

    if(lang === "fr"){
        frBtn.classList.add("active");
    }else{
        enBtn.classList.add("active");
    }

const loading = document.getElementById("languageLoading");

loading.style.display = "inline-flex";

setTimeout(function(){
    loading.style.display = "none";
},2000);


}

function showTrackingAlert(message, success = false){

    const alertBox = document.getElementById("trackingAlert");

    if(success){
        alertBox.innerHTML = "🟢 " + message;
        alertBox.style.color = "#0b7a0b";
        alertBox.style.background = "#e8ffe8";
        alertBox.style.border = "1px solid #0b7a0b";
    }else{
        alertBox.innerHTML = "🔴 " + message;
        alertBox.style.color = "#c00000";
        alertBox.style.background = "#ffe5e5";
        alertBox.style.border = "1px solid #c00000";
    }

    alertBox.style.display = "block";

    clearTimeout(alertBox.hideTimeout);

    alertBox.hideTimeout = setTimeout(function(){
        alertBox.style.display = "none";
        alertBox.innerHTML = "";
    },12000);
}

function searchTracking(){

    const code = document.getElementById("trackingNumber").value.trim();
const loading = document.getElementById("trackingLoading");

// Arrêter un chargement déjà en cours
loading.style.display = "none";
clearTimeout(window.trackingLoadingTimeout);

const alertBox = document.getElementById("trackingAlert");
alertBox.style.display = "none";
alertBox.innerHTML = "";

if(code.length < 16){
    showTrackingAlert("Le numéro de suivi est incomplet. Veuillez saisir un numéro de suivi composé exactement de 16 chiffres.");
    return;
}

if(code.length > 16){
    showTrackingAlert("Le numéro de suivi dépasse la longueur autorisée. Un numéro de suivi doit contenir exactement de 16 chiffres. Veuillez vérifier votre saisie et supprimer les chiffres en trop.");
    return;
}

// Exactement 16 chiffres
showTrackingAlert("Code valide.", true);
loading.innerHTML = `
    <span class="loadingIcon"></span>
    <span> Vérification en cours...</span>
`;

loading.style.display = "flex";

setTimeout(() => {
    loading.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}, 100);

window.trackingLoadingTimeout = setTimeout(function () {
    loading.style.display = "none";
}, 60000);
}
/* =====================================================
   COOKIES - PARTIE 1/3
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    const overlay = document.getElementById("cookieOverlay");

    const consent = localStorage.getItem("cookieConsent");
    const consentTime = localStorage.getItem("cookieConsentTime");


    if (!consent || !consentTime) {

        setTimeout(function () {
            overlay.style.display = "flex";
        }, 3000);

    } else {

        const now = Date.now();
        const elapsed = now - Number(consentTime);

        // 24 heures = 86400000 ms
        if (elapsed >= 86400000) {

            localStorage.removeItem("cookieConsent");
            localStorage.removeItem("cookieConsentTime");

            setTimeout(function () {
                overlay.style.display = "flex";
            }, 3000);

        }

    }

});


/* =========================
   TOUT ACCEPTER
========================= */

function acceptCookies() {

    localStorage.setItem("cookieConsent", "accepted");
    localStorage.setItem("cookieConsentTime", Date.now());

    document.getElementById("cookieOverlay").style.display = "none";

}


/* =========================
   TOUT REFUSER
========================= */

function rejectCookies() {

    localStorage.setItem("cookieConsent", "rejected");
    localStorage.setItem("cookieConsentTime", Date.now());

    document.getElementById("cookieOverlay").style.display = "none";

}
/* =====================================================
   COOKIES - PARTIE 2/3
===================================================== */

/* =========================
   OUVRIR LES PRÉFÉRENCES
========================= */

function openCookieSettings() {

    document.getElementById("cookieOverlay").style.display = "none";
    document.getElementById("cookieSettingsBox").style.display = "flex";

}


/* =========================
   RETOUR AU BANDEAU COOKIES
========================= */

function closeCookieSettings() {

    document.getElementById("cookieSettingsBox").style.display = "none";
    document.getElementById("cookieOverlay").style.display = "flex";

}


/* =========================
   ENREGISTRER LES PRÉFÉRENCES
========================= */

function saveCookieSettings() {
  const performance = document.getElementById("cookiePerformance").checked;
const audience = document.getElementById("cookieAudience").checked;
const preferences = document.getElementById("cookiePreferences").checked;
const marketing = document.getElementById("cookieMarketing").checked;

if(!performance && !audience && !preferences && !marketing){

    const errorToast = document.getElementById("cookieErrorToast");

    errorToast.style.display = "block";

    setTimeout(function(){

        errorToast.style.display = "none";

    },5000);

    return;

}

    const settings = {

        necessary: true,

        performance: document.getElementById("cookiePerformance").checked,

        audience: document.getElementById("cookieAudience").checked,

        preferences: document.getElementById("cookiePreferences").checked,

        marketing: document.getElementById("cookieMarketing").checked

    };

    localStorage.setItem(
    "cookieConsent",
    JSON.stringify(settings)
);

localStorage.setItem("cookieConsentTime", Date.now());

    document.getElementById("cookieSettingsBox").style.display = "none";

    const toast = document.getElementById("cookieToast");

    toast.style.display = "block";

    setTimeout(function () {

        toast.style.display = "none";

        document.getElementById("cookieOverlay").style.display = "none";

    }, 1500);

}
/* =====================================================
   COOKIES - PARTIE 3/3
===================================================== */

/* =========================
   EMPÊCHER LES DOUBLES CLICS
========================= */

let cookieChoiceMade = false;


/* =========================
   RÉINITIALISER LES COOKIES
========================= */

function resetCookieConsent() {

    localStorage.removeItem("cookieConsent");
    localStorage.removeItem("cookieConsentTime");

    cookieChoiceMade = false;

    document.getElementById("cookieOverlay").style.display = "none";
    document.getElementById("cookieSettingsBox").style.display = "none";

    setTimeout(function () {

        document.getElementById("cookieOverlay").style.display = "flex";

    }, 3000);

}

/* =========================
   VÉRIFICATION AU RETOUR
========================= */

window.addEventListener("pageshow", function () {

    const consent = localStorage.getItem("cookieConsent");

    if (consent) {

        document.getElementById("cookieOverlay").style.display = "none";
        document.getElementById("cookieSettingsBox").style.display = "none";

    }

});


/* =========================
   BLOQUER LES DOUBLES CLICS
========================= */

document.addEventListener("click", function (e) {

    if (
        e.target.classList.contains("cookieAccept") ||
        e.target.classList.contains("cookieReject")
    ) {

        if (cookieChoiceMade) {
            e.preventDefault();
            return;
        }

        cookieChoiceMade = true;

    }

});


function togglePrivacyPolicy(){

    const policy = document.getElementById("privacyPolicyText");
    const windowCookie = document.querySelector(".cookieWindow");

    if(policy.style.display === "block"){

        policy.style.display = "none";

    }else{

        policy.style.display = "block";

        setTimeout(function(){

            windowCookie.scrollTo({
                top: windowCookie.scrollHeight,
                behavior: "smooth"
            });

        },100);

    }

}
