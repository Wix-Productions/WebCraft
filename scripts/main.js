window.executeDOMActions = (actions) => {
	for (let action of actions) {
		const elements = document.querySelectorAll(action.selector);
		
		for (let element of elements) {
			for (let event of action.events) {
				element.addEventListener(event,action.function);
			}
		}
	}
};

window.ready = () => {
	const actions = [
		{
			selector: "body [disabled]",
			events: ["click","mousedown","mousemove","mouseup","touchstart","touchmove","touchend","input"],
			function: (event) => {
				event.preventDefault();
				event.stopImmediatePropagation();
			}
		},{
			selector: "a",
			events: ["click","mouseup","touchend"],
			function: (event) => {
				event.target.setAttribute("href",event.target.getAttribute("url"));
			}
		}
	];
	
	executeDOMActions(actions);
};
