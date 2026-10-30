
import demoData from "../data/demo-data.js";

const STORAGE_KEY = "nourAcademyInscriptions";

// Charger les données initiales
function getDemoData() {
    return demoData.map((item) => ({ ...item }));
}

// Récupérer les inscriptions depuis localStorage
export function getInscriptions() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (savedData !== null) {
            const inscriptions = JSON.parse(savedData);

            if (Array.isArray(inscriptions)) {
                return inscriptions;
            }

            console.warn("Les données enregistrées sont invalides.");
        }
    } catch (error) {
        console.error(
            "Erreur de lecture des inscriptions :",
            error
        );
    }

    const initialData = getDemoData();

    saveInscriptions(initialData);

    return initialData;
}

// Sauvegarder les inscriptions
export function saveInscriptions(inscriptions) {
    if (!Array.isArray(inscriptions)) {
        throw new Error("Les données doivent être un tableau.");
    }

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(inscriptions)
        );
    } catch (error) {
        console.error(
            "Erreur de sauvegarde des inscriptions :",
            error
        );

        throw error;
    }
}

// Réinitialiser les données de démonstration
export function resetInscriptions() {
    const initialData = getDemoData();

    saveInscriptions(initialData);

    return initialData;
}
