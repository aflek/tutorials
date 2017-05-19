<template>
  <div id="app">
    <img src="./assets/logo.png">
    <ul>
      <li><router-link to="/users">Users</router-link></li>
      <li><router-link to="/">Test</router-link></li>
      <router-view></router-view>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
