const 	pokdexURL = 'https://pokeapi.co/api/v2/pokemon/';
const	flavourURL = 'https://pokeapi.co/api/v2/pokemon-species/';
const 	nameListDiv = document.querySelector('.name-list');
const 	illustartion = document.querySelector('.poke-illustaration');
const	titleLogo = document.querySelector('#title-svg');
const 	descDiv = document.querySelector('.poke-base');
const 	searchInput = document.querySelector("input");
let 	selected = null;
let 	allowShiny = false;
let 	isChangingRegion = false;
let 	allowRegionChange = false;
let		selectedRegion = null;


/* Social media links */

const githubURL = 'https://github.com/haitamgrissen/';


let listBall = null;

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
		'max': 721,
		'region': 'kalos',
	},
	'alola': {
		'min': 722,
		'max': 807,
		'region': 'kalos',
	},
	'all': {
		'min': 1,
		'max': 807,
		'region': 'all',
	},
}

const types = {
	'normal': 	{'color':'#A8A77A', },
	'fire': 	{'color':'#EE8130', },
	'water': 	{'color':'#6390F0', },
	'electric': {'color':'#F7D02C', },
	'grass': 	{'color':'#7AC74C', },
	'ice': 		{'color':'#96D9D6', },
	'fighting': {'color':'#C22E28', },
	'poison': 	{'color':'#A33EA1', },
	'ground': 	{'color':'#E2BF65', },
	'flying': 	{'color':'#A98FF3', },
	'psychic': 	{'color':'#F95587', },
	'bug': 		{'color':'#A6B91A', },
	'rock': 	{'color':'#B6A136', },
	'ghost': 	{'color':'#735797', },
	'dragon': 	{'color':'#6F35FC', },
	'dark': 	{'color':'#705746', },
	'steel': 	{'color':'#B7B7CE', },
	'fairy': 	{'color':'#D685AD', },
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


	removeChildren(descDiv);

	let description = '';
	for (var entry of entries)
	{
		if (entry.language.name == 'en')
		{
			if (!description.includes(entry.flavor_text))
			{
				description += entry.flavor_text;
				const elem = document.createElement('p');
				elem.classList.add('base-text');
				elem.textContent = entry.flavor_text;
				descDiv.appendChild(elem);
			}
			//break ;// this break was here for one entry per pokemon
		}
	}
}

function shadeColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0'+Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

function updateType(pokemon){
	const typeDiv = document.querySelector('.poke-type');
	removeChildren(typeDiv);
	const typeIconsURL = 'https://raw.githubusercontent.com/HybridShivam/Pokemon/master/assets/Others/type-icons/';
	pokemon.types.forEach((type) => {
		const typeBox = document.createElement('div');
		typeBox.classList.add('type-box');
		//typeBox.textContent = type.type.name;

		const color = types[type.type.name].color;
		const darkColor = shadeColor(color, -100);
		typeBox.style.setProperty('background' ,`radial-gradient(circle at 60% 30%, ${color}, ${color} 50%, ${darkColor} 75%)`);
		typeBox.style.setProperty('box-shadow', `5px -5px 25px 5px ${color}`);

		const typeImg = document.createElement('img');
		typeImg.title = type.type.name;
		typeImg.classList.add('type-icon');
		typeImg.src = typeIconsURL + type.type.name + '.svg';

		typeBox.append(typeImg);

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
	illustartion.alt = pokemon.name + ' illustration';
	illustartion.title = pokemon.name;
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

		// rightDiv.append(listNameH1, listBall);
		selected.classList.add('unselected');
		selected.classList.remove('selected');
	}
	
	selected = document.querySelector(`[data-id="${pokemon.id}"]`);
	selected.classList.remove('unselected');
	selected.classList.add('selected');

	//Add Selection Flat Pokeball icon
	const rightDiv = selected.firstChild;
	rightDiv.append(listBall);
	// console.log(rightDiv);

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


	rightDiv.append(listNameH1);


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
	listImg.alt = pokemon.name + ' thumbnail';
	listImg.title = pokemon.name;
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

	titleLogo.addEventListener('click', (event) => {
		window.open(githubURL).focus();
	});

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
				selectPokemonbyName(searchQuery.toLowerCase().replace(' ', ''));
			else if (typeof searchQuery == 'number')
			selectPokemonbyId(searchQuery);
	  }
	});
}



listBall = document.createElement('img');
listBall.classList.add('pokeball-sprite');
listBall.src = 'src/icons/listSelectedPokeBall.svg';

selectedRegion = regions.kanto;
selectPokemonbyId(selectedRegion.min);
loadPokedex();
initDropDowns();
