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
				console.log("Join mode");
				break;

			case (queries.create !== undefined):
				console.log("Create mode");
				break;

			case (queries.load !== undefined):
				console.log("Load mode");
				break;

			default:
				main.innerHTML = `<h1>Offline</h1><button id="create">Create world</button><label for="load">Load world</label><input id="load" type="file" style="display: none; visibility: hidden;" /><input id="code" type="text" placeholder="Frendly code.." />`;
				
				document.getElementByid("")
				break;
		}
	}
};