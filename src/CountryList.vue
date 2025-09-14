<script setup>
import { onMounted, ref, watch } from "vue";
import CountryItem from "./components/CountryItem.vue";
import NavigateButton from "./components/NavigateButton.vue";

const countries = ref([]);
const filteredCountries = ref([]);
const searchInput = ref("");
const totalFound = ref(0);

const alphabetArr = Array.from({ length: 26 }, (_, i) =>
  String.fromCharCode(65 + i)
);

// Get data
onMounted(async () => {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/all?fields=name,flags,capital,region,languages,cca3`
    );
    let data = await res.json();
    // Sort countries name A-Z
    data.sort((a, b) => a.name.common.localeCompare(b.name.common));
    countries.value = data;
    filteredCountries.value = data;
  } catch (e) {
    console.log(e);
  }
});

// Search filter (tried with onBeforeUpdate => sometimes not run; computed => too laggy)
watch(searchInput, (newVariable) => {
  if (newVariable === "") {
    filteredCountries.value = countries.value;
    return;
  }

  // Modified input
  const theInput = newVariable
    .toLowerCase()
    .replace(/\s+/g, " ") // Remove extra spaces
    .replace(/[<>{}#$%@]/g, "") // Remove special characters
    .trim();
  // console.log("searchInput:", newVariable, "theInput:", theInput);

  // Keep for search
  filteredCountries.value = countries.value.filter((country) => {
    // By name
    const { common, official } = country.name;
    const nativeName = country.name.nativeName;
    const matchName =
      common.toLowerCase().includes(theInput) ||
      official.toLowerCase().includes(theInput);
    // By native name
    const matchNativeName = nativeName
      ? Object.values(nativeName).some(
          (n) =>
            n.common.toLowerCase().includes(theInput) ||
            n.official.toLowerCase().includes(theInput)
        )
      : false;

    // By capital
    const matchCapital = country.capital
      ? country.capital.some((cap) => cap.toLowerCase().includes(theInput))
      : false;

    // By country code
    const matchcca3 = country.cca3.toLowerCase().includes(theInput);

    // By language
    const matchLanguage = country.languages
      ? Object.values(country.languages).some((lang) =>
          lang.toLowerCase().includes(theInput)
        )
      : false;

    // By region
    const matchRegion = country.region.toLowerCase().includes(theInput);

    // By flag description
    const matchFlagDesc = country.flags.alt
      ? country.flags.alt.toLowerCase().includes(theInput)
      : false;

    return (
      matchName ||
      matchNativeName ||
      matchCapital ||
      matchcca3 ||
      matchLanguage ||
      matchRegion ||
      matchFlagDesc
    );
  });

  // Total found count
  totalFound.value = filteredCountries.value.length;
});

const onInput = (e) => {
  searchInput.value = e.target.value; // Update right after typing
};
</script>

<template>
  <div id="headerWrapper">
    <h1>Country Project</h1>
    <!-- Search by name, capital, country code, language, region, and flag description -->
    <input
      v-model="searchInput"
      @input="onInput"
      type="text"
      placeholder="Search by name, capital, language use, country code, .etc"
    />
    <div id="headerOptions">
      <NavigateButton to="/map" title="Global map" icon="🗺️" />
    </div>
  </div>

  <div id="countriesWrapper">
    <p v-if="filteredCountries.length === 0">No country found</p>
    <CountryItem
      v-for="country in filteredCountries"
      :overview="{
        name: country?.name?.common,
        flag: country?.flags?.png,
        cCode: country?.cca3,
      }"
      :key="country.cca3"
    />
  </div>
</template>

<style scoped>
/* Header */
#headerWrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #333333;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

#headerWrapper input {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  width: 35%;
  background-color: #f9f9f9;
}

#headerOptions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* Countries grid */
#countriesWrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 16px;
}

@media screen and (max-width: 600px) {
  #headerWrapper input {
    width: 70%;
    margin-top: 8px;
  }

  #headerWrapper h1 {
    display: none;
  }

  #headerOptions {
    width: 20%;
    margin-top: 8px;
  }

  #countriesWrapper {
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  }
}
</style>
