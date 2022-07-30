window.Ticker = {
	list: [],

	get ticksPerSeconds () {
		return 12;
	},

	get time () {
		return Ticker.endTime - Ticker.startTime;
	}
};

window.addEventListener("load",async () => {
	const fakeStorage = {
		getItem () {},
		setItem () {}
	};

	window.sessionStorage = window.sessionStorage || fakeStorage;
	window.storage = localStorage || sessionStorage;
	window.localStorage = window.localStorage || fakeStorage;
	
	window.settings = await Settings.load();

	console.log("Settings loaded");
	await wait();
	
	window.world = await World.generate();

	console.log("World loaded");
	await wait();
	
	window.Generated = {
		geometries: {},
		materials: {},
		textures: {}
	};
	
	for (let id in world.resources.geometries) {
		Generated.geometries[id] = Script(world.resources.geometries[id])();
	}

	console.log("Geometries generated");
	await wait();
	
	for (let id in world.resources.textures) {
		const Loader = new THREE.TextureLoader();
		
		Generated.textures[id] = await new Promise((resolve,reject) => Loader.load(world.resources.textures[id],resolve,null,reject));
		Generated.textures[id].magFilter = THREE.NearestFilter;
	}

	console.log("Textures generated");
	await wait();

	const Texture = (id="error-a") => Generated.textures[id];
	
	for (let id in world.resources.materials) {
		Generated.materials[id] = Script(`const T=(id="error-a")=>Generated.textures[id];` + world.resources.materials[id])();
	}

	console.log("Materials generated");
	await wait();
	
	window.renderer = new Renderer();

	console.log("Renderer created");
	await wait();

	DOM.color = "#111119";
	DOM.title = null;

	DOM.init();
	
	console.log("DOM ready");
	await wait();

	setInterval(Update,1000 / Ticker.ticksPerSeconds);

	window.render = true;
});

const Update = () => {
	Ticker.startTime = performance.now();

	for (let f of Ticker.list) {
		
	}

	Ticker.endTime = performance.now();
};