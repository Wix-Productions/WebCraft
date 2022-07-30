const DOM = {
	init () {
		window.addEventListener("resize",() => render = true);
	},


	get body () {
		return document.body;
	},

	get color () {
		return DOM.id("meta-color").value;
	},

	set color (d) {
		DOM.id("meta-color").value = d;
		DOM.html.style.background = d;
		DOM.body.style.background = d;
	},

	get head () {
		return document.head;
	},

	get html () {
		return document.documentElement;
	},

	get title () {
		return DOM.tag("title");
	},

	set title (d) {
		DOM.tag("title").innerHTML = d ? `${d} | WebCraft` : "WebCraft";
	},

	create (d) {
		return document.createElement(d);
	},

	id (d) {
		return document.getElementById(d);
	},

	class (d) {
		return DOM.classes(d)[0];
	},

	classes (d) {
		return document.getElementsByClassName(d);
	},

	tag (d) {
		return DOM.tags(d)[0];
	},

	tags (d) {
		return document.getElementsByTagName(d);
	}
};