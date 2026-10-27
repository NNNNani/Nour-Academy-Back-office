
const STORAGE_info = "inscriptions";

if (localStorage.getItem(STORAGE_info) === null) {
    localStorage.setItem(
        STORAGE_info,
        JSON.stringify(demoData)
    );
}

function getInscriptions() {
    return JSON.parse(localStorage.getItem(STORAGE_info));
}

function saveInscriptions(inscriptions) {
    localStorage.setItem(
        STORAGE_info,
        JSON.stringify(inscriptions)
    );
}
