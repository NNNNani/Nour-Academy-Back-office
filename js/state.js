
import { getInscriptions, saveInscriptions } from "./storage.js";

let inscriptions = getInscriptions();

export function getState() {
    return inscriptions;
}

export function setState(newInscriptions) {
    inscriptions = newInscriptions;
    saveInscriptions(inscriptions);
}

export function addInscription(inscription) {
    inscriptions = [...inscriptions, inscription];
    saveInscriptions(inscriptions);
}

export function updateInscription(id, updatedData) {
    inscriptions = inscriptions.map((item) =>
        item.id === id ? { ...item, ...updatedData } : item
    );

    saveInscriptions(inscriptions);
}

export function deleteInscription(id) {
    inscriptions = inscriptions.filter((item) => item.id !== id);
    saveInscriptions(inscriptions);
}
