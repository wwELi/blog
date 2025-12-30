<template>
  <div class="custom-card">
    <button @click="fetchData">Huo qu</button>
  </div>
</template>

<script setup>
  function fetchData() {
    fetch('http://39.107.213.48:8080')
      .then(response => response.json())
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

</script>

<style scoped>

</style>