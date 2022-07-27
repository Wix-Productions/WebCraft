window.ready = () => {
	checkIfDisabled();

	window.ready = true;

	if (typeof window.onReady === "function") {
		onReady();
	}
};

window.waitUntilReady = (f) => {
	if (window.ready === true) {
		f();
	} else {
		requestAnimationFrame(() => waitUntilReady(f));
	}
};

window.checkIfDisabled = () => {
	for (let k in Interfaces) {
		const interface = Interfaces[k];

		if (interface.status.code !== "works") {
			const elements = document.querySelectorAll(`*[interface="${interface.codename}"]`);

			if (elements !== null && interface.status.code === "down") {
				const events = ["click","mousedown","mousemove","mouseup","touchstart","touchmove","touchend","input"];

				for (let x = 0; x < elements.length; ++x) {
					const el = elements[x];

					el.setAttribute("disabled","true");
					el.setAttribute("readonly","true");

					for (let y = 0; y < events.length; ++y) {
						el.addEventListener(events[y],(e) => {
							e.preventDefault();
							e.stopImmediatePropagation();
						});
					}
				}
			}

			for (let x = 0; x < elements.length; ++x) {
				const el = elements[x];

				interactiveTitle(el);

				el.setAttribute("interactive-title",`${interface.status.code === "down" ? "Unavailable" : "Issued"}: ${interface.status.reason}`);
			}	
		}
	}
};

window.interactiveTitle = (el) => {

};
