<script setup>
import CountryItem from "./CountryItem.vue";

defineProps({
  letter: String,
  countries: Array,
});
</script>

<template>
  <div class="group">
    <h2 class="group-title" :id="`group-title-${letter}`">{{ letter }}</h2>
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
  border-bottom: 2px solid #695959;
}

.group-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, max-content));
  gap: 16px;
}

@media screen and (max-width: 600px) {
  .group-list {
    grid-template-columns: repeat(auto-fill, minmax(180px, max-content));
  }
}
</style>
