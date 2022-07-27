window.onerror = (e) => crash(null,e);


const Launch = async () => {
	Loader.set(9);
	Loader.show();

	try {
		window.world = new World();
		await world.from(datas);
	} catch (e) {
		crash("World error",e,"3");
	}

	// Loader: 8

	Loader.say("Adding render frame");
	document.body.append(canvas);
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
		crash("Invalid query parameters",e,"1.0");
	}

	if (window.queries) {
		switch (true) {
			case (queries.create !== undefined):
				crash(null,null,"1.1");
				break;

			case (queries.load !== undefined):
				try {
					decodeDataURL(`blob:null/${unescape(decodeURIComponent(queries.load))}`).then((datas) => {
						if (window.localStorage) {
							localStorage.setItem("webraft-offline-world",datas);
							window.location.search = "?play=0";
						} else if (window.sessionStorage) {
							sessionStorage.setItem("webcraft-offline-world",datas);
							window.location.search = "?play=0";
						} else {
							crash("Cannot save world on your device","localStorage and sessionStorage aren't available","1.5");
						}
					}).catch((e) => crash("Cannot load world",e,"1.2"));
				} catch (e) {
					crash("Cannot load world",e,"1.2");
				}
				break;

			case (queries.join !== undefined):
				crash(null,null,"1.3");
				break;

			case (queries.play !== undefined):
				try {
					if (window.localStorage) {
						window.datas = localStorage.getItem("webraft-offline-world");
					} else if (window.sessionStorage) {
						window.datas = sessionStorage.getItem("webcraft-offline-world");
					} else {
						crash("Cannot save world on your device","localStorage and sessionStorage aren't available","1.5");
					}

					if (window.datas) {
						try {
							window.datas = JSON.parse(datas);
						} catch (e) {
							crash("Cannot open world",`ParsingError: invalid file (${e})`,"3.1");
						}

						Launch();
					}
				} catch (e) {
					crash("Cannot open world",e,"1");
				}
				break;

			default:
				defaultDisplay();
				break;
		}
	}
});
