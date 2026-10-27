import { getState } from "./state.js";

const app = document.querySelector("#page-content");
const inscriptions = getState();

app.innerHTML = `
    < section class="stats">
        < article class="stat-card" >
            <h2> Total des inscriptions </h2>
            <p>${ inscriptions.length }</p>
        </article>
    </section>

    <h2>Test des données</h2>
    <p>Les données sont chargées correctement.</p>
`;

