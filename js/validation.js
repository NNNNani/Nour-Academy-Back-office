
export const STATUTS = [
    "En attente",
    "Validée",
    "Payée"
];

export function isValidStatus(statut) {
    return STATUTS.includes(statut);
}

export function validateInscription(inscription) {
    const erreurs = [];

    if (!inscription.eleve?.trim()) {
        erreurs.push("Le nom de l'élève est obligatoire.");
    }

    if (!inscription.niveau?.trim()) {
        erreurs.push("Le niveau est obligatoire.");
    }

    if (!isValidStatus(inscription.statut)) {
        erreurs.push("Le statut est invalide.");
    }

    return {
        valid: erreurs.length === 0,
        erreurs
    };
}
