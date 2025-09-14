import "./assets/main.css";

import { createApp } from "vue";
import { createWebHashHistory, createRouter } from "vue-router";
import "leaflet/dist/leaflet.css";
import App from "./App.vue";
import CountryList from "./CountryList.vue";
import CountryDetail from "./CountryDetail.vue";
import MapView from "./MapView.vue";

const routes = [
  { path: "/", component: CountryList },
  { path: "/home", component: CountryList },
  { path: "/country/:code", component: CountryDetail, props: true },
  { path: "/map", component: MapView },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

createApp(App).use(router).mount("#app");
