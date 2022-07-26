window.onerror = (e) => crash(null,e);

window.whenReady = () => {
	window.main = document.getElementsByTagName("main")[0];

	// try {
		const q = window.location.search.replace("?","").split("&");

		for (let x = 0; x < q.length; ++x) {
			q[x] = q[x].split("=");
		}

		window.queries = Object.fromEntries(q);
	// } catch {}

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

					});
				} catch (e) {
					crash("Cannot load world",e,"1.2");
				}
				break;

			default:
				main.innerHTML = `<h1>Offline</h1><button id="create">Create world</button><label for="load">Load world</label><input id="load" type="file" style="display: none; visibility: hidden;" /><input id="code" type="text" placeholder="Frendly code.." />`;
				
				document.getElementById("create").addEventListener("click",() => window.location.search = "?create=0");
				
				document.getElementById("load").addEventListener("input",(e) => {
					const file = e.target.files[0];
					const name = file.name.split(".");

					if (file && name[name.length - 1] === "webcraft" && name[name.length - 2] !== "resources") {
						window.location.search = `?load=${encodeURIComponent(escape(URL.createObjectURL(file).replace("blob:null/","")))}`;
					}
				});

				document.getElementById("code").addEventListener("blur",(e) => {
					window.location.search = `?join=${e.target.value}`;
				});
				break;
		}
	}
};
