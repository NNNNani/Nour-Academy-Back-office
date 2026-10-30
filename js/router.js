
import { renderAddStudent } from "./addStudent.js";
import { renderDashboard } from "./dashboard.js";
import { renderInscriptions } from "./inscriptions.js";
import { renderDetails } from "./details.js";

import {
  getState,
  getInscriptionById,
  updateInscription
} from "./state.js";

export function initRouter(container) {

  function navigate(page) {
    window.location.hash = page;
  }

  function updateNavigation(route) {
    const links = document.querySelectorAll(".sidebar-nav .nav-link");

    links.forEach((link) => {
      const href = link.getAttribute("href");

      link.classList.remove("active");

      if (
        (route === "dashboard" && href === "#dashboard") ||
        (
          (route === "inscriptions" ||
           route.startsWith("details/") ||
           route === "add-student") &&
          href === "#inscriptions"
        )
      ) {
        link.classList.add("active");
      }
    });
  }

  function updateTitle(route) {
    const title = document.querySelector("#page-title");

    if (!title) return;

    if (route === "dashboard") {
      title.textContent = "Tableau de bord";
    } else if (route === "inscriptions") {
      title.textContent = "Gestion des inscriptions";
    } else if (route.startsWith("details/")) {
      title.textContent = "Détails du dossier";
    } else if (route === "add-student") {
      title.textContent = "Ajouter un étudiant";
    }
  }

  function renderPage() {
    const route = window.location.hash.slice(1) || "dashboard";

    updateNavigation(route);
    updateTitle(route);

    // Tableau de bord
    if (route === "dashboard") {
      renderDashboard(
        container,
        getState(),
        () => navigate("inscriptions")
      );
      return;
    }

    // Liste des inscriptions
    if (route === "inscriptions") {
      renderInscriptions(
        container,
        getState(),
        (id) => navigate(`details/${id}`)
      );
      return;
    }

    // Détails d'une inscription
    if (route.startsWith("details/")) {
      const id = Number(route.split("/")[1]);
      const inscription = getInscriptionById(id);

      renderDetails(
        container,
        inscription,
        (inscriptionId, changes) => {
          const updated = updateInscription(inscriptionId, changes);

          if (!updated) {
            throw new Error("Inscription introuvable.");
          }

          renderPage();
        },
        () => navigate("inscriptions")
      );
      return;
    }

    // Ajouter un étudiant
    if (route === "add-student") {
      renderAddStudent(
        container,
        () => navigate("inscriptions")
      );
      return;
    }

    // Route inconnue
    navigate("dashboard");
  }

  window.addEventListener("hashchange", renderPage);

  renderPage();
}
