
import {
    getInscriptions,
    saveInscriptions
} from "./storage.js";

let inscriptions = getInscriptions();

export function getState() {
    return inscriptions;
}

export function setState(newInscriptions) {
    inscriptions = newInscriptions;
    saveInscriptions(inscriptions);
}

export function getInscriptionById(id) {
    return inscriptions.find((item) => item.id === Number(id));
}

export function updateInscription(id, updatedData) {
    const inscriptionExiste = inscriptions.some(
        (item) => item.id === Number(id)
    );

    if (!inscriptionExiste) {
        return false;
    }

    const nouvellesInscriptions = inscriptions.map((item) =>
        item.id === Number(id)
            ? { ...item, ...updatedData }
            : item
    );

    setState(nouvellesInscriptions);
    return true;
}

export function addInscription(inscription) {
    setState([...inscriptions, inscription]);
}

export function deleteInscription(id) {
    setState(
        inscriptions.filter((item) => item.id !== Number(id))
    );
}
