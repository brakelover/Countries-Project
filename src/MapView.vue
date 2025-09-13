<script setup>
import { onMounted, ref } from "vue";
import L from "leaflet";
import NavigateButton from "./components/NavigateButton.vue";

const mapContainer = ref(null);

onMounted(() => {
  const map = L.map(mapContainer.value).setView([0, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);
});
</script>

<template>
  <NavigateButton to="/home" title="Back" icon="←" />
  <div ref="mapContainer" id="fullMap"></div>
</template>

<style scoped>
#fullMap {
  margin-top: 10px;
  width: 100%;
  height: 85vh;
  max-height: 85vh;
}
</style>
