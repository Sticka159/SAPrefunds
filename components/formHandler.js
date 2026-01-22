import Swal from "https://cdn.jsdelivr.net/npm/sweetalert2@11/+esm";

export function setupFormHandler(form, fetchAndDisplayVratky, tableBody) {
    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(form);
        const urlParams = new URLSearchParams(window.location.search);
        const personalNum = urlParams.get("PersonalNum");

        if (personalNum) {
            formData.set("PersonalNum", personalNum);
        } else {
            alert("Cannot retrieve personal number from URL.");
            return;
        }

        formData.set("state", "created");

        fetch("postData.php", {
            method: "POST",
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Error saving the refund.");
                }
                return response.json();
            })
            .then(result => {
                console.log("✅ Save result:", result);

                if (result.success) {
                    Swal.fire({
                        title: '✅ Uloženo!',
                        text: 'Vratka byla uložena.',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 3000,
                        customClass: {
                            confirmButton: 'btn-blue'
                        }
                    }).then(() => {
                        fetchAndDisplayVratky(tableBody);
                        form.reset();
                    });
                } else {
                    Swal.fire({
                        title: '❌ Chyba',
                        text: result.message || "Nepodařilo se uložit.",
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 3000,
                    });
                }
            })
            .catch(error => {
                console.error("❌ Error submitting the form:", error);
                Swal.fire({
                    title: '❌ Chyba',
                    text: "Nepodařilo se uložit vratku.",
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000,
                });
            });
    });
}
