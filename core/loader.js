const quoteDuration = 5000;
let previousQuote = -1;

const RandomQuote = () => {
	let id = null;

	while (id === null || id === previousQuote) {
		id = IR(0,Quotes.length - 1);
	}

	window.lastQuote = performance.now();

	return Quotes[id];
};

const Quotes = [
	"Thank you for playing WebCraft!",
	"Webcraft's development has been started five times before this version!",
	"The Voidbarrier had to be called Bedrock as on Minecraft®, before being changed.",
	"At the beginning, Wixonic Productions only contained Wixonic."
];


const Loader = {
	DOM: {},
	max: 2,
	title: "Loading",
	value: 1,

	hide: () => Loader.DOM.container.style.display = "",

	init: () => {
		Loader.DOM.container = document.createElement("loader");
		Loader.DOM.title = document.createElement("title");
		Loader.DOM.barContainer = document.createElement("container");
		Loader.DOM.bar = document.createElement("bar");
		Loader.DOM.quote = document.createElement("quotes");

		Loader.DOM.quote.innerHTML = RandomQuote();

		Loader.DOM.barContainer.append(Loader.DOM.bar);
		Loader.DOM.container.append(Loader.DOM.title);
		Loader.DOM.container.append(Loader.DOM.barContainer);
		Loader.DOM.container.append(Loader.DOM.quote);
		document.body.append(Loader.DOM.container);

		setInterval(() => Loader.DOM.quote.innerHTML = RandomQuote(),quoteDuration);

		Loader._update();
	},

	say: (title="Loading") => {
		Loader.title = title;
	},

	set: (max=2) => {
		Loader.say();
		Loader.max = max;
		Loader.value = 0;
		Loader._update();
	},

	show: () => Loader.DOM.container.style.display = "flex",

	step: (size=1) => {
		Loader.value += size;

		if (Loader.value >= Loader.max) {
			Loader.say("Waiting for the quote");
			setTimeout(Loader.hide,performance.now() + quoteDuration - lastQuote);
		}

		Loader._update();
	},

	_update: () => {
		Loader.DOM.title.innerHTML = `${Loader.title} (${Loader.value}/${Loader.max})`;

		try {
			Loader.DOM.bar.style.width = `${(Loader.value / Loader.max * 100).toFixed(0)}%`;
		} catch {
			Loader.DOM.bar.style.width = "0%";
		}
	}
};