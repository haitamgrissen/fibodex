const 	pokdexURL = 'https://pokeapi.co/api/v2/pokemon/';
const	flavourURL = 'https://pokeapi.co/api/v2/pokemon-species/';
const 	nameListDiv = document.querySelector('.name-list');
const 	illustartion = document.querySelector('.poke-illustaration');
const 	searchInput = document.querySelector("input");
let 	selected = null;
let 	allowShiny = false;
let 	isChangingRegion = false;
let 	allowRegionChange = false;

let selectedRegion = null;

const		regions = {
	'kanto': {
		'min': 1,
		'max': 151,
		'region': 'kanto',
	},
	'johto': {
		'min': 152,
		'max': 251,
		'region': 'johto',
	},
	'hoenn': {
		'min': 252,
		'max': 386,
		'region': 'hoenn',
	},
	'sinnoh': {
		'min': 387,
		'max': 493,
		'region': 'sinnoh',
	},
	'unova': {
		'min': 494,
		'max': 649,
		'region': 'unova',
	},
	'kalos': {
		'min': 650,
		'max': 720,
		'region': 'kalos',
	},
	'all': {
		'min': 1,
		'max': 720,
		'region': 'all',
	},
}

const typeColors = {
	'normal': '#A8A77A',
	'fire': '#EE8130',
	'water': '#6390F0',
	'electric': '#F7D02C',
	'grass': '#7AC74C',
	'ice': '#96D9D6',
	'fighting': '#C22E28',
	'poison': '#A33EA1',
	'ground': '#E2BF65',
	'flying': '#A98FF3',
	'psychic': '#F95587',
	'bug': '#A6B91A',
	'rock': '#B6A136',
	'ghost': '#735797',
	'dragon': '#6F35FC',
	'dark': '#705746',
	'steel': '#B7B7CE',
	'fairy': '#D685AD',
};

function removeChildren(parent){
	var child = parent.lastElementChild; 
	while (child) {
		parent.removeChild(child);
		child = parent.lastElementChild;
	}
}

async function updateBase(pokemon){
    res = await fetch(pokemon["species"]["url"]);
    let pokemonDesc = await res.json();
	let entries = pokemonDesc.flavor_text_entries;

	const baseDiv = document.querySelector('.poke-base');
	removeChildren(baseDiv);

	for (var entry of entries)
	{
		if (entry.language.name == 'en')
		{
			const elem = document.createElement('h1');
			elem.classList.add('base-text');
			elem.textContent = entry.flavor_text;
			baseDiv.appendChild(elem);
			break ;
		}
	}
}

function updateType(pokemon){
	const typeDiv = document.querySelector('.poke-type');
	removeChildren(typeDiv);
	pokemon.types.forEach((type) => {
		const typeBox = document.createElement('div');
		typeBox.classList.add('type-box');
		typeBox.textContent = type.type.name;
		typeBox.style.border = `2px solid ${typeColors[type]}`;
		typeBox.style.backgroundColor = typeColors[type.type.name];

		typeDiv.appendChild(typeBox);
	});
}
function updateName(pokemon){
	const nameH1 = document.querySelector('.info-name');
	const currentName = pokemon.name;
	nameH1.textContent = currentName;
}

function updateIllustration(pokemon){

	const imgLink = pokemon.sprites.other['official-artwork'].front_default;
	illustartion.src =  imgLink;
}

async function updateSelection(pokemon){
	updateIllustration(pokemon);
	updateType(pokemon);
	updateName(pokemon);
	updateBase(pokemon);
}

async function selectPokemonByListClick () {
	const res = await fetch(pokdexURL + this.getAttribute('data-id'));
	let pokemon = await res.json();

	if (selected)
	{
		selected.classList.add('unselected');
		selected.classList.remove('selected');
	}
	
	selected = document.querySelector(`[data-id="${pokemon.id}"]`);
	selected.classList.remove('unselected');
	selected.classList.add('selected');

	updateSelection(pokemon);

}

async function selectPokemonbyId(id)
{
	try{
		const res = await fetch(pokdexURL + id);
		let pokemon = await res.json();
		updateSelection(pokemon);
		searchInput.value = '';
	} catch{
		searchInput.classList.add('shake');
	}
}

async function selectPokemonbyName(name)
{
	try {
		const res = await fetch(pokdexURL + name);
		let pokemon = await res.json();
		updateSelection(pokemon);
		searchInput.value = '';
	} catch{
		searchInput.classList.add('shake');
	}
}

function	creatPokemonListEntry(pokemon){
	const listDiv = document.createElement('div');
	listDiv.classList.add('poke-list', 'unselected');

	listDiv.dataset['id'] = `${pokemon.id}`;		


	const rightDiv = document.createElement('div');
	rightDiv.classList.add('list-right');

	const listNameH1 = document.createElement('h1');
	listNameH1.classList.add('poke-list-name');
	const name = `${pokemon.name}`;
	listNameH1.textContent = name;

	const listBall = document.createElement('img');
	listBall.classList.add('pokeball-sprite');
	listBall.src = 'balltest.svg';

	rightDiv.append(listNameH1, listBall);

	const leftDiv = document.createElement('div');
	leftDiv.classList.add('list-left');
	const listNoH1 = document.createElement('h1');
	listNoH1.classList.add('poke-list-no');

	const no = `No. ${pokemon.id}`;
	listNoH1.textContent = no;


	const listImg = document.createElement('img');
	listImg.classList.add('poke-sprite');

	const random = Math.floor((Math.random() * 10)) % 2;
	const src = (random === 0 && allowShiny) ? pokemon.sprites.front_shiny : pokemon.sprites.front_default;
	listImg.src = src;

	leftDiv.appendChild(listImg);
	leftDiv.appendChild(listNoH1);


	listDiv.appendChild(rightDiv);
	listDiv.appendChild(leftDiv);
	nameListDiv.append(listDiv);
	listDiv.addEventListener('click', selectPokemonByListClick);
}

async function getPokemon(id){
	const res = await fetch(pokdexURL + id);
	let pokemon = await res.json();
	creatPokemonListEntry(pokemon);
}

async function loadPokedex(){
	allowRegionChange = false;
	for(let i = selectedRegion.min; i < selectedRegion.max + 1; i++){
		if (isChangingRegion)
			break;
		await getPokemon(i);
	}
	allowRegionChange = true;
}


function changeRegion(){
	
	const region = this.getAttribute('data-region');
	if (!region || region === selectedRegion.region)
		return ;
	isChangingRegion = true;
	if (!allowRegionChange)
		return;
	isChangingRegion = false;
	removeChildren(nameListDiv);
	selectedRegion = regions[region];
	selectPokemonbyId(selectedRegion.min);
	loadPokedex();

}


function initDropDowns(){

	const regionDropDown = document.querySelector('#dropdown-regions');
	
	const childern = regionDropDown.childNodes;
	
	
	childern.forEach(regionButton => {
		regionButton.addEventListener('click', changeRegion);
	});

	searchInput.addEventListener("keyup", (event) => {
		if (event.key === "Enter") {
			searchInput.classList.remove('shake');
			let searchQuery = searchInput.value;
			if (!searchInput.value)
				return ;
			else if (typeof searchQuery == 'string')
				selectPokemonbyName(searchQuery.toLowerCase());
			else if (typeof searchQuery == 'number')
			selectPokemonbyId(searchQuery);
	  }
	});
}





selectedRegion = regions.kanto;
selectPokemonbyId(selectedRegion.min);
loadPokedex();
initDropDowns();
