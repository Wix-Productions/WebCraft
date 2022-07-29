window.onerror = (e) => crash(null,e);


const Launch = async () => {
	Loader.say("Loading rendering code");
	window.renderingCode = await request("../engine/rendering-code.js",null,null,(e) => Loader.step(e.loaded / e.total));
	
	await wait();

	Loader.say("Loading settings");
	window.settings = new Settings();
	Loader.step();
	
	await wait();

	Loader.say("Adding PerfTool");
	document.body.append(PerfTool.container);

	settings.addListener("change",(e,n,v) => {
		if (n === "dev") {
			PerfTool.active = v;
			PerfTool.container.style.display = v ? "block" : "none";
		}
	});
	Loader.step();
	
	await wait();

	Loader.say("Initializing PerfTool");
	PerfTool.active = settings.dev;
	PerfTool.container.style.display = settings.dev ? "block" : "none";
	Loader.step();
	
	await wait();

	Loader.say("Initializing world");
	window.world = new World(datas);
	Loader.step();
	
	await wait();
	
	Loader.say("Setting page title");
	document.getElementsByTagName("title")[0].innerHTML = `${world.name} | WebCraft`;
	Loader.step();
	
	await wait();

	Loader.say("Generating chunks");
	world.map.generateChunks();
	Loader.step();
	
	await wait();

	Loader.say("Initializing renderer");
	window.renderer = new Renderer();
	Loader.step();
	
	await wait();
	
	window.renderedThings = 0;
	
	Loader.say("Rendering chunks");
	for (let id of chunkList) {
		objectList[id].render();
		Loader.step(1 / chunkList.length);
		await wait();
	}
	
	alert(renderedThings);
	
	window.render = true;

	Loader.say("First update");
	Update();
	Loader.step();
	
	await wait();
	
	Loader.say("Waiting for you (click to continue)");
	alert(JSON.stringify(renderer.renderer.info));
};


window.addEventListener("DOMContentLoaded",async () => {
	Loader.init();

	window.storage = window.localStorage || window.sessionStorage;

	window.main = document.getElementsByTagName("main")[0];

	try {
		const q = location.search.replace("?","").split("&");

		for (let x = 0; x < q.length; ++x) {
			q[x] = q[x].split("=");
		}

		window.queries = Object.fromEntries(q);
	} catch (e) {
		crash("Invalid query parameters",e);
		return;
	}

	if (!storage) {
		crash("Old browser or device","localStorage and sessionStorage aren't available");
		return;
	}
	
	const c = document.createElement("canvas");

	if (!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")))) {
		crash("Old browser or device","WebGL isn't available");
		return;
	}

	window.WebGL2Available = (window.WebGL2RenderingContext && c.getContext("webgl2"));

	if (queries) {
		switch (true) {
			case (queries.create !== undefined):
				request("../assets/default.pack.webcraft","json").then((pack) => {
					createWorld(pack).then((world) => {
						location.search = `?play=${encodeURIComponent(escape((URL.createObjectURL(new File([JSON.stringify(world)],"new-world")).replace(`blob:${location.origin}/`,""))))}`;
						Loader.step(Loader.max - Loader.value);
					}).catch((e) => {
						crash("Cannot create world",e);
					});
				}).catch((e) => crash("Cannot load resources package",e));
				break;

			case (queries.join !== undefined):
				crash(null,null);
				break;

			case (queries.play !== undefined):
				document.body.setAttribute("without-maintenance","true");
				document.body.setAttribute("without-tag","true");

				try {
					Loader.set(11);
					Loader.say("Loading world");
					Loader.show();
					
					await wait(250);
					
					request(`blob:${location.origin}/${unescape(decodeURIComponent(queries.play))}`,null,null,(e) => Loader.step(e.loaded / e.total)).then((datas) => {
						Loader.say("Parsing world datas");
						
						try {
							window.datas = JSON.parse(datas);
						} catch (e) {
							crash("Cannot open world",`ParsingError: invalid file (${e})`);
							return;
						}
						
						Loader.step();

						try {
							Launch();
						} catch (e) {
							crash("Cannot launch world",e);
						}
					}).catch((e) => crash("Cannot open world",`World not found: ${e}`));
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
