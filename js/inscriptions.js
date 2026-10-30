
import { escapeHTML, formatDate, formatPrice } from "./ui.js";
import { STATUTS } from "./validation.js";
import { exportCSV } from "./export.js";

export function renderInscriptions(container, inscriptions, onDetails) {

    container.innerHTML = `
        <section class="inscriptions-page">

            <section class="panel">
                <div class="panel-header">
                    <div>
                        <h2>Gestion des inscriptions</h2>
                        <p>Consultez et gérez les dossiers des élèves.</p>
                    </div>

                    <button id="exporterInscriptions" class="btn-primary" type="button">
                        Exporter CSV
                    </button>
                </div>

                <div class="filters">
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

                    <select id="triDate" aria-label="Trier par date">
                        <option value="recent">Plus récent</option>
                        <option value="ancien">Plus ancien</option>
                    </select>
                </div>

                <p id="nombreResultats" aria-live="polite"></p>

                <div id="tableInscriptions"></div>
            </section>

        </section>
    `;

    const recherche = container.querySelector("#recherche");
    const filtreStatut = container.querySelector("#filtreStatut");
    const triDate = container.querySelector("#triDate");
    const tableau = container.querySelector("#tableInscriptions");
    const nombreResultats = container.querySelector("#nombreResultats");

    function afficherResultats() {
        const terme = recherche.value.trim().toLowerCase();
        const statutChoisi = filtreStatut.value;
        const ordre = triDate.value;

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

        resultats.sort((a, b) => {
            const comparaison = String(a.date).localeCompare(String(b.date));

            return ordre === "recent" ? -comparaison : comparaison;
        });

        nombreResultats.textContent =
            `${resultats.length} inscription(s) trouvée(s)`;

        if (resultats.length === 0) {
            tableau.innerHTML = `
                <p class="empty-state">
                    Aucune inscription trouvée.
                </p>
            `;
            return;
        }

        tableau.innerHTML = `
            <div class="table-wrapper">
                <table class="data-table">
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
                                    <span class="badge ${
                                        item.statut === "Payée"
                                            ? "badge-success"
                                            : item.statut === "Validée"
                                            ? "badge-info"
                                            : "badge-warning"
                                    }">
                                        ${escapeHTML(item.statut)}
                                    </span>
                                </td>

                                <td>
                                    <button
                                        class="btn-secondary"
                                        type="button"
                                        data-details="${escapeHTML(item.id)}"
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
    triDate.addEventListener("change", afficherResultats);

    container.querySelector("#exporterInscriptions").addEventListener(
        "click",
        () => exportCSV(inscriptions)
    );

    afficherResultats();
}
