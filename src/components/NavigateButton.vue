<script setup>
defineProps({
  to: { type: String, required: false, default: "/home" },
  title: String,
  icon: String,
});
</script>

<template>
  <router-link :to="to">
    <button class="navigate-button">
      <span class="btn-text">{{ title }}</span>
      <span class="btn-icon">{{ icon }}</span>
    </button>
  </router-link>
</template>

<style scoped>
.navigate-button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background-color: #555555;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
}

.navigate-button:hover {
  background-color: #777777;
}

.btn-icon {
  display: none;
}

@media screen and (max-width: 600px) {
  .btn-text {
    display: none;
  }

  .btn-icon {
    display: inline;
  }
}
</style>
