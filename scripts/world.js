class World {
	static size = {
		width: 16,
		depth: 16
	}

	static async generate (type="flat",...d) {
		const resources = await Resources.load("assets/default.resources.webcraft");

		const generation = Script(resources.generations[type])(...d);
		
		return new World({
			chunks: generation.chunks,
			resources: resources
		});
	}

	constructor (datas) {
		this.chunks = datas.chunks || [];
		this.resources = datas.resources;
		this.time = datas.time || 0;

		for (let x = 0; x < this.chunks.length && x < World.size.width; ++x) {
			for (let z = 0; z < this.chunks[x].length && z < World.size.depth; ++z) {
				const chunk = this.chunks[x][z];
				this.chunks[x][z] = new Chunk(chunk.blocks,chunk.position);
			}
		}
	}

	export () {
		let chunks = this.chunks;

		for (let x = 0; x < chunks.length && x < World.size.width; ++x) {
			for (let z = 0; z < chunks[x].length && z < World.size.depth; ++z) {
				chunks[x][z] = chunks[x][z].export();
			}
		}

		return {
			chunks: chunks,
			resources: this.resources,
			time: this.time
		};
	}
};