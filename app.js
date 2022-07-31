	const 	pokdexURL = './src/pokedex.JSON';
	const 	nameListDiv = document.querySelector('.name-list');
	let 	selected = null;
	let 	illustartion = document.querySelector('.poke-illustaration');


	const typeColors = {
		'Normal': '#A8A77A',
		'Fire': '#EE8130',
		'Water': '#6390F0',
		'Electric': '#F7D02C',
		'Grass': '#7AC74C',
		'Ice': '#96D9D6',
		'Fighting': '#C22E28',
		'Poison': '#A33EA1',
		'Ground': '#E2BF65',
		'Flying': '#A98FF3',
		'Psychic': '#F95587',
		'Bug': '#A6B91A',
		'Rock': '#B6A136',
		'Ghost': '#735797',
		'Dragon': '#6F35FC',
		'Dark': '#705746',
		'Steel': '#B7B7CE',
		'Fairy': '#D685AD',
	};

	function removeChildren(parent){
		var child = parent.lastElementChild; 
        while (child) {
            parent.removeChild(child);
            child = parent.lastElementChild;
        }
	}

	function updateBase(data, currentelement){
		const baseDiv = document.querySelector('.poke-base');
		removeChildren(baseDiv);
		bases = data[currentelement.getAttribute('data-id') - 1].base;
		for(let base in bases)
		{
			const elem = document.createElement('h1');
			elem.classList.add('base-text');
			elem.textContent = `Base ${base} : ${bases[base]}`;
			baseDiv.appendChild(elem);
		}
	}

	function updateType(data, currentelement){
		const typeDiv = document.querySelector('.poke-type');
		removeChildren(typeDiv);
		data[currentelement.getAttribute('data-id') - 1].type.forEach((type) => {
			const typeBox = document.createElement('div');
			typeBox.classList.add('type-box');
			typeBox.textContent = type;
			typeBox.style.border = `2px solid ${typeColors[type]}`;
			typeBox.style.backgroundColor = typeColors[type];

			typeDiv.appendChild(typeBox);
		});
	}
	function updateName(data, currentelement){
		const nameH1 = document.querySelector('.info-name');
		let currentName = data[currentelement.getAttribute('data-id') - 1].name.english;
		nameH1.textContent = currentName;
	}
	function updateIllustration(data, currentelement){
		if (selected)
		{
			selected.classList.add('unselected');
			selected.classList.remove('selected');
		}
		selected = currentelement;
		selected.classList.remove('unselected');
		selected.classList.add('selected');
		const imgLink = './src/images/' + ('000' + currentelement.getAttribute('data-id')).slice(-3) + '.png';
		illustartion.src =  imgLink;
	}



	async function selectPokemon () {
		const res = await fetch(pokdexURL);
		let data = await res.json();


		updateIllustration(data, this);

		updateType(data, this);

		updateBase(data, this);
		updateName(data, this);

	}

	

	function createPokedexList(data, i){
		const listDiv = document.createElement('div');
		listDiv.classList.add('poke-list', 'unselected');
		listDiv.dataset['id'] = `${data[i].id}`;		



		const listNameH1 = document.createElement('h1');
		listNameH1.classList.add('poke-list-name');


		const name = `${data[i].name.english}`;
		listNameH1.textContent = name;


		const leftDiv = document.createElement('div');
		leftDiv.classList.add('list-left');
		const listNoH1 = document.createElement('h1');
		listNoH1.classList.add('poke-list-no');

		const no = `No. ${data[i].id}`;
		listNoH1.textContent = no;


		const listImg = document.createElement('img');
		listImg.classList.add('poke-sprite');

		
		const src = './src/sprites/' + ('000' + data[i].id).slice(-3) + 'MS.png';
		listImg.src = src;

		leftDiv.appendChild(listImg);
		leftDiv.appendChild(listNoH1);


		listDiv.appendChild(listNameH1);
		listDiv.appendChild(leftDiv);
		nameListDiv.append(listDiv);
		listDiv.addEventListener('click', selectPokemon);


		if (i === 0)
		{
			updateIllustration(data, listDiv);

			updateType(data, listDiv);
	
			updateBase(data, listDiv);

			updateName(data, listDiv);
		}
	}

	async function loadPokedexJSON () {
		const res = await fetch(pokdexURL);
		let data = await res.json();

		for(let i = 0; i < 152; i++)
			createPokedexList(data, i);
		}
		

	loadPokedexJSON();


























