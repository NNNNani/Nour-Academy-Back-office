
import { getState, addInscription } from "./state.js";
import { validateInscription } from "./validation.js";

export function renderAddStudent(container, onCancel) {

  container.innerHTML = `
    <section class="panel">

      <div class="panel-header">
        <div>
          <h2>Ajouter une inscription</h2>
          <p>Remplissez les informations du nouvel étudiant.</p>
        </div>
      </div>

      <form id="addStudentForm" class="details-form">

        <label for="eleve">Nom complet de l'étudiant</label>
        <input
          id="eleve"
          name="eleve"
          type="text"
          required
          placeholder="Ex : Yassine Amrani"
        >

        <label for="niveau">Niveau scolaire</label>
        <input
          id="niveau"
          name="niveau"
          type="text"
          required
          placeholder="Ex : 2ème Bac"
        >

        <label for="cours">Cours</label>
        <input
          id="cours"
          name="cours"
          type="text"
          required
          placeholder="Ex : Mathématiques"
        >

        <label for="centre">Centre</label>
        <select id="centre" name="centre" required>
          <option value="">Choisir un centre</option>
          <option value="Nador Centre">Nador Centre</option>
          <option value="Hay Al Matar">Hay Al Matar</option>
          <option value="Selouane">Selouane</option>
        </select>

        <label for="telephoneParent">Téléphone du parent</label>
        <input
          id="telephoneParent"
          name="telephoneParent"
          type="tel"
          required
          placeholder="Ex : 06XXXXXXXX"
        >

        <label for="prix">Prix (DH)</label>
        <input
          id="prix"
          name="prix"
          type="number"
          min="0"
          required
          placeholder="350"
        >

        <label for="statut">Statut</label>
        <select id="statut" name="statut" required>
          <option value="En attente">En attente</option>
          <option value="Validée">Validée</option>
          <option value="Payée">Payée</option>
        </select>

        <div id="formMessage" role="alert"></div>

        <div class="form-actions">
          <button type="button" id="cancelAdd" class="btn-secondary">
            Annuler
          </button>

          <button type="submit" class="btn-primary">
            Ajouter l'étudiant
          </button>
        </div>

      </form>
    </section>
  `;

  const form = container.querySelector("#addStudentForm");
  const message = container.querySelector("#formMessage");

  // Retour à la liste
  container.querySelector("#cancelAdd").addEventListener("click", onCancel);

  // Ajouter un étudiant
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const student = {
      id: Date.now(),
      numeroDossier: `NA${Date.now()}`,
      eleve: formData.get("eleve").trim(),
      niveau: formData.get("niveau").trim(),
      cours: formData.get("cours").trim(),
      telephoneParent: formData.get("telephoneParent").trim(),
      centre: formData.get("centre"),
      prix: Number(formData.get("prix")),
      statut: formData.get("statut"),
      date: new Date().toISOString().slice(0, 10)
    };

    // Vérifier les informations
    const validation = validateInscription(student);

    if (!validation.valid) {
      message.textContent = validation.erreurs.join(" - ");
      return;
    }

    // Récupérer les données actuelles
    const inscriptions = getState();

    // Vérifier les doublons
    const duplicate = inscriptions.some(item =>
      item.eleve.trim().toLowerCase() === student.eleve.toLowerCase() &&
      item.cours.trim().toLowerCase() === student.cours.toLowerCase()
    );

    if (duplicate) {
      message.textContent =
        "Cet étudiant est déjà inscrit à ce cours.";
      return;
    }

    // Vérifier la capacité du groupe
    const groupCount = inscriptions.filter(item =>
      item.cours.trim().toLowerCase() === student.cours.toLowerCase() &&
      item.centre === student.centre &&
      item.niveau.trim().toLowerCase() === student.niveau.toLowerCase()
    ).length;

    if (groupCount >= 15) {
      message.textContent =
        "Ce groupe a atteint sa capacité maximale de 15 étudiants.";
      return;
    }

    // Enregistrer l'inscription
    try {
      addInscription(student);

      alert("Inscription ajoutée avec succès !");

      onCancel();

    } catch (error) {
      message.textContent =
        error.message || "Une erreur est survenue.";
    }
  });
}
