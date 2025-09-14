<script setup>
const { overview } = defineProps({
  overview: Object,
});
</script>

<template>
  <router-link :to="`/country/${overview.cCode}`" class="countryItemWrapper">
    <img :src="overview.flag" :alt="overview.name" />
    <h2>{{ overview.name }}</h2>
    <p>Code: {{ overview.cCode }}</p>
  </router-link>
</template>

<style scoped>
.countryItemWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin: 8px;
  width: 200px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}

.countryItemWrapper:hover {
  transform: scale(1.05);
}

.countryItemWrapper img {
  width: 150px;
  height: auto;
  border-radius: 4px;
  margin-bottom: 8px;
}

.countryItemWrapper h2 {
  color: white;
  font-size: 18px;
  margin: 8px 0;
}

.countryItemWrapper p {
  font-size: 14px;
  color: #555;
}

@media screen and (max-width: 600px) {
  .countryItemWrapper {
    width: 180px;
  }

  .countryItemWrapper img {
    width: 150px;
  }
}
</style>
