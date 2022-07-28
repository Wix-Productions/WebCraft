window.onerror = (e) => crash(null,e);


const Launch = async () => {
	Loader.set(0);
	Loader.show();

	Loader.say("Loading settings");
	window.settings = new Settings();
	Loader.step();

	Loader.say("Adding PerfTool");
	document.body.append(PerfTool.container);

	settings.addListener("change",(e,n,v) => {
		if (n === "dev") {
			PerfTool.active = v;
			PerfTool.container.style.display = v ? "block" : "none";
		}
	});
	Loader.step();

	PerfTool.active = settings.dev;
	PerfTool.container.style.display = settings.dev ? "block" : "none";

	Loader.say("Initializing world");
	window.world = new World(datas);
	Loader.step();

	Loader.say("Initializing renderer");
	window.renderer = new Renderer();
	Loader.step();

	Update();
};


window.addEventListener("DOMContentLoaded",() => {
	Loader.init()

	window.storage = window.localStorage || window.sessionStorage;

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

	if (!window.storage) {
		crash("Old browser or device","localStorage and sessionStorage aren't available");
		return;
	}

	if (!window.devicePixelRatio) {
		crash("Old browser or device","devicePixelRatio isn't available");
		return;
	}

	const c = document.createElement("canvas");

	if (!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")))) {
		crash("Old browser or device","WebGL isn't available");
		return;
	}

	window.WebGL2Available = (window.WebGL2RenderingContext && c.getContext("webgl2"));

	if (window.queries) {
		switch (true) {
			case (queries.create !== undefined):
				crash(null,null);
				break;

			case (queries.load !== undefined):
				try {
					request(`blob:${window.location.origin}/${unescape(decodeURIComponent(queries.load))}`,null,2500).then((datas) => {
						storage.setItem("webraft-offline-world",datas);
						window.location.search = "?play=0";
					}).catch((e) => crash("Cannot load world",e));
				} catch (e) {
					crash("Cannot load world",e);
				}
				break;

			case (queries.join !== undefined):
				crash(null,null);
				break;

			case (queries.play !== undefined):
				document.body.setAttribute("without-maintenance","true");
				document.body.setAttribute("without-tag","true");

				try {
					window.datas = storage.getItem("webraft-offline-world");
					
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
					} else {
						crash("Cannot open world","World not found");
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
	try {
		renderer.render();
	} catch (e) {
		crash("Cannot render",e);
	}

	requestAnimationFrame(Update);
};
