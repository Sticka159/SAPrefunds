import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

export function handleVratkaModal(vratka, tableBody, fetchAndDisplayVratky) {
    Swal.fire({
        title: '<span class="swal-title">Detail vratky</span>',
        html: `
            <p><strong>Čip (OČ):</strong> ${vratka.PersonalNum}</p>
            <div class="swal-input-group">
                <label for="editMaterialNum">Materiál:</label>
                <input id="editMaterialNum" type="text" value="${vratka.MaterialNum}" />
            </div>
            <div class="swal-input-group">  
                <label for="editAmount">Množství:</label>
                <input id="editAmount" type="number" value="${vratka.amount}" min="1" />
            </div>
            <div class="swal-input-group">
                <label for="editType">Typ balení:</label>
                <input id="editType" type="text" value="${vratka.type}" />
            </div>
            <div class="swal-input-group">
                <label for="editTarget">Odkud:</label>
                <input id="editTarget" type="text" value="${vratka.target}" />
            </div>
            <div class="swal-input-group">
                <label for="editReason">Důvod:</label>
                <input id="editReason" type="text" value="${vratka.reason}" />
            </div>
            <p><strong>Stav:</strong> ${vratka.state || "-"}</p>
            <p><strong>Čas:</strong> ${vratka.timestamp || "-"}</p>
        `,
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Uložit změny",
        denyButtonText: vratka.state?.toLowerCase() === "in progress" ? "Hotovo" : "Označit jako 'In Progress'",
        cancelButtonText: "Zavřít",
        customClass: {
            confirmButton: 'btn-blue',
            denyButton: 'btn-green',
            cancelButton: 'btn-red'
        },
        buttonsStyling: false
    }).then(result => {
        if (result.isConfirmed) {
            const updatedData = {
                id: vratka.id,
                PersonalNum: vratka.PersonalNum,
                MaterialNum: document.getElementById("editMaterialNum").value,
                amount: document.getElementById("editAmount").value,
                type: document.getElementById("editType").value,
                target: document.getElementById("editTarget").value,
                reason: document.getElementById("editReason").value,
                state: vratka.state
            };

            fetch("updateData.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        Swal.fire("✅ Uloženo!", "", "success");
                        fetchAndDisplayVratky(tableBody);
                    } else {
                        Swal.fire("❌ Chyba", res.message || "Nepodařilo se uložit.", "error");
                    }
                })
                .catch(err => {
                    Swal.fire("❌ Chyba", err.message || "Chyba komunikace se serverem.", "error");
                });
        } else if (result.isDenied) {
            const updatedData = {
                id: vratka.id,
                state: vratka.state?.toLowerCase() === "in progress" ? "done" : "in progress"
            };

            fetch("updateData.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedData)
            })
                .then(res => res.json())
                .then(res => {
                    if (res.success) {
                        const newState = updatedData.state === "done" ? "Označeno jako 'Hotovo'" : "Označeno jako 'In Progress'";
                        Swal.fire("🔄 " + newState, "", "success");
                        fetchAndDisplayVratky(tableBody);
                    } else {
                        Swal.fire("❌ Chyba", res.message || "Nepodařilo se uložit.", "error");
                    }
                })
                .catch(err => {
                    Swal.fire("❌ Chyba", err.message || "Chyba komunikace se serverem.", "error");
                });
        }
    });
}
