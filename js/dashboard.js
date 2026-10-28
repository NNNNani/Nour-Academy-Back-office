
import { escapeHTML, formatDate } from "./ui.js";

export function renderDashboard(container, inscriptions, onNavigate) {
    const total = inscriptions.length;

    const enAttente = inscriptions.filter(
        (item) => item.statut === "En attente"
    ).length;

    const validees = inscriptions.filter(
        (item) => item.statut === "Validée"
    ).length;

    const payees = inscriptions.filter(
        (item) => item.statut === "Payée"
    ).length;

    const recentes = [...inscriptions]
        .sort((a, b) => String(b.date).localeCompare(String(a.date)))
        .slice(0, 5);

    container.innerHTML = `
        <section class="admin-page">
            <div class="section-heading">
                <h2>Dashboard</h2>
                <p>Bienvenue dans l'espace administration de Nour Academy.</p>
            </div>

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
                    <h3>Validées</h3>
                    <p class="admin-number">${validees}</p>
                </article>

                <article class="admin-card">
                    <h3>Payées</h3>
                    <p class="admin-number">${payees}</p>
                </article>
            </div>

            <section class="recent-section">
                <h3>Dernières inscriptions</h3>

                ${
                    recentes.length
                        ? `
                            <div class="admin-table-wrapper">
                                <table class="admin-table">
                                    <thead>
                                        <tr>
                                            <th>Dossier</th>
                                            <th>Élève</th>
                                            <th>Date</th>
                                            <th>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${recentes.map((item) => `
                                            <tr>
                                                <td>${escapeHTML(item.numeroDossier)}</td>
                                                <td>${escapeHTML(item.eleve)}</td>
                                                <td>${escapeHTML(formatDate(item.date))}</td>
                                                <td>${escapeHTML(item.statut)}</td>
                                            </tr>
                                        `).join("")}
                                    </tbody>
                                </table>
                            </div>
                        `
                        : "<p>Aucune inscription enregistrée.</p>"
                }

                <button id="voirInscriptions" type="button">
                    Consulter les inscriptions
                </button>
            </section>
        </section>
    `;

    document.getElementById("voirInscriptions").addEventListener(
        "click",
        onNavigate
    );
}
