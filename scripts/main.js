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
	
	window.world = await World.generate();
	
	window.Generated = {
		geometries: {},
		materials: {},
		textures: {}
	};
	
	for (let id in world.resources.geometries) {
		Generated.geometries[id] = Script(world.resources.geometries[id])();
	}
	
	for (let id in world.resources.textures) {
		const Loader = new THREE.TextureLoader();
		
		Generated.textures[id] = await new Promise((resolve,reject) => Loader.load(world.resources.textures[id],resolve,null,reject));
	}
	
	for (let id in world.resources.materials) {
		Generated.materials[id] = Script(world.resources.materials[id])();
	}
	
	window.renderer = new Renderer();

	DOM.color = "#111119";
	DOM.title = null;

	DOM.init();

	setInterval(Update,1000 / Ticker.ticksPerSeconds);

	window.render = true;
	renderer.render = true;
	
	alert(JSON.stringify({
		infos: renderer.renderer.info,
		childs: renderer.scene.children.length
	}));
});

const Update = () => {
	Ticker.startTime = performance.now();

	for (let f of Ticker.list) {
		
	}

	Ticker.endTime = performance.now();
};