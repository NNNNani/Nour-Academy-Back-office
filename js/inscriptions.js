
import { escapeHTML, formatDate, formatPrice } from "./ui.js";
import { STATUTS } from "./validation.js";
import { exportCSV } from "./export.js";

export function renderInscriptions(container, inscriptions, onDetails) {
    container.innerHTML = `
        <section class="admin-page">
            <div class="section-heading">
                <h2>Gestion des inscriptions</h2>
                <p>Consultez et gérez les dossiers des élèves.</p>
            </div>

            <div class="admin-filters">
                <input
                    id="recherche"
                    type="search"
                    placeholder="Rechercher un élève, dossier, téléphone..."
                    aria-label="Rechercher une inscription"
                >

                <select id="filtreStatut" aria-label="Filtrer par statut">
                    <option value="">Tous les statuts</option>
                    ${STATUTS.map((statut) => `
                        <option value="${escapeHTML(statut)}">
                            ${escapeHTML(statut)}
                        </option>
                    `).join("")}
                </select>

                <button id="exporterInscriptions" type="button">
                    Exporter CSV
                </button>
            </div>

            <p id="nombreResultats" aria-live="polite"></p>
            <div id="tableInscriptions"></div>

            <button id="retourDashboard" type="button">
                Retour au Dashboard
            </button>
        </section>
    `;

    const recherche = document.getElementById("recherche");
    const filtreStatut = document.getElementById("filtreStatut");
    const tableau = document.getElementById("tableInscriptions");
    const nombreResultats = document.getElementById("nombreResultats");

    function afficherResultats() {
        const terme = recherche.value.trim().toLowerCase();
        const statutChoisi = filtreStatut.value;

        const resultats = inscriptions.filter((item) => {
            const texteRecherche = [
                item.numeroDossier,
                item.eleve,
                item.niveau,
                item.telephoneParent,
                item.cours,
                item.centre
            ].join(" ").toLowerCase();

            return (
                texteRecherche.includes(terme) &&
                (!statutChoisi || item.statut === statutChoisi)
            );
        });

        nombreResultats.textContent =
            `${resultats.length} inscription(s) trouvée(s)`;

        if (!resultats.length) {
            tableau.innerHTML = "<p>Aucune inscription trouvée.</p>";
            return;
        }

        tableau.innerHTML = `
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>N° dossier</th>
                            <th>Élève</th>
                            <th>Niveau</th>
                            <th>Téléphone parent</th>
                            <th>Centre</th>
                            <th>Cours</th>
                            <th>Prix</th>
                            <th>Date</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        ${resultats.map((item) => `
                            <tr>
                                <td>${escapeHTML(item.numeroDossier)}</td>
                                <td>${escapeHTML(item.eleve)}</td>
                                <td>${escapeHTML(item.niveau)}</td>
                                <td>${escapeHTML(item.telephoneParent)}</td>
                                <td>${escapeHTML(item.centre)}</td>
                                <td>${escapeHTML(item.cours)}</td>
                                <td>${escapeHTML(formatPrice(item.prix))}</td>
                                <td>${escapeHTML(formatDate(item.date))}</td>
                                <td>
                                    <span class="status status-${item.statut === "Payée" ? "payee" : item.statut === "Validée" ? "validee" : "attente"}">
                                        ${escapeHTML(item.statut)}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        type="button"
                                        data-details="${item.id}"
                                    >
                                        Détails
                                    </button>
                                </td>
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;

        tableau.querySelectorAll("[data-details]").forEach((button) => {
            button.addEventListener("click", () => {
                onDetails(Number(button.dataset.details));
            });
        });
    }

    recherche.addEventListener("input", afficherResultats);
    filtreStatut.addEventListener("change", afficherResultats);

    document.getElementById("exporterInscriptions").addEventListener(
        "click",
        () => exportCSV(inscriptions)
    );

    document.getElementById("retourDashboard").addEventListener(
        "click",
        () => {
            window.location.hash = "dashboard";
        }
    );

    afficherResultats();
}
