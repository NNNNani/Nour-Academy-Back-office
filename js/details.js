
import { escapeHTML, formatDate, formatPrice } from "./ui.js";
import { STATUTS, isValidStatus } from "./validation.js";

export function renderDetails(
    container,
    inscription,
    onSave,
    onBack
) {
    if (!inscription) {
        container.innerHTML = `
            <section class="panel">
                <h2>Inscription introuvable</h2>
                <p>Le dossier demandé n'existe pas.</p>
                <button id="retourListe" class="btn-secondary" type="button">
                    Retour aux inscriptions
                </button>
            </section>
        `;

        container.querySelector("#retourListe").addEventListener(
            "click",
            onBack
        );

        return;
    }

    container.innerHTML = `
        <section class="details-page">

            <section class="panel">
                <div class="panel-header">
                    <div>
                        <h2>Dossier ${escapeHTML(inscription.numeroDossier)}</h2>
                        <p>Informations complètes de l'inscription</p>
                    </div>

                    <span class="badge ${
                        inscription.statut === "Payée"
                            ? "badge-success"
                            : inscription.statut === "Validée"
                            ? "badge-info"
                            : "badge-warning"
                    }">
                        ${escapeHTML(inscription.statut)}
                    </span>
                </div>
            </section>

            <div class="details-grid">

                <section class="panel">
                    <h3>Informations de l'élève</h3>

                    <div class="detail-item">
                        <span>Nom complet</span>
                        <strong>${escapeHTML(inscription.eleve)}</strong>
                    </div>

                    <div class="detail-item">
                        <span>Niveau scolaire</span>
                        <strong>${escapeHTML(inscription.niveau)}</strong>
                    </div>

                    <div class="detail-item">
                        <span>Cours</span>
                        <strong>${escapeHTML(inscription.cours)}</strong>
                    </div>

                    <div class="detail-item">
                        <span>Centre</span>
                        <strong>${escapeHTML(inscription.centre)}</strong>
                    </div>
                </section>

                <section class="panel">
                    <h3>Informations du dossier</h3>

                    <div class="detail-item">
                        <span>Numéro de dossier</span>
                        <strong>${escapeHTML(inscription.numeroDossier)}</strong>
                    </div>

                    <div class="detail-item">
                        <span>Téléphone parent</span>
                        <strong>${escapeHTML(inscription.telephoneParent)}</strong>
                    </div>

                    <div class="detail-item">
                        <span>Date d'inscription</span>
                        <strong>${escapeHTML(formatDate(inscription.date))}</strong>
                    </div>

                    <div class="detail-item">
                        <span>Prix</span>
                        <strong>${escapeHTML(formatPrice(inscription.prix))}</strong>
                    </div>
                </section>

            </div>

            <section class="panel">
                <h3>Modifier le statut du dossier</h3>
                <p>Choisissez le nouveau statut de cette inscription.</p>

                <form id="formStatut" class="details-form">

                    <label for="nouveauStatut">Statut</label>

                    <select id="nouveauStatut" required>
                        ${STATUTS.map((statut) => `
                            <option
                                value="${escapeHTML(statut)}"
                                ${inscription.statut === statut ? "selected" : ""}
                            >
                                ${escapeHTML(statut)}
                            </option>
                        `).join("")}
                    </select>

                    <div class="details-actions">
                        <button class="btn-primary" type="submit">
                            Enregistrer les modifications
                        </button>

                        <button id="retourListe" class="btn-secondary" type="button">
                            Retour aux inscriptions
                        </button>
                    </div>

                    <p id="messageStatut" aria-live="polite"></p>

                </form>
            </section>

        </section>
    `;

    container.querySelector("#retourListe").addEventListener(
        "click",
        onBack
    );

    container.querySelector("#formStatut").addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            const statut = container.querySelector("#nouveauStatut").value;
            const message = container.querySelector("#messageStatut");

            if (!isValidStatus(statut)) {
                message.textContent = "Veuillez choisir un statut valide.";
                return;
            }

            if (statut === inscription.statut) {
                message.textContent = "Aucune modification détectée.";
                return;
            }

            try {
                onSave(inscription.id, { statut });

                message.textContent = "Statut enregistré avec succès.";
                message.className = "success-message";

            } catch (error) {
                console.error(error);
                message.textContent = "Erreur lors de l'enregistrement.";
                message.className = "error-message";
            }
        }
    );
}
