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

    function renderPage() {
        const route = window.location.hash.slice(1) || "dashboard";

        if (route === "dashboard") {
            renderDashboard(
                container,
                getState(),
                () => navigate("inscriptions")
            );
            return;
        }

        if (route === "inscriptions") {
            renderInscriptions(
                container,
                getState(),
                (id) => navigate(`details/${id}`)
            );
            return;
        }

        if (route.startsWith("details/")) {
            const id = Number(route.split("/")[1]);
            const inscription = getInscriptionById(id);

            renderDetails(
                container,
                inscription,
                (inscriptionId, changes) => {
                    const updated = updateInscription(
                        inscriptionId,
                        changes
                    );

                    if (!updated) {
                        throw new Error("Inscription introuvable.");
                    }

                    renderPage();
                },
                () => navigate("inscriptions")
            );
            return;
        }

        navigate("dashboard");
    }

    document.querySelectorAll('nav a, .logo').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            if (href?.startsWith("#")) {
                event.preventDefault();
                navigate(href.slice(1));
            }
        });
    });

    window.addEventListener("hashchange", renderPage);

    renderPage();
}
