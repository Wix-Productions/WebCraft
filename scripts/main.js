"use strict";

window.addEventListener("load",async () => {
	window.resources = await Load("resources/default.resources.webcraft","json");

	window.world = World.generate();

	document.body.append(world.canvas);

	window.addEventListener("resize",() => world.size = [innerWidth,innerHeight]);

	world.rendering = true;
});