<script setup>
// Default Layout - 適用於一般頁面
</script>

<template>
  <div class="default-layout">
    <header class="header">
      <nav>
        <router-link to="/">首頁</router-link>
        <router-link to="/about">關於我們</router-link>
      </nav>
    </header>

    <main class="main-content">
      <router-view></router-view>
    </main>

    <footer class="footer">
      <p>&copy; 2026 Pawsport</p>
    </footer>
  </div>
</template>

<style scoped>
.default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  width: 100%;
}

.header {
  background-color: #42b983;
  padding: 1rem 2rem;
  color: white;
}

.header nav {
  display: flex;
  gap: 1rem;
}

.header nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
}

.header nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.footer {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  text-align: center;
}
</style>
