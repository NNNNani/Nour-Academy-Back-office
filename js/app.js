
import {
    getInscriptions,
    saveInscriptions
} from "./storage.js";

const contenu = document.getElementById("page-content");

let inscriptions = getInscriptions();
let inscriptionSelectionnee = null;

// Navigation entre les pages
document.querySelectorAll('nav a, .logo').forEach(function (lien) {
    lien.addEventListener("click", function (event) {
        const page = lien.getAttribute("href").substring(1);

        if (["dashboard", "inscriptions"].includes(page)) {
            event.preventDefault();
            afficherPage(page);
            history.replaceState(null, "", "#" + page);
        }
    });
});

// Afficher la page demandée
function afficherPage(page) {
    if (page === "dashboard") {
        afficherDashboard();
    } else if (page === "inscriptions") {
        afficherInscriptions();
    } else if (page === "details") {
        afficherDetails();
    }
}

// DASHBOARD
function afficherDashboard() {
    const total = inscriptions.length;

    const enAttente = inscriptions.filter(function (i) {
        return (i.statut || "En attente") === "En attente";
    }).length;

    const acceptees = inscriptions.filter(function (i) {
        return i.statut === "Acceptée";
    }).length;

    contenu.innerHTML = `
        <section class="admin-page">
            <h2>Dashboard</h2>
            <p>Bienvenue dans l'espace administration de Nour Academy.</p>

            <div class="admin-stats">
                <article class="admin-card">
                    <h3>Total des inscriptions</h3>
                    <p class="admin-number">${total}</p>
                </article>

                <article class="admin-card">
                    <h3>En attente</h3>
                    <p class="admin-number">${enAttente}</p>
                </article>

                <article class="admin-card">
                    <h3>Acceptées</h3>
                    <p class="admin-number">${acceptees}</p>
                </article>
            </div>

            <h3>Dernières inscriptions</h3>

            ${
                total === 0
                    ? `<p>Aucune inscription enregistrée pour le moment.</p>`
                    : `
                        <button id="voirInscriptions" type="button">
                            Consulter les inscriptions
                        </button>
                    `
            }
        </section>
    `;

    const bouton = document.getElementById("voirInscriptions");

    if (bouton) {
        bouton.addEventListener("click", function () {
            afficherPage("inscriptions");
            history.replaceState(null, "", "#inscriptions");
        });
    }
}

// PAGE INSCRIPTIONS
function afficherInscriptions() {
    contenu.innerHTML = `
        <section class="admin-page">
            <h2>Gestion des inscriptions</h2>
            <p>Consultez et gérez les dossiers des élèves.</p>

            <div class="admin-filters">
                <input
                    id="recherche"
                    type="search"
                    placeholder="Rechercher un parent ou un élève..."
                >

                <select id="filtreStatut">
                    <option value="">Tous les statuts</option>
                    <option value="En attente">En attente</option>
                    <option value="Acceptée">Acceptée</option>
                    <option value="Refusée">Refusée</option>
                </select>
            </div>

            <div id="tableInscriptions"></div>

            <button id="retourDashboard" type="button">
                Retour au Dashboard
            </button>
        </section>
    `;

    document.getElementById("recherche").addEventListener(
        "input",
        afficherTableau
    );

    document.getElementById("filtreStatut").addEventListener(
        "change",
        afficherTableau
    );

    document.getElementById("retourDashboard").addEventListener(
        "click",
        function () {
            afficherPage("dashboard");
            history.replaceState(null, "", "#dashboard");
        }
    );

    afficherTableau();
}

