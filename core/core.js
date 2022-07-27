window.onerror = (e) => crash(null,e);

window.whenReady = () => {
	window.main = document.getElementsByTagName("main")[0];

	try {
		const q = window.location.search.replace("?","").split("&");

		for (let x = 0; x < q.length; ++x) {
			q[x] = q[x].split("=");
		}

		window.queries = Object.fromEntries(q);
	} catch (e) {
		crash("Invalid query parameters",e,"1.0")
	}

	if (window.queries) {
		switch (true) {
			case (queries.join !== undefined):
				crash(null,null,"1.3");
				break;

			case (queries.create !== undefined):
				crash(null,null,"1.1");
				break;

			case (queries.load !== undefined):
				try {
					decodeDataURL(`blob:null/${unescape(decodeURIComponent(queries.load))}`).then((datas) => {
						if (window.localStorage) {
							localStorage.setItem("webraft-offline-world",datas);
						} else if (window.sessionStorage) {
							sessionStorage.setItem("webcraft-offline-world",datas);
						} else {
							crash("Cannot save world on your device","localStorage and sessionStorage aren't available","1.5")
						}
					}).catch((e) => crash("Cannot load world",e,"1.2"))
				} catch (e) {
					crash("Cannot load world",e,"1.2");
				}
				break;

			default:
				defaultDisplay();
				break;
		}
	}
};
