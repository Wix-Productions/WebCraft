window.addEventListener("load",async () => {
	window.resources = await Load("resources/default.resources.webcraft","json");
	window.world = await World.generate();
	document.body.append(world.canvas);

	window.addEventListener("resize",() => world.size = [innerWidth,innerHeight]);
	world.rendering = true;
});