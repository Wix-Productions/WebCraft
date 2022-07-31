window.addEventListener("load",async () => {
	window.resources = await Resources.load("resources/default.resources.webcraft");
	window.world = await World.generate();
	document.body.append(world.canvas);

	window.addEventListener("resize",() => world.size = [innerWidth,innerHeight]);
	world.rendering = true;
});