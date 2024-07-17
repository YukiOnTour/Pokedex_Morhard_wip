const pokemonRepository = (function() {
    let pokemonList = [];
    const apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
  
    function loadList() {
      return fetch(apiUrl)
        .then(response => response.json())
        .then(json => {
          json.results.forEach(item => {
            let pokemon = {
              name: item.name,
              detailsUrl: item.url
            };
            add(pokemon);
          });
        })
        .catch(error => console.error(error));
    }
  
    function loadDetails(pokemon) {
      return fetch(pokemon.detailsUrl)
        .then(response => response.json())
        .then(details => {
          pokemon.imageUrl = details.sprites.front_default;
          pokemon.height = details.height;
          pokemon.types = details.types.map(typeInfo => typeInfo.type.name);
        })
        .catch(error => console.error(error));
    }
  
    function add(pokemon) {
      if (
        typeof pokemon === 'object' &&
        'name' in pokemon &&
        'detailsUrl' in pokemon
      ) {
        pokemonList.push(pokemon);
      } else {
        console.error('Invalid Pokémon object');
      }
    }
  
    function getAll() {
      return pokemonList;
    }
  
    function addListItem(pokemon) {
      const pokemonListElement = document.querySelector('.pokemon-list');
      let listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      
      let button = document.createElement('button');
      button.innerText = pokemon.name;
      button.classList.add('btn', 'btn-primary');
      button.setAttribute('data-toggle', 'modal');
      button.setAttribute('data-target', '#pokemon-modal');
      
      button.addEventListener('click', () => {
        loadDetails(pokemon).then(() => {
          showDetails(pokemon);
        });
      });
      
      listItem.appendChild(button);
      pokemonListElement.appendChild(listItem);
    }
  
    function showDetails(pokemon) {
      const modal = document.querySelector('#pokemon-modal');
      const modalTitle = modal.querySelector('.modal-title');
      const modalName = modal.querySelector('.pokemon-name');
      const modalImage = modal.querySelector('.pokemon-image');
      const modalHeight = modal.querySelector('.pokemon-height');
      const modalType = modal.querySelector('.pokemon-type');
  
      modalTitle.innerText = pokemon.name;
      modalName.innerText = pokemon.name;
      modalImage.src = pokemon.imageUrl;
      modalHeight.innerText = `Height: ${pokemon.height}`;
      modalType.innerText = `Type: ${pokemon.types.join(', ')}`;
    }
  
    return {
      getAll: getAll,
      add: add,
      loadList: loadList,
      loadDetails: loadDetails,
      addListItem: addListItem
    };
  })();
  
  pokemonRepository.loadList().then(() => {
    pokemonRepository.getAll().forEach(pokemon => {
      pokemonRepository.addListItem(pokemon);
    });
  });
  