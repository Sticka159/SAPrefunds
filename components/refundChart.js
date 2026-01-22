let refundChart = null;

export function setupRefundChart(data) {
    if (!data) return;

    const counts = {};
    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() - 10);

    // keep only refunds from last 10 days
    const filtered = data.filter(vratka => {
        if (!vratka.timestamp) return false;
        const d = new Date(vratka.timestamp.replace(" ", "T"));
        return d >= cutoff;
    });

    filtered.forEach(vratka => {
        const dept = vratka.target || "Unknown";
        counts[dept] = (counts[dept] || 0) + 1;
    });

    const labels = Object.keys(counts).sort();
    const values = labels.map(label => counts[label]);

    const ctx = document.getElementById('refundChart').getContext('2d');

    if (refundChart) {
        refundChart.data.labels = labels;
        refundChart.data.datasets[0].data = values;
        refundChart.update();
    } else {
        refundChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Počet vratek (posledních 10 dní)',
                    data: values,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false, // ✅ allow container sizing
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: true }
                },
                scales: {
                    x: { title: { display: true, text: 'Středisko' } },
                    y: { title: { display: true, text: 'Počet vratek' }, beginAtZero: true }
                }
            }
        });
    }
}
