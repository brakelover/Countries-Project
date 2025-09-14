<script setup>
import { onMounted, ref, watch } from "vue";
import L from "leaflet";
import NavigateButton from "./components/NavigateButton.vue";

const cInfo = ref(null);
const sections = [
  "cRegion",
  "cCoatOfArms",
  "cCountryCode",
  "cLanguage",
  "cCapital",
  "cArea",
  "cPopulation",
  "cTimezone",
  "cStartOfWeek",
];

const props = defineProps({
  code: String,
});

let map;

onMounted(async () => {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/alpha/${props.code}`
    );
    const data = await res.json();
    cInfo.value = data[0];
    console.log("cInfo:", cInfo.value);
  } catch (e) {
    console.log(e);
  }
});

watch(cInfo, (newVal) => {
  if (newVal) initMap();
});

// Get lat/lng from capital name
async function getLatLngFromName(cityName, countryName) {
  const query = encodeURIComponent(`${cityName}, ${countryName}`);
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${query}`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "VueApp - Leaflet Demo",
      },
    });
    const data = await res.json();
    if (data.length > 0) {
      // return [lat, lng]
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } else {
      return null;
    }
  } catch (e) {
    console.error("Geocoding error:", e);
    return null;
  }
}

// View map by OpenStreetMap link
async function initMap() {
  const latlng = cInfo.value?.latlng || [0, 0];

  if (map) {
    map.remove();
  }

  map = L.map("miniMap").setView(latlng, 6);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  // Capital marker
  if (cInfo.value.capital?.[0]) {
    const capitalMarker = await getLatLngFromName(
      cInfo.value.capital[0],
      cInfo.value.name.common
    );
    if (capitalMarker) {
      L.marker(capitalMarker)
        .addTo(map)
        .bindPopup(`Capital: ${cInfo.value.capital[0]}`)
        .openPopup();

      map.setView(capitalMarker, 6);
    }
  }
}

function formatNum(num) {
  if (!num && num !== 0) return "-";
  return new Intl.NumberFormat("en-US").format(num);
}

// Scroll to section
function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY; // absolute position
  const offset = window.innerHeight * 0.33; // scroll to about 2/3 screen
  window.scrollTo({
    top: top - offset,
    behavior: "smooth",
  });
}
</script>

<template>
  <div id="countryDetailWrapper">
    <div id="cIntroWrapper">
      <div id="cName">
        <h1>{{ cInfo?.name?.common }}</h1>
        <h2>{{ cInfo?.name?.official }}</h2>
        <p id="cAltSpellings">
          Alt spellings:
          <span>{{ cInfo?.altSpellings?.join(", ") }}</span>
        </p>
      </div>
      <NavigateButton to="/home" title="Back" icon="←" />
    </div>

    <div id="imgAndMiniMap">
      <img :src="cInfo?.flags?.svg" :alt="cInfo?.name?.common" />
      <div id="miniMap" style="height: 300px; width: 50%" />
    </div>
  </div>

  <div id="cDetailInfo">
    <div id="cSidebar">
      <button v-for="sec in sections" :key="sec" @click="scrollToSection(sec)">
        {{ sec.replace(/^c/, "").replace(/([A-Z])/g, " $1") }}
      </button>
    </div>
    <div id="cInfos">
      <div id="cRegion">
        <h2>Region</h2>
        <h4>
          Region:
          {{ [cInfo?.region, cInfo?.subregion].filter(Boolean).join(", ") }}
        </h4>
      </div>
      <div id="cCoatOfArms">
        <h2>Coat Of Arms</h2>
        <div>
          <h4>Coat Of Arms:</h4>
          <img :src="cInfo?.coatOfArms?.png" alt="Coat of arms" />
        </div>
      </div>
      <div id="cCountryCode">
        <h2>Country Code</h2>
        <h4>cca2: {{ cInfo?.cca2 || "" }}</h4>
        <h4>cca3: {{ cInfo?.cca3 || "" }}</h4>
        <h4>ccn3: {{ cInfo?.ccn3 || "" }}</h4>
        <h4>cioc: {{ cInfo?.cioc || "" }}</h4>
      </div>
      <div id="cLanguage">
        <h2>Language</h2>
        <h4>
          Languages:
          {{
            cInfo?.languages ? Object.values(cInfo.languages).join(", ") : "-"
          }}
        </h4>
      </div>
      <div id="cCapital">
        <h2>Capital</h2>
        <h4>Capital: {{ cInfo?.capital.join(", ") }}</h4>
      </div>
      <div id="cArea">
        <h2>Area</h2>
        <h4>Area: {{ formatNum(cInfo?.area) }}km²</h4>
      </div>
      <div id="cPopulation">
        <h2>Population</h2>
        <h4>Population: {{ formatNum(cInfo?.population) }}</h4>
      </div>
      <div id="cTimezone">
        <h2>Timezone</h2>
        <h4>Timezones: {{ cInfo?.timezones.join(", ") }}</h4>
      </div>
      <div id="cStartOfWeek">
        <h2>Start Of Week</h2>
        <h4>Start Of Week: {{ cInfo?.startOfWeek }}</h4>
      </div>
    </div>
  </div>
</template>

<style scoped>
#countryDetailWrapper {
  color: white;
}

#cIntroWrapper {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

#cAltSpellings {
  margin-top: 20px;
}

#imgAndMiniMap {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

#imgAndMiniMap img {
  width: 50%;
}

/* Detail */
#cDetailInfo {
  display: flex;
  color: white;
  margin-top: 20px;
  border-top: 1px solid #696969;
  padding: 20px;
  gap: 20px;
}
#cDetailInfo div {
  margin-top: 40px;
}

#cCoatOfArms div {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}

#cCoatOfArms img {
  width: 100px;
  margin-left: 30px;
}

/* Sidebar 30% */
#cSidebar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #1e1e1e;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #333;
  flex: 0 0 30%;
  height: fit-content;
  position: sticky;
  top: 20px;
}

#cSidebar button {
  background-color: #2c2c2c;
  color: #fff;
  border: none;
  padding: 10px 12px;
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
}

#cSidebar button:hover {
  background-color: #3a3a3a;
}

/* Main info 70% */
#cInfos {
  flex: 0 0 70%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 16px;
  background-color: #1b1b1b;
  border-radius: 8px;
  border: 1px solid #333;
}

/* Các section riêng lẻ */
#cInfos h2 {
  margin-bottom: 8px;
  font-size: 1.2rem;
  color: #ffcc00; /* highlight tiêu đề section */
}

#cInfos h4 {
  margin: 2px 0;
  font-weight: normal;
  color: #ddd;
}

#cCoatOfArms div {
  display: flex;
  align-items: center;
  gap: 20px;
}

#cCoatOfArms img {
  width: 100px;
  border: 1px solid #444;
  border-radius: 4px;
}

@media (max-width: 600px) {
  #cDetailInfo {
    flex-direction: column;
  }
  /* #cSidebar,
  #cInfos {
    flex: 1 1 100%;
  } */
  #cSidebar {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 6px;
  }
  #cSidebar button {
    width: fit-content;
  }
}
</style>
