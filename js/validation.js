
export const STATUTS = [
    "En attente",
    "Validée",
    "Payée"
];

// Vérifier si le statut est valide
export function isValidStatus(statut) {
    return STATUTS.includes(statut);
}

// Vérifier les données d'une inscription
export function validateInscription(inscription) {
    const erreurs = [];

    if (!inscription.eleve?.trim()) {
        erreurs.push("Le nom de l'élève est obligatoire.");
    }

    if (!inscription.niveau?.trim()) {
        erreurs.push("Le niveau est obligatoire.");
    }

    if (!inscription.cours?.trim()) {
        erreurs.push("Le cours est obligatoire.");
    }

    if (!inscription.telephoneParent?.trim()) {
        erreurs.push("Le téléphone du parent est obligatoire.");
    }

    if (
        inscription.telephoneParent &&
        !/^[0-9+\s()-]{8,20}$/.test(inscription.telephoneParent.trim())
    ) {
        erreurs.push("Le numéro de téléphone est invalide.");
    }

    if (!inscription.centre?.trim()) {
        erreurs.push("Le centre est obligatoire.");
    }

    if (!isValidStatus(inscription.statut)) {
        erreurs.push("Le statut est invalide.");
    }

    if (
        inscription.prix === undefined ||
        inscription.prix === null ||
        inscription.prix === "" ||
        !Number.isFinite(Number(inscription.prix)) ||
        Number(inscription.prix) < 0
    ) {
        erreurs.push("Le prix doit être un nombre positif ou nul.");
    }

    return {
        valid: erreurs.length === 0,
        erreurs
    };
}
