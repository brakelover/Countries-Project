<script setup>
import { onMounted, ref, watch, computed } from "vue";
import GroupByAlphabet from "./components/GroupByAlphabet.vue";
import NavigateButton from "./components/NavigateButton.vue";

const searchInput = ref("");
const totalFound = ref(0);

const countries = ref([]);
const filteredCountries = ref([]);
const letterGroups = ref({});

const groupByLetter = () => {
  letterGroups.value = {};
  // Group by letter
  let tempGroup = {};
  filteredCountries.value.map((country) => {
    const firstChar = country.name.common.charAt(0).toUpperCase();
    if (!tempGroup[firstChar]) tempGroup[firstChar] = []; // create an array to push if haven't exist
    tempGroup[firstChar].push(country);
  });
  // Sort follow by alphabet
  const sortedGroups = {};
  Object.keys(tempGroup)
    .sort()
    .forEach((key) => {
      sortedGroups[key] = tempGroup[key];
    });

  letterGroups.value = sortedGroups;
};

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
    groupByLetter();
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

  groupByLetter();

  // Total found count
  totalFound.value = filteredCountries.value.length;
});

const groupKeys = computed(() => Object.keys(letterGroups.value));

const onInput = (e) => {
  searchInput.value = e.target.value; // Update right after typing
};

// Scroll to section
function scrollToSection(letter) {
  const el = document.getElementById(`group-title-${letter}`);
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
  <div id="headerWrapper">
    <h1>Countries Project</h1>
    <div id="headerFilterWrapper">
      <!-- Search by name, capital, country code, language, region, and flag description -->
      <input
        v-model="searchInput"
        @input="onInput"
        type="text"
        placeholder="Search by name, capital, language use, country code, .etc"
      />
      <div id="letterHeaderWrapper">
        <p>Go to:</p>
        <div id="letterHeader">
          <button
            v-for="letter in groupKeys"
            :key="letter"
            @click="scrollToSection(letter)"
          >
            {{ letter }}
          </button>
        </div>
      </div>
    </div>
    <div id="headerOptions">
      <NavigateButton to="/map" title="Global map" icon="🗺️" />
    </div>
  </div>

  <div id="countriesWrapper">
    <p v-if="filteredCountries.length === 0">No country found</p>
    <GroupByAlphabet
      v-for="(countries, letter) in letterGroups"
      :key="letter"
      :letter="letter"
      :countries="countries"
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
  width: 95%;
  background-color: #f9f9f9;
}

#headerFilterWrapper {
  display: flex;
  flex-direction: column;
}

#letterHeaderWrapper {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 90%;
}

#letterHeaderWrapper p {
  margin-right: 10px;
}

#headerOptions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* Countries grid */
#countriesWrapper {
  display: grid;
  flex-direction: column;
  gap: 40px;
  padding: 16px;
}

@media screen and (max-width: 600px) {
  #headerWrapper input {
    width: 100%;
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
