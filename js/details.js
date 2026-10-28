
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
            <section class="admin-page">
                <p>Inscription introuvable.</p>
                <button id="retourListe" type="button">
                    Retour aux inscriptions
                </button>
            </section>
        `;

        document.getElementById("retourListe").addEventListener(
            "click",
            onBack
        );
        return;
    }

    container.innerHTML = `
        <section class="admin-page">
            <div class="section-heading">
                <h2>Détails de l'inscription</h2>
                <p>Dossier ${escapeHTML(inscription.numeroDossier)}</p>
            </div>

            <div class="details-grid">
                <article class="admin-card">
                    <h3>Informations de l'élève</h3>
                    <p><strong>Nom :</strong> ${escapeHTML(inscription.eleve)}</p>
                    <p><strong>Niveau :</strong> ${escapeHTML(inscription.niveau)}</p>
                    <p><strong>Cours :</strong> ${escapeHTML(inscription.cours)}</p>
                    <p><strong>Centre :</strong> ${escapeHTML(inscription.centre)}</p>
                </article>

                <article class="admin-card">
                    <h3>Informations du dossier</h3>
                    <p><strong>Numéro :</strong> ${escapeHTML(inscription.numeroDossier)}</p>
                    <p><strong>Téléphone parent :</strong> ${escapeHTML(inscription.telephoneParent)}</p>
                    <p><strong>Date :</strong> ${escapeHTML(formatDate(inscription.date))}</p>
                    <p><strong>Prix :</strong> ${escapeHTML(formatPrice(inscription.prix))}</p>
                    <p><strong>Statut actuel :</strong> ${escapeHTML(inscription.statut)}</p>
                </article>
            </div>

            <form id="formStatut" class="details-form">
                <label for="nouveauStatut">Modifier le statut</label>

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

                <button type="submit">Enregistrer le statut</button>
                <button id="retourListe" type="button">
                    Retour aux inscriptions
                </button>

                <p id="messageStatut" aria-live="polite"></p>
            </form>
        </section>
    `;

    document.getElementById("retourListe").addEventListener(
        "click",
        onBack
    );

    document.getElementById("formStatut").addEventListener(
        "submit",
        (event) => {
            event.preventDefault();

            const statut = document.getElementById("nouveauStatut").value;
            const message = document.getElementById("messageStatut");

            if (!isValidStatus(statut)) {
                message.textContent = "Veuillez choisir un statut valide.";
                return;
            }

            try {
                onSave(inscription.id, { statut });
                message.textContent = "Statut enregistré avec succès.";
            } catch (error) {
                console.error(error);
                message.textContent = "Erreur lors de l'enregistrement.";
            }
        }
    );
}
