const defaultDisplay = () => {
	main.innerHTML = `<h1>Offline</h1><button id="create">Create world</button><label for="load">Load world</label><input id="load" type="file" style="display: none; visibility: hidden;" /><br /><input id="code" type="text" placeholder="Frendly code.." /><button id="join">Join friend</button>`;

	document.getElementById("create").addEventListener("click",() => window.location.search = "?create=0");

	document.getElementById("load").addEventListener("input",(e) => {
		const file = e.target.files[0];
		const name = file.name.split(".");

		if (file && name[name.length - 1] === "webcraft" && name[name.length - 2] !== "resources") {
			window.location.search = `?load=${encodeURIComponent(escape(URL.createObjectURL(file).replace("blob:null/","")))}`;
		}
	});

	const joinWith = (key) => {
		if (key.length == 8) {
			window.location.search = `?join=${key}`;
		}
	};

	document.getElementById("code").addEventListener("keydown",(e) => {
		console.log(e.code);

		if (e.code === "Enter") {
			joinWith(e.target.value);
		} else if (e.code === "Delete") {
			e.target.value = "";
		} else if (e.code !== "Backspace" && e.code !== "Escape" && !(/(?:[A-Z]|[a-z]|[0-9]){,8}/g.test(e.key))) {
			e.preventDefault();
		}
	});

	document.getElementById("join").addEventListener("click",() => joinWith(document.getElementById("code").value));
};