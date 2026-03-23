import { setupFormHandler } from "./components/formHandler.js";
import { setupRefundChart } from "./components/refundChart.js";

async function fetchAndDisplayVratky(tableBody, filter = "active") {
    try {
        const response = await fetch(`./getData.php?filter=${filter}`);

        if (!response.ok) {
            throw new Error("HTTP error " + response.status);
        }

        const text = await response.text();

        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            console.error("❌ RAW RESPONSE:", text);
            throw new Error("Invalid JSON from server");
        }

        if (!Array.isArray(data)) {
            console.error("❌ Neplatná data:", data);
            return;
        }

        tableBody.innerHTML = "";

        data.forEach(item => {
            const row = document.createElement("tr");

            const repDate = item.repDate
                ? item.repDate.split("T")[0]
                : "-";

            const createdAt = item.createdAt
                ? item.createdAt.replace("T", " ").split(".")[0]
                : "-";

            row.innerHTML = `
                <td>${item.PersonalNum ?? "-"}</td>
                <td>${item.MaterialNum ?? "-"}</td>
                <td>${item.amount ?? "-"}</td>
                <td>${item.type ?? "-"}</td>
                <td>${item.target ?? "-"}</td>
                <td>${item.reason ?? "-"}</td>
                <td>${repDate}</td>
                <td>${createdAt}</td>
                <td class="
                    ${item.state === 'active' ? 'state-active' : ''}
                    ${item.state === 'approved' ? 'state-approved' : ''}
                    ${item.state === 'closed' ? 'state-closed' : ''}
                ">
                    ${item.state ?? "-"}
                </td>
            `;

            tableBody.appendChild(row);
        });

    } catch (err) {
        console.error("❌ Chyba při načítání vratek:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("vratkaForm");
    const tableBody = document.getElementById("vratkyTable");

    const activeBtn = document.getElementById("filterActive");
    const historyBtn = document.getElementById("filterHistory");
    const graphsBtn = document.getElementById("Graphs");

    const tableContainer = tableBody?.closest("table")?.parentElement;
    const graphContainer = document.getElementById("graphContainer");

    setupFormHandler(form, fetchAndDisplayVratky, tableBody);

    if (tableContainer) tableContainer.style.display = "block";
    if (graphContainer) graphContainer.style.display = "none";

    fetchAndDisplayVratky(tableBody, "active");
    if (activeBtn) activeBtn.classList.add("active");

    if (activeBtn && historyBtn && graphsBtn) {
        const buttons = [activeBtn, historyBtn, graphsBtn];

        const setActive = (btn) => {
            buttons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        };

        activeBtn.addEventListener("click", () => {
            if (tableContainer) tableContainer.style.display = "block";
            if (graphContainer) graphContainer.style.display = "none";

            fetchAndDisplayVratky(tableBody, "active");
            setActive(activeBtn);
        });

        historyBtn.addEventListener("click", () => {
            if (tableContainer) tableContainer.style.display = "block";
            if (graphContainer) graphContainer.style.display = "none";

            fetchAndDisplayVratky(tableBody, "history");
            setActive(historyBtn);
        });

        graphsBtn.addEventListener("click", async () => {
            if (tableContainer) tableContainer.style.display = "none";
            if (graphContainer) graphContainer.style.display = "block";

            try {
                const response = await fetch("./getData.php?filter=all");

                if (!response.ok) {
                    throw new Error("HTTP error " + response.status);
                }

                const text = await response.text();

                let data;
                try {
                    data = JSON.parse(text);
                } catch (e) {
                    console.error("❌ RAW RESPONSE:", text);
                    throw new Error("Invalid JSON from server");
                }

                if (!data || data.length === 0) {
                    console.warn("⚠️ Žádná data pro graf");
                    return;
                }

                setupRefundChart(data);

            } catch (err) {
                console.error("❌ Graph fetch error:", err);
            }

            setActive(graphsBtn);

            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });
            }, 150);
        });
    }
});