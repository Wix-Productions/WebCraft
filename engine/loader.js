const quoteDuration = 6000;
let previousQuote = -1;

const RandomQuote = () => {
	let id = null;

	while (id === null || id === previousQuote) {
		id = IntRandom(0,Quotes.length - 1);
	}

	return Quotes[id];
};

const Quotes = [
	"Thank you for playing WebCraft!",
	"Webcraft's development has been restarted four times before this version!",
	"The Voidbarrier had to be called Bedrock as on Minecraft®, before being changed.",
	"At the beginning, Wixonic was alone on Wixonic Productions."
];


const Loader = {
	DOM: {},
	max: 2,
	title: "Loading",
	value: 1,

	hide: () => {
		Loader.DOM.container.style.display = "";
		window.draw = window.drawLocked ? false : true;
	},

	init: () => {
		Loader.DOM.container = document.createElement("loader");
		Loader.DOM.title = document.createElement("title");
		Loader.DOM.barContainer = document.createElement("container");
		Loader.DOM.bar = document.createElement("bar");
		Loader.DOM.quote = document.createElement("quotes");

		Loader.DOM.barContainer.append(Loader.DOM.bar);
		Loader.DOM.container.append(Loader.DOM.title);
		Loader.DOM.container.append(Loader.DOM.barContainer);
		Loader.DOM.container.append(Loader.DOM.quote);
		document.body.append(Loader.DOM.container);

		Loader.DOM.container.addEventListener("click",Loader.quote);

		Loader.quote();

		Loader._update();
	},

	quote: () => {
		if (window.currentQuoteTimeout) {
			clearTimeout(currentQuoteTimeout);
		}

		Loader.DOM.quote.innerHTML = RandomQuote() + "<br />Click to skip";
		window.lastQuote = performance.now();

		window.currentQuoteTimeout = setTimeout(Loader.quote,quoteDuration);
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

	show: () => {
		Loader.DOM.container.style.display = "flex";
		window.draw = false;
	},

	step: (size=1) => {
		Loader.value += size;

		if (Loader.value >= Loader.max) {
			Loader.DOM.container.addEventListener("click",Loader.hide,{once: true});
			Loader.say("Waiting for the quote (click to skip)");
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