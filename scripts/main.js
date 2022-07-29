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
		setItem () {},
		clear () {}
	};

	window.sessionStorage = window.sessionStorage || fakeStorage;
	window.storage = localStorage || sessionStorage;
	window.localStorage = window.localStorage || fakeStorage;
	window.TextureLoader = new THREE.TextureLoader();


	window.settings = await Settings.load();
	window.world = await World.generate();
	window.renderer = new Renderer();

	DOM.color = "#888";
	DOM.title = null;

	DOM.init();

	setInterval(Update,1000 / Ticker.ticksPerSeconds);

	window.render = true;
	renderer.render = true;
});

const Update = () => {
	Ticker.startTime = performance.now();

	for (let f of Ticker.list) {
		
	}

	Ticker.endTime = performance.now();
};