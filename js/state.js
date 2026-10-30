
import {
    getInscriptions,
    saveInscriptions
} from "./storage.js";

// Charger les inscriptions depuis localStorage
let inscriptions = getInscriptions();

// Récupérer toutes les inscriptions
export function getState() {
    return [...inscriptions];
}

// Mettre à jour l'état et sauvegarder
export function setState(newInscriptions) {
    if (!Array.isArray(newInscriptions)) {
        throw new Error("Les inscriptions doivent être un tableau.");
    }

    inscriptions = newInscriptions;
    saveInscriptions(inscriptions);
}

// Récupérer une inscription par son ID
export function getInscriptionById(id) {
    return inscriptions.find(
        (item) => item.id === Number(id)
    );
}

// Modifier une inscription
export function updateInscription(id, updatedData) {
    const index = inscriptions.findIndex(
        (item) => item.id === Number(id)
    );

    if (index === -1) {
        return false;
    }

    inscriptions[index] = {
        ...inscriptions[index],
        ...updatedData
    };

    saveInscriptions(inscriptions);

    return true;
}

// Ajouter une inscription
export function addInscription(inscription) {
    const existe = inscriptions.some(
        (item) => item.id === inscription.id
    );

    if (existe) {
        throw new Error("Cette inscription existe déjà.");
    }

    inscriptions.push(inscription);
    saveInscriptions(inscriptions);

    return inscription;
}

// Supprimer une inscription
export function deleteInscription(id) {
    const inscriptionExiste = inscriptions.some(
        (item) => item.id === Number(id)
    );

    if (!inscriptionExiste) {
        return false;
    }

    inscriptions = inscriptions.filter(
        (item) => item.id !== Number(id)
    );

    saveInscriptions(inscriptions);

    return true;
}
