const axios = require('axios');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

// Setting up base URLs
const base_url = "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0";
const type_url = "https://pokeapi.co/api/v2/type/";

// Retry parameters
const maxRetries = 3;  // Maximum number of retries for a request
const retryDelay = 1000;  // Delay between retries in milliseconds

// Function to fetch Pokémon types
async function fetchPokemonTypes() {
  try {
    const response = await axios.get(type_url);
    return response.data.results.map(type => type.name);
  } catch (error) {
    console.error(`Error fetching Pokémon types: ${error.message}`);
    return [];
  }
}

// Function to fetch Pokémon by type
async function getPokemonByType(pokemonType) {
  try {
    const url = pokemonType === "all" ? base_url : `${type_url}${pokemonType}`;
    const response = await axios.get(url);
    const pokemonList = pokemonType === "all" ? response.data.results : response.data.pokemon;
    const simplifiedPokemonList = pokemonList.map(pokemon => ({
      name: pokemonType === "all" ? pokemon.name : pokemon.pokemon.name,
      url: pokemonType === "all" ? pokemon.url : pokemon.pokemon.url
    }));
    console.log(`Fetched ${simplifiedPokemonList.length} ${pokemonType} type Pokémon.`);
    return simplifiedPokemonList;
  } catch (error) {
    console.error(`Failed to fetch Pokémon of type ${pokemonType}: ${error.message}`);
    return [];
  }
}

// Function to fetch details of a single Pokémon with retries
async function fetchPokemonDetails(pokemon, currentRetry = 0) {
  try {
    const response = await axios.get(pokemon.url);
    const { id, name, weight, height, base_experience } = response.data;
    return `ID: ${id}, Name: ${name}, Height: ${height}, Weight: ${weight}, Base Experience: ${base_experience}`;
  } catch (error) {
    if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      if (currentRetry < maxRetries) {
        console.log(`Retry ${currentRetry + 1}/${maxRetries} for ${pokemon.name}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));  // Wait before retrying
        return fetchPokemonDetails(pokemon, currentRetry + 1);  // Recursive retry
      }
    }
    return `Failed to fetch details for ${pokemon.name}: ${error.message}`;
  }
}

// Main function to run the script
async function main() {
  const argv = yargs(hideBin(process.argv)).option('type', {
    describe: 'Specify the Pokémon type to fetch.',
    type: 'string',
    default: 'all'
  }).argv;

  const pokemonTypes = await fetchPokemonTypes();
  const validType = pokemonTypes.includes(argv.type) ? argv.type : 'all';
  const pokemonList = await getPokemonByType(validType);

  const detailsPromises = pokemonList.map(pokemon => fetchPokemonDetails(pokemon));
  const results = await Promise.all(detailsPromises);
  results.forEach(result => console.log(result));
}

main();
