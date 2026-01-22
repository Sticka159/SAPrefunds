import { handleVratkaModal } from "./modalHandler.js";
import { setupTableFilters } from "./filterHandler.js";
import { setupRefundChart } from "./refundChart.js";

let currentFilter = "all";
let intervalId = null;

export function fetchAndDisplayVratky(tableBody, filter = "all") {
    console.log(filter);
    if (filter !== currentFilter) {
        currentFilter = filter;
    }

    const refreshInterval = 3000;

    function checkAndUpdateVratky() {
        fetch("getData.php")
            .then(response => {
                if (!response.ok) {
                    throw new Error("Chyba při načítání dat.");
                }
                return response.json();
            })
            .then(data => {
                tableBody.innerHTML = "";

                const urlParams = new URLSearchParams(window.location.search);
                const currentUser = urlParams.get("PersonalNum");

                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const filteredData = data.filter(vratka => {
                    if (!vratka.timestamp) return currentFilter === "active" || currentFilter === "all";

                    const vratkaDate = new Date(vratka.timestamp);
                    vratkaDate.setHours(0, 0, 0, 0);

                    const state = vratka.state?.toLowerCase();

                    if (currentFilter === "active") {
                        return (
                            vratkaDate >= today ||
                            state === "created" ||
                            state === "in progress"
                        );
                    }

                    if (currentFilter === "history") {
                        return vratkaDate < today && state === "done";
                    }

                    return true;
                });

                const reasonMap = {
                    "reconstruction of production": "Přestavba výroby",
                    "Warehouse error": "Chyba skladu"
                };

                const stateMap = {
                    "created": "vytvořeno",
                    "in progress": "v procesu",
                    "done": "hotovo"
                };

                filteredData.forEach(vratka => {
                    const row = document.createElement("tr");

                    const translatedReason = reasonMap[vratka.reason] || vratka.reason;
                    const translatedState = stateMap[vratka.state?.toLowerCase()] || vratka.state;

                    row.innerHTML = `
                        <td>${vratka.PersonalNum}</td>
                        <td>${vratka.MaterialNum}</td>
                        <td>${vratka.amount}</td>
                        <td>${vratka.type}</td>
                        <td>${vratka.target}</td>
                        <td>${translatedReason}</td>
                        <td>${vratka.timestamp || "-"}</td>
                        <td>${vratka.createdAt || "-"}</td>
                        <td>${translatedState || "-"}</td>
                    `;

                    if (currentFilter !== "history") {
                        const originalState = vratka.state?.toLowerCase();
                        if (originalState === "created") row.classList.add("state-created");
                        if (originalState === "done") row.classList.add("state-done");
                        if (originalState === "in progress") row.classList.add("state-in-progress");
                    }

                    if (["5138", "4025", "3521", "5148", "5153", "413"].includes(currentUser)) {
                        row.style.cursor = "pointer";
                        row.addEventListener("click", () => {
                            if (vratka.state?.toLowerCase() !== "done") {
                                vratka.state = "in progress";
                                updateVratkaStateOnServer(vratka);
                            }

                            handleVratkaModal(
                                vratka,
                                tableBody,
                                () => fetchAndDisplayVratky(tableBody, currentFilter)
                            );
                        });
                    }

                    tableBody.appendChild(row);
                });

                const table = tableBody.closest("table");
                if (table) setupTableFilters(table, tableBody);

                // ✅ Update chart ONLY if we’re not in Graphs mode
                if (document.getElementById("Graphs")?.classList.contains("active") === false) {
                    setupRefundChart(filteredData);
                }
            })
            .catch(error => {
                console.error("❌ Chyba při načítání vratek:", error);
            });
    }

    function updateVratkaStateOnServer(vratka) {
        fetch('updateData.php', {
            method: 'POST',
            body: JSON.stringify(vratka),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then(data => {
                console.log("✅ Stav 'in progress' byl uložen.");
            })
            .catch(error => {
                console.error("❌ Chyba při ukládání stavu:", error);
            });
    }

    checkAndUpdateVratky();

    if (intervalId !== null) clearInterval(intervalId);

    if (currentFilter === "active" || currentFilter === "inProgress") {
        intervalId = setInterval(() => {
            checkAndUpdateVratky();
        }, refreshInterval);
    }

    window.addEventListener("beforeunload", () => {
        clearInterval(intervalId);
    });
}
