import { fetchAndDisplayVratky } from "./components/fetchAndDisplayVratky.js";
import { setupFormHandler } from "./components/formHandler.js";
import { setupRefundChart } from "./components/refundChart.js";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("vratkaForm");
    const tableBody = document.getElementById("vratkyTable");

    const activeBtn = document.getElementById("filterActive");
    const historyBtn = document.getElementById("filterHistory");
    const graphsBtn = document.getElementById("Graphs");

    const tableContainer = tableBody.closest("table").parentElement;
    const graphContainer = document.getElementById("graphContainer");

    setupFormHandler(form, fetchAndDisplayVratky, tableBody);

    // Show active table by default
    tableContainer.style.display = "block";
    graphContainer.style.display = "none";
    fetchAndDisplayVratky(tableBody, "active");
    if (activeBtn) activeBtn.classList.add("active");

    if (activeBtn && historyBtn && graphsBtn) {
        const buttons = [activeBtn, historyBtn, graphsBtn];

        activeBtn.addEventListener("click", () => {
            tableContainer.style.display = "block";
            graphContainer.style.display = "none";

            fetchAndDisplayVratky(tableBody, "active");

            buttons.forEach(btn => btn.classList.remove("active"));
            activeBtn.classList.add("active");
        });

        historyBtn.addEventListener("click", () => {
            tableContainer.style.display = "block";
            graphContainer.style.display = "none";

            fetchAndDisplayVratky(tableBody, "history");

            buttons.forEach(btn => btn.classList.remove("active"));
            historyBtn.classList.add("active");
        });

        graphsBtn.addEventListener("click", async () => {
            tableContainer.style.display = "none";
            graphContainer.style.display = "block";

            const response = await fetch("getData.php?filter=all");
            const data = await response.json();

            setupRefundChart(data);

            buttons.forEach(btn => btn.classList.remove("active"));
            graphsBtn.classList.add("active");

            setTimeout(() => {
                window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth"
                });
            }, 150);
        });
    }
});
