export function setupTableFilters(table, tableBody) {
    const thead = table.querySelector("thead");

    const oldFilterRow = thead.querySelector("tr[data-filter-row]");
    if (oldFilterRow) {
        oldFilterRow.remove();
    }

    const headers = table.querySelectorAll("thead th");
    const filterRow = document.createElement("tr");
    filterRow.setAttribute("data-filter-row", "true");

    const activeFilters = {};

    headers.forEach((header, colIndex) => {
        const filterCell = document.createElement("th");
        const select = document.createElement("select");
        select.style.display = "none";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Vyber";
        select.appendChild(defaultOption);

        filterCell.appendChild(select);
        filterRow.appendChild(filterCell);

        header.addEventListener("click", () => {
            select.style.display = select.style.display === "none" ? "inline-block" : "none";

            if (select.options.length === 1) {
                const uniqueValues = new Set();
                tableBody.querySelectorAll("tr").forEach(row => {
                    const cellValue = row.children[colIndex]?.textContent.trim();
                    if (cellValue) uniqueValues.add(cellValue);
                });

                [...uniqueValues].sort().forEach(value => {
                    const option = document.createElement("option");
                    option.value = value;
                    option.textContent = value;
                    select.appendChild(option);
                });
            }
        });

        select.addEventListener("change", () => {
            const selectedValue = select.value;
            if (selectedValue) {
                activeFilters[colIndex] = selectedValue;
            } else {
                delete activeFilters[colIndex];
            }

            tableBody.querySelectorAll("tr").forEach(row => {
                let visible = true;

                for (const [index, filterValue] of Object.entries(activeFilters)) {
                    const cell = row.children[parseInt(index)];
                    const cellValue = cell?.textContent.trim() || "";
                    if (cellValue !== filterValue) {
                        visible = false;
                        break;
                    }
                }

                row.style.display = visible ? "" : "none";
            });
        });
    });

    thead.appendChild(filterRow);
}
