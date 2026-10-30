
import { initRouter } from "./router.js";

const contenu = document.getElementById("page-content");

if (!contenu) {
    throw new Error("Élément #page-content introuvable.");
}

initRouter(contenu);
