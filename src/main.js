import "./assets/main.css";

import { createApp } from "vue";
import { createWebHistory, createRouter } from "vue-router";
import App from "./App.vue";
import CountryList from "./CountryList.vue";
import CountryDetail from "./CountryDetail.vue";

const routes = [
  { path: "/", component: CountryList },
  { path: "/home", component: CountryList },
  { path: "/country/:code", component: CountryDetail, props: true },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
