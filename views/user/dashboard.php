<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?=htmlspecialchars($userData['username'])?> - AxumArcade</title>
  <link rel="icon" type="image/png" href="./assets/img/LOGO.svg">
  <link rel="stylesheet" href="./assets/css/theme.css">
  <link rel="stylesheet" href="./assets/css/style.css">
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <!-- TOP NAV / HEADER -->
  <?php include '../views/layout/header.php'; ?>

  <main>
    <!-- SIDEBAR -->
    <?php include '../views/layout/side-bar.php'; ?>

    <!-- MAIN CONTENT -->
    <div class="content">
      <div class="dashboard-header">
        <div class="header-info">
          <h1>Dashboard</h1>
          <p>Get insight about your data</p>
        </div>

        <div class="header-actions">
          <a href="#" class="add-project">
            <span>+</span>
            <span>Add Project</span>
          </a>
          <a href="#" class="export-link">Export Data</a>
        </div>
      </div>

      <!-- Demo user data -->
      <div class="welcome-summary">
        <p><strong>Hello: </strong> <?=htmlspecialchars($userData['username'])?></p>
      </div>
      <div class="downloaded-played">
        <h2>Recently Downloaded Games</h2>
        <div class="games-row">
            <img src="./uploads/avatars/admin.jpg" alt="">
            <img src="./uploads/avatars/admin.jpg" alt="">
            <img src="./uploads/avatars/admin.jpg" alt="">
            <img src="./uploads/avatars/admin.jpg" alt="">
            <img src="./uploads/avatars/admin.jpg" alt="">
            <img src="./uploads/avatars/admin.jpg" alt="">
            <img src="./uploads/avatars/admin.jpg" alt="">
        </div>
      </div>
      <div class="game-stats">
        <div id="chartContainer" class="chart-container">
            <canvas id="hoursChart"></canvas>
        </div>

        <div class="top-games">
            <h2>Your top 3 games this week</h2>
            <div class="game-list">
                <div class="game-stat">
                    <img src="./uploads/avatars/admin.jpg" alt="">
                    <p>Avatar The Last Airbender</p>
                </div>
                <div class="game-stat">
                    <img src="./uploads/avatars/admin.jpg" alt="">
                    <p>Avatar The Last Airbender</p>
                </div>
                <div class="game-stat">
                    <img src="./uploads/avatars/admin.jpg" alt="">
                    <p>Avatar The Last Airbender</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  </main>
  <script>
    const ctx = document.getElementById('hoursChart').getContext('2d');

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Hours Played',
          data: [2, 3, 1, 4, 5, 6, 2], // <-- your numbers here
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: true,
          tension: 0.3,  // makes the line smooth
          pointRadius: 5,
          pointBackgroundColor: 'rgba(75, 192, 192, 1)'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Hours'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Day of Week'
            }
          }
        }
      }
    });
  </script>
</body>
</html>
