
export function exportCSV(inscriptions) {
    const colonnes = [
        ["numeroDossier", "N° dossier"],
        ["eleve", "Élève"],
        ["niveau", "Niveau"],
        ["telephoneParent", "Téléphone parent"],
        ["cours", "Cours"],
        ["centre", "Centre"],
        ["prix", "Prix"],
        ["date", "Date"],
        ["statut", "Statut"]
    ];

    function protegerValeur(value) {
        let texte = String(value ?? "");

        if (/^[=+\-@\t\r]/.test(texte)) {
            texte = "'" + texte;
        }

        return `"${texte.replace(/"/g, '""')}"`;
    }

    const lignes = [
        colonnes.map((colonne) => protegerValeur(colonne[1])),
        ...inscriptions.map((item) =>
            colonnes.map(([cle]) => protegerValeur(item[cle]))
        )
    ];

    const contenuCSV = "\uFEFF" +
        lignes.map((ligne) => ligne.join(";")).join("\r\n");

    const fichier = new Blob(
        [contenuCSV],
        { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(fichier);
    const lien = document.createElement("a");

    lien.href = url;
    lien.download = "nour-academy-inscriptions.csv";
    document.body.appendChild(lien);
    lien.click();
    lien.remove();

    URL.revokeObjectURL(url);
}
