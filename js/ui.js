
export function escapeHTML(value) {
    const characters = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    };

    return String(value ?? "").replace(
        /[&<>"']/g,
        (character) => characters[character]
    );
}

// Afficher un message dans un conteneur
export function renderMessage(container, message) {
    container.innerHTML = `
        <p class="empty-message">
            ${escapeHTML(message)}
        </p>
    `;
}

// Formater un prix en DH
export function formatPrice(price) {
    const montant = Number(price);

    if (!Number.isFinite(montant)) {
        return "0 DH";
    }

    return `${montant.toLocaleString("fr-MA")} DH`;
}

// Formater une date
export function formatDate(date) {
    if (!date) {
        return "—";
    }

    const valeur = String(date);

    let parsedDate;

    if (/^\d{4}-\d{2}-\d{2}$/.test(valeur)) {
        const [annee, mois, jour] = valeur.split("-").map(Number);

        parsedDate = new Date(annee, mois - 1, jour);

        // Vérifier que la date existe réellement
        if (
            parsedDate.getFullYear() !== annee ||
            parsedDate.getMonth() !== mois - 1 ||
            parsedDate.getDate() !== jour
        ) {
            return "—";
        }
    } else {
        parsedDate = new Date(valeur);
    }

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("fr-MA").format(parsedDate);
}
