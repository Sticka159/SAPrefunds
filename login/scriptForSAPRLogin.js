document.getElementById("logButton").addEventListener("click", function() {
    let chipCode = document.getElementById("chipInput").value;

    if (!chipCode) {
        alert("Please enter a valid chip code.");
        return;
    }

    document.getElementById("result").innerHTML = "";

    fetch('getCode.php?parameter=' + encodeURIComponent(chipCode))
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.status + ' ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            console.log(data);

            if (data.trim()) {
                let dataArray = data.split(',');

                let personalNum = dataArray[2].trim();

                window.location.href = `http://192.168.114.53/SAP_refunds/index.html?PersonalNum=${encodeURIComponent(personalNum)}`;
            } else {
                document.getElementById("result").innerHTML = "<p>No worker found with this chip code.</p>";
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            document.getElementById("result").innerHTML = `<p>Error: ${error.message}</p>`;
        });
});
