<template>
  <div class="custom-card">
    <button @click="fetchData">Huo qu</button>
    {{ jsontext }}
  </div>
</template>

<script setup>
  function fetchData() {
    let jsontext = ''
    fetch('/api')
      .then(response => response.json())
      .then(data => {
        jsontext = JSON.stringify(data, null, 2);
        console.log(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

</script>

<style scoped>

</style>