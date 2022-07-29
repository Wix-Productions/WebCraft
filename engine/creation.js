const createWorld = async (pack,type="flat") => {
	Loader.init();
	Loader.set(World.size.width * World.size.height * 1.2);
	Loader.say("Generating world");
	Loader.show();
	
	let map = {
		chunks: []
	};
	
	const block = (id="error") => pack.blocks[id] || pack.blocks["error"];
	
	const generations = {
		flat: async () => {
			let blocks = {};
			
			for (let y = 0; y < Chunk.size.height; ++y) {
				for (let x = 0; x < Chunk.size.width; ++x) {
					blocks[`${x}-${y}-0`] = block("voidbarrier");
					blocks[`${x}-${y}-1`] = block("stone");
					blocks[`${x}-${y}-2`] = block("dirt");
					blocks[`${x}-${y}-3`] = block("grass");
					
					Loader.step(1 / Chunk.size.height / Chunk.size.width);
				}
			}
			
			return blocks;
		}
	};
	
	for (let y = 0; y < World.size.height; ++y) {
		map[y] = [];
		
		for (let x = 0; x < World.size.width; ++x) {
			map[y][x] = {
				blocks: await generations[type](),
				items: {}
			};
			
			if (x % 3 === 0) {
				await wait();
			}
		}
	}
	
	return {
		map: map,
		pack: pack,
		world: {}
	};
};