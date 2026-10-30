
import { escapeHTML, formatDate, formatPrice } from "./ui.js";

export function renderInscriptions(container, inscriptions, onDetails) {
  container.innerHTML = `
    <section class="panel">
      <div class="panel-header">
        <div>
          <h2>Liste des inscriptions</h2>
          <p>Gérez les dossiers des étudiants.</p>
        </div>

        <button id="addStudentBtn" class="btn-primary">
          + Ajouter un étudiant
        </button>
      </div>

      <div class="filters">
        <input
          type="search"
          id="searchInput"
          placeholder="Rechercher un étudiant..."
        >

        <select id="statusFilter">
          <option value="">Tous les statuts</option>
          <option value="En attente">En attente</option>
          <option value="Validée">Validée</option>
          <option value="Payée">Payée</option>
        </select>

        <select id="sortFilter">
          <option value="recent">Plus récent</option>
          <option value="old">Plus ancien</option>
          <option value="name">Nom A-Z</option>
        </select>
      </div>

      <div class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>Dossier</th>
              <th>Étudiant</th>
              <th>Niveau</th>
              <th>Cours</th>
              <th>Téléphone</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody id="inscriptionsTable"></tbody>
        </table>
      </div>

      <p id="emptyMessage" class="empty-message"></p>
    </section>
  `;

  const searchInput = container.querySelector("#searchInput");
  const statusFilter = container.querySelector("#statusFilter");
  const sortFilter = container.querySelector("#sortFilter");
  const table = container.querySelector("#inscriptionsTable");
  const emptyMessage = container.querySelector("#emptyMessage");

  // Ouvrir le formulaire d'ajout
  container.querySelector("#addStudentBtn").addEventListener("click", () => {
    window.location.hash = "add-student";
  });

  function displayInscriptions() {
    const search = searchInput.value.toLowerCase();
    const status = statusFilter.value;
    const sort = sortFilter.value;

    let filtered = inscriptions.filter(item => {
      const searchableText = [
        item.numeroDossier,
        item.eleve,
        item.niveau,
        item.cours,
        item.telephoneParent,
        item.centre
      ].join(" ").toLowerCase();

      const matchesSearch = searchableText.includes(search);
      const matchesStatus = !status || item.statut === status;

      return matchesSearch && matchesStatus;
    });

    if (sort === "recent") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sort === "old") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sort === "name") {
      filtered.sort((a, b) => a.eleve.localeCompare(b.eleve));
    }

    table.innerHTML = "";

    if (filtered.length === 0) {
      emptyMessage.textContent = "Aucune inscription trouvée.";
      return;
    }

    emptyMessage.textContent = "";

    filtered.forEach(item => {
      const row = document.createElement("tr");

      let badgeClass = "badge-pending";

      if (item.statut === "Validée") {
        badgeClass = "badge-validated";
      } else if (item.statut === "Payée") {
        badgeClass = "badge-paid";
      }

      row.innerHTML = `
        <td>${escapeHTML(item.numeroDossier)}</td>
        <td>${escapeHTML(item.eleve)}</td>
        <td>${escapeHTML(item.niveau)}</td>
        <td>${escapeHTML(item.cours)}</td>
        <td>${escapeHTML(item.telephoneParent)}</td>
        <td>
          <span class="${badgeClass}">
            ${escapeHTML(item.statut)}
          </span>
        </td>
        <td>${formatDate(item.date)}</td>
        <td>
          <button class="btn-secondary"
            data-details="${escapeHTML(item.id)}">
            Voir
          </button>
        </td>
      `;

      table.appendChild(row);
    });

    table.querySelectorAll("[data-details]").forEach(button => {
      button.addEventListener("click", () => {
        onDetails(Number(button.dataset.details));
      });
    });
  }

  searchInput.addEventListener("input", displayInscriptions);
  statusFilter.addEventListener("change", displayInscriptions);
  sortFilter.addEventListener("change", displayInscriptions);

  displayInscriptions();
}
