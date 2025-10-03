<!-- views/layout/header.php-->
<header>
    <div class="logo"><img src="./assets/img/LOGO.svg" alt="logo"></div>
    
    <div class="search">
      <input type="text" placeholder="Search task... 🔍">
    </div>
    
    <div class="profile">
        <img src="<?= htmlspecialchars($filepath) ?>" alt="User Avatar">
        <span class="username"><?= htmlspecialchars($userData['username'])?></span>
    </div>
</header>
