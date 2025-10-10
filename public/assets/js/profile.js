document.addEventListener('DOMContentLoaded', function() {
    // ========================================
    // 1. CHART.JS INITIALIZATION
    // ========================================
    const ctx = document.getElementById('hoursChart')?.getContext('2d');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Hours Played',
                    data: [2, 3, 1, 4, 5, 6, 2],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: true,
                    tension: 0.3,
                    pointRadius: 5,
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: 'Hours' } },
                    x: { title: { display: true, text: 'Day of Week' } }
                }
            }
        });
    }

    // ========================================
    // 2. HEADER AVATAR UPLOAD PREVIEW
    // ========================================
    const avatarInputHeader = document.getElementById('avatar-upload');
    const imagePreviewHeader = document.getElementById('image-preview');

    if (avatarInputHeader && imagePreviewHeader) {
        avatarInputHeader.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreviewHeader.src = e.target.result;
                    document.getElementById('avatar-form-header').submit();
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
