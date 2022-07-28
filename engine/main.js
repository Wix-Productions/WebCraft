window.onerror = (e) => crash(null,e);


const Launch = async () => {
	Loader.set(0);
	Loader.show();

	Loader.say("Loading settings");
	await Settings.get();
	Loader.step();

	if (Settings.dev) {
		Loader.say("Adding PerfTool");
		document.body.append(PerfTool.container);
		PerfTool.active = true;
		Loader.step();
	} else {
		Loader.step();
	}

	Loader.say("Initializing world");
	window.world = new World(datas);
	Loader.step();

	Loader.say("Initializing map");
	window.map = world.map;
	Loader.step();


};


window.addEventListener("DOMContentLoaded",() => {
	Loader.init()

	window.main = document.getElementsByTagName("main")[0];

	try {
		const q = window.location.search.replace("?","").split("&");

		for (let x = 0; x < q.length; ++x) {
			q[x] = q[x].split("=");
		}

		window.queries = Object.fromEntries(q);
	} catch (e) {
		crash("Invalid query parameters",e);
		return;
	}

	if (window.queries) {
		switch (true) {
			case (queries.create !== undefined):
				crash(null,null);
				break;

			case (queries.load !== undefined):
				try {
					request(`blob:${window.location.origin}/${unescape(decodeURIComponent(queries.load))}`,null,2500).then((datas) => {
						if (window.localStorage) {
							localStorage.setItem("webraft-offline-world",datas);
							window.location.search = "?play=0";
						} else if (window.sessionStorage) {
							sessionStorage.setItem("webcraft-offline-world",datas);
							window.location.search = "?play=0";
						} else {
							crash("Cannot save world on your device","localStorage and sessionStorage aren't available");
						}
					}).catch((e) => crash("Cannot load world",e));
				} catch (e) {
					crash("Cannot load world",e);
				}
				break;

			case (queries.join !== undefined):
				crash(null,null);
				break;

			case (queries.play !== undefined):
				try {
					if (window.localStorage) {
						window.datas = localStorage.getItem("webraft-offline-world");
					} else if (window.sessionStorage) {
						window.datas = sessionStorage.getItem("webcraft-offline-world");
					} else {
						crash("Cannot save world on your device","localStorage and sessionStorage aren't available");
					}

					if (window.datas) {
						try {
							window.datas = JSON.parse(datas);
						} catch (e) {
							crash("Cannot open world",`ParsingError: invalid file (${e})`);
						}

						try {
							Launch();
						} catch (e) {
							crash("Launching error",e);
						}
					}
				} catch (e) {
					crash("Cannot open world",e);
				}
				break;

			default:
				defaultDisplay();
				break;
		}
	}
});

const Update = () => {
	window.RW = innerWidth;
	window.RH = innerHeight;
	window.W = RW * Q;
	window.H = RH * Q;

	if (window.draw) {
		try {

		} catch (e) {
			crash("Cannot render",e);
		}
	}

	requestAnimationFrame(Update);
};
