const 	pokdexURL = 'https://pokeapi.co/api/v2/pokemon/';
const 	nameListDiv = document.querySelector('.name-list');
let 	selected = null;
let 	illustartion = document.querySelector('.poke-illustaration');

const allowShiny = false;
const		regions = {
	'kanto': {
		'min': 1,
		'max': 151,
	},
	'johto': {
		'min': 152,
		'max': 251,
	},
	'hoenn': {
		'min': 252,
		'max': 386,
	},
	'sinnoh': {
		'min': 387,
		'max': 493,
	},
	'unova': {
		'min': 494,
		'max': 649,
	},
	'kalos': {
		'min': 650,
		'max': 720,
	},
	'all': {
		'min': 1,
		'max': 720,
	},
}

let selectedRegion = regions.kanto;



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

function updateBase(pokemon){
	const baseDiv = document.querySelector('.poke-base');
	removeChildren(baseDiv);
	
	const weight = document.createElement('h1');
	const height = document.createElement('h1');
	weight.classList.add('base-text', 'weight');
	height.classList.add('base-text', 'height');
	weight.textContent = `weight :  ${pokemon.weight} Kg`;
	height.textContent = `height :  ${pokemon.height} M`;

	baseDiv.appendChild(weight);
	baseDiv.appendChild(height);
	
	stats = pokemon.stats;
	stats.forEach(stat => {
		const elem = document.createElement('h1');
		elem.classList.add('base-text');
		elem.textContent = `${stat.stat.name} :  ${stat.base_stat}`;
		baseDiv.appendChild(elem);
	})
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

function updateSelection(pokemon){
	updateIllustration(pokemon);

	updateType(pokemon);

	updateBase(pokemon);
	updateName(pokemon);
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
	const res = await fetch(pokdexURL + id);
	let pokemon = await res.json();

	updateSelection(pokemon);
}

async function selectPokemonbyName(name)
{
	const res = await fetch(pokdexURL + name);
	let pokemon = await res.json();

	updateSelection(pokemon);
}

function	creatPokemonListEntry(pokemon){
	const listDiv = document.createElement('div');
	listDiv.classList.add('poke-list', 'unselected');

	listDiv.dataset['id'] = `${pokemon.id}`;		



	const listNameH1 = document.createElement('h1');
	listNameH1.classList.add('poke-list-name');


	const name = `${pokemon.name}`;
	listNameH1.textContent = name;


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


	listDiv.appendChild(listNameH1);
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
	for(let i = selectedRegion.min; i < selectedRegion.max + 1; i++)
		await getPokemon(i);

}

selectPokemonbyId(selectedRegion.min);
loadPokedex();