// Afficher le tableau et appliquer les filtres
function afficherTableau() {
    const recherche = document.getElementById("recherche")
        .value.toLowerCase();

    const statut = document.getElementById("filtreStatut").value;

    const resultat = inscriptions.filter(function (i) {
        const parent = String(
            i.parentName || i.nomParent || i.parent || ""
        ).toLowerCase();

        const eleve = String(
            i.studentName || i.nomEleve || i.eleve || ""
        ).toLowerCase();

        const statutInscription = i.statut || "En attente";

        return (
            (parent.includes(recherche) || eleve.includes(recherche)) &&
            (statut === "" || statutInscription === statut)
        );
    });

    const tableau = document.getElementById("tableInscriptions");

    if (resultat.length === 0) {
        tableau.innerHTML = "<p>Aucune inscription trouvée.</p>";
        return;
    }

    tableau.innerHTML = `
        <div class="admin-table-wrapper">
            <table class="admin-table">
                <thead>
                    <tr>
                        <th>Parent</th>
                        <th>Élève</th>
                        <th>Niveau</th>
                        <th>Statut</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    ${resultat.map(function (i) {
                        const index = inscriptions.indexOf(i);

                        return `
                            <tr>
                                <td>${echapper(
                                    i.parentName || i.nomParent || i.parent || "—"
                                )}</td>

                                <td>${echapper(
                                    i.studentName || i.nomEleve || i.eleve || "—"
                                )}</td>

                                <td>${echapper(
                                    i.studentLevel || i.niveau || "—"
                                )}</td>

                                <td>${echapper(
                                    i.statut || "En attente"
                                )}</td>

                                <td>
                                    <button
                                        type="button"
                                        data-details="${index}"
                                    >
                                        Détails
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join("")}
                </tbody>
            </table>
        </div>
    `;

    tableau.querySelectorAll("[data-details]").forEach(function (bouton) {
        bouton.addEventListener("click", function () {
            inscriptionSelectionnee = Number(bouton.dataset.details);
            afficherPage("details");
            history.replaceState(null, "", "#details");
        });
    });
}

// PAGE DÉTAILS
function afficherDetails() {
    const i = inscriptions[inscriptionSelectionnee];

    if (!i) {
        afficherPage("inscriptions");
        return;
    }

    contenu.innerHTML = `
        <section class="admin-page">
            <h2>Détails de l'inscription</h2>

            <p><strong>Parent :</strong>
                ${echapper(i.parentName || i.nomParent || i.parent || "—")}
            </p>

            <p><strong>Email :</strong>
                ${echapper(i.parentEmail || i.email || "—")}
            </p>

            <p><strong>Téléphone :</strong>
                ${echapper(i.parentPhone || i.telephone || "—")}
            </p>

            <p><strong>Élève :</strong>
                ${echapper(i.studentName || i.nomEleve || i.eleve || "—")}
            </p>

            <p><strong>Niveau :</strong>
                ${echapper(i.studentLevel || i.niveau || "—")}
            </p>

            <p><strong>Statut actuel :</strong>
                ${echapper(i.statut || "En attente")}
            </p>

            <label for="nouveauStatut">Modifier le statut</label>

            <select id="nouveauStatut">
                <option value="En attente">En attente</option>
                <option value="Acceptée">Acceptée</option>
                <option value="Refusée">Refusée</option>
            </select>

            <button id="enregistrerStatut" type="button">
                Enregistrer le statut
            </button>

            <button id="retourListe" type="button">
                Retour aux inscriptions
            </button>
        </section>
    `;

    document.getElementById("nouveauStatut").value =
        i.statut || "En attente";

    document.getElementById("enregistrerStatut").addEventListener(
        "click",
        function () {
            i.statut = document.getElementById("nouveauStatut").value;

            localStorage.setItem(
                CLE_STOCKAGE,
                JSON.stringify(inscriptions)
            );

            alert("Statut mis à jour.");

            afficherPage("details");
        }
    );

    document.getElementById("retourListe").addEventListener(
        "click",
        function () {
            afficherPage("inscriptions");
            history.replaceState(null, "", "#inscriptions");
        }
    );
}

// Éviter d'interpréter les données comme du HTML
function echapper(valeur) {
    return String(valeur).replace(/[&<>"']/g, function (caractere) {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return caracteres[caractere];
    });
}

// Ajouter un style de base pour les composants de l'administration
const style = document.createElement("style");

style.textContent = `
    .admin-page {
        padding: 24px 0;
    }

    .admin-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        gap: 16px;
        margin: 24px 0;
    }

    .admin-card {
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 12px;
    }

    .admin-number {
        font-size: 32px;
        font-weight: 800;
    }

    .admin-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin: 20px 0;
    }

    .admin-filters input,
    .admin-filters select,
    .admin-page select {
        padding: 10px;
    }

    .admin-table-wrapper {
        overflow-x: auto;
        margin: 20px 0;
    }

    .admin-table {
        width: 100%;
        border-collapse: collapse;
    }

    .admin-table th,
    .admin-table td {
        padding: 12px;
        border-bottom: 1px solid #ddd;
        text-align: left;
    }

    .admin-page button {
        margin: 6px 6px 6px 0;
        padding: 10px 14px;
        cursor: pointer;
    }
`;

document.head.appendChild(style);

// Démarrer l'application
const pageInitiale = location.hash.substring(1);

if (["dashboard", "inscriptions", "details"].includes(pageInitiale)) {
    afficherPage(pageInitiale === "details" ? "inscriptions" : pageInitiale);
} else {
    afficherPage("dashboard");
}
