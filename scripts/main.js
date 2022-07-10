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
			selector: "a",
			events: ["click","mouseup","touchend"],
			function: (event) => {
				if (this.getAttribute("disabled") != "true") {
					this.setAttribute("href",this.getAttribute("url"));
				}
			}
		}
	];
	
	executeDOMActions(actions);
};
