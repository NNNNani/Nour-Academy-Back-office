
import { escapeHTML, formatDate, formatPrice } from "./ui.js";

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

    const recettes = inscriptions
        .filter((item) => item.statut === "Payée")
        .reduce((total, item) => total + Number(item.prix || 0), 0);

    const tauxRemplissage = total > 0
        ? Math.round((payees / total) * 100)
        : 0;

    const recentes = [...inscriptions]
        .sort((a, b) => String(b.date).localeCompare(String(a.date)))
        .slice(0, 5);

    container.innerHTML = `
        <section class="dashboard-page">

            <div class="stats-grid">

                <article class="stat-card">
                    <div class="stat-card-info">
                        <p>Total des inscriptions</p>
                        <h2>${total}</h2>
                    </div>
                    <span class="stat-icon">📋</span>
                </article>

                <article class="stat-card">
                    <div class="stat-card-info">
                        <p>En attente</p>
                        <h2>${enAttente}</h2>
                    </div>
                    <span class="stat-icon">⏳</span>
                </article>

                <article class="stat-card">
                    <div class="stat-card-info">
                        <p>Validées</p>
                        <h2>${validees}</h2>
                    </div>
                    <span class="stat-icon">✓</span>
                </article>

                <article class="stat-card">
                    <div class="stat-card-info">
                        <p>Payées</p>
                        <h2>${payees}</h2>
                    </div>
                    <span class="stat-icon">💰</span>
                </article>

            </div>

            <section class="panel">
                <div class="panel-header">
                    <div>
                        <h2>Vue financière</h2>
                        <p>Résumé des paiements enregistrés</p>
                    </div>
                </div>

                <div class="dashboard-finance">
                    <div>
                        <p>Recettes encaissées</p>
                        <h2>${formatPrice(recettes)}</h2>
                    </div>

                    <div>
                        <p>Taux de paiement</p>
                        <h2>${tauxRemplissage}%</h2>
                    </div>
                </div>
            </section>

            <section class="panel">
                <div class="panel-header">
                    <div>
                        <h2>Dernières inscriptions</h2>
                        <p>Les cinq dossiers les plus récents</p>
                    </div>

                    <button id="voirInscriptions" class="btn-primary" type="button">
                        Voir tout
                    </button>
                </div>

                ${
                    recentes.length > 0
                        ? `
                            <div class="table-wrapper">
                                <table class="data-table">
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
                                            </tr>
                                        `).join("")}
                                    </tbody>
                                </table>
                            </div>
                        `
                        : `<p class="empty-state">Aucune inscription enregistrée.</p>`
                }

            </section>
        </section>
    `;

    document.getElementById("voirInscriptions").addEventListener(
        "click",
        onNavigate
    );
}
