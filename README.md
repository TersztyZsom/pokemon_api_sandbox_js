
# Pokémon Fetcher

This Node.js application fetches details about Pokémon from the [PokéAPI](https://pokeapi.co/) based on specified types. It uses `axios` for making HTTP requests and `yargs` for command-line argument parsing.

## Features

- Fetch Pokémon details by type.
- Automatically retries requests on network failures.
- Handles both specific Pokémon types and a comprehensive fetch of all available Pokémon.

## Prerequisites

Before running this script, make sure you have Node.js and npm installed on your system. You can download and install them from [Node.js official website](https://nodejs.org/).

## Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd <repository-name>
npm install
```

## Usage

Run the script by specifying the Pokémon type as a command-line argument. For example:

```bash
node pokemon_api_sandbox.js --type water
```

To fetch details of all Pokémon, omit the `--type` argument or set it to `all`:

```bash
node pokemon_api_sandbox.js --type all
```

## Function Descriptions

- **fetchPokemonTypes()**: Fetches and returns all Pokémon types from the PokéAPI.
- **getPokemonByType(pokemonType)**: Fetches a list of Pokémon by type.
- **fetchPokemonDetails(pokemon, currentRetry = 0)**: Fetches detailed information for a single Pokémon with a retry mechanism for handling network errors.
- **main()**: Entry point of the application, parses command-line arguments and orchestrates the fetching process.

## Error Handling

- Retries up to 3 times if a network error occurs (`ECONNRESET`, `ETIMEDOUT`).
- Waits 1000 milliseconds before retrying to alleviate potential server-side rate limiting or temporary unavailability.

## Contributing

Contributions are welcome! Please feel free to submit pull requests, or open issues to discuss proposed changes or report bugs.

## License

Specify the license under which your project is available. Common licenses for open source projects include MIT, GPL, and Apache 2.0.
