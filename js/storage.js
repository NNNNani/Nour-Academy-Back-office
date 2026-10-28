import demoData from "../data/demo-data.js";

const STORAGE_KEY = "nourAcademyInscriptions";

export function getInscriptions() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData !== null) {
        try {
            const inscriptions = JSON.parse(savedData);

            if (Array.isArray(inscriptions)) {
                return inscriptions;
            }
        } catch (error) {
            console.error("Erreur de lecture :", error);
        }
    }

    const initialData = demoData.map(function (item) {
        return { ...item };
    });

    saveInscriptions(initialData);

    return initialData;
}

export function saveInscriptions(inscriptions) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(inscriptions)
    );
}

export function resetInscriptions() {
    const initialData = demoData.map(function (item) {
        return { ...item };
    });

    saveInscriptions(initialData);

    return initialData;
}
