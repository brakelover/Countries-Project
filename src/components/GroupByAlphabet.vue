<script setup>
import CountryItem from "./CountryItem.vue";

defineProps({
  letter: String,
  countries: Array,
});
</script>

<template>
  <div class="group">
    <h2 class="group-title">{{ letter }}</h2>
    <div class="group-list">
      <CountryItem
        v-for="country in countries"
        :overview="{
          name: country.name.common,
          flag: country.flags.png,
          cCode: country.cca3,
        }"
        :key="country.cca3"
      />
    </div>
  </div>
</template>

<style scoped>
.group {
  margin-bottom: 24px;
}

.group-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 8px;
}

.group-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
</style>
