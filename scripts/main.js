window.executeDOMActions = (actions) => {
	for (let action of actions) {
		const elements = document.querySelectorAll(action.selector);
		
		for (let element of elements) {
			for (let event of action.events) {
				element.addEventListener(event,action);
			}
		}
	}
};

window.ready = () => {
	const actions = [
		{
			selector: "*",
			events: ["click","mousedown","mousemove","mouseup","touchstart","touchmove","touchend","input"],
			function: (event) => {
				if (this.getAttribute("disabled") == "true") {
					event.preventDefault();
				}
			}
		}
	];
	
	executeDOMActions(actions);
};
