
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

export function renderMessage(container, message) {
    container.innerHTML = `
        <p class="empty-message">${escapeHTML(message)}</p>
    `;
}

export function formatPrice(price) {
    return `${Number(price) || 0} DH`;
}

export function formatDate(date) {
    if (!date) return "—";

    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return "—";
    }

    return new Intl.DateTimeFormat("fr-MA").format(parsedDate);
}

