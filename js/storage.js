
import demoData from "../data/demo-data.js";

const STORAGE_KEY = "nourAcademyInscriptions";

export function getInscriptions() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData !== null) {
            const inscriptions = JSON.parse(savedData);

            if (Array.isArray(inscriptions)) {
                return inscriptions;
            }
        }
    } catch (error) {
        console.error("Erreur de lecture des inscriptions :", error);
    }

    const initialData = demoData.map((item) => ({ ...item }));
    saveInscriptions(initialData);

    return initialData;
}

export function saveInscriptions(inscriptions) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inscriptions));
    } catch (error) {
        console.error("Erreur de sauvegarde :", error);
        throw error;
    }
}

export function resetInscriptions() {
    const initialData = demoData.map((item) => ({ ...item }));
    saveInscriptions(initialData);

    return initialData;
}
