class World {
	static size = {
		width: 8,
		depth: 8
	}

	static async generate (type="flat",...d) {
		const resources = await Resources.load("assets/default.resources.webcraft");

		const generation = Script(resources.generations[type])(...d);

		for (let x = 0; x < generation.chunks.length && x < World.size.width; ++x) {
			for (let z = 0; z < generation.chunks[x].length && z < World.size.depth; ++z) {
				for (let bx = 0; bx < generation.chunks[x][z].blocks.length && bx < Chunk.size.width; ++bx) {
					for (let bz = 0; bz < generation.chunks[x][z].blocks[bx].length && bz < Chunk.size.depth; ++bz) {
						for (let by = 0; by < generation.chunks[x][z].blocks[bx][bz].length && by < Chunk.size.height; ++by) {
							const b = generation.chunks[x][z].blocks[bx][bz][by];
							generation.chunks[x][z].blocks[bx][bz][by] = new Block(b.type || b,b.position || {
								x: bx,
								y: by,
								z: bz
							},b.rotation || {
								x: Int(Random(0,4)),
								y: Int(Random(0,4)),
								z: Int(Random(0,4))
							},b.datas);
						}
					}
				}
			}
		}

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
				this.chunks[x][z] = new Chunk(this.chunks[x][z].blocks,this.chunks[x][z].position);
			}
		}
	}

	async export () {
		let chunks = this.chunks;

		for (let x = 0; x < chunks.length && x < World.size.width; ++x) {
			for (let z = 0; z < chunks[x].length && z < World.size.depth; ++z) {
				chunks[x][z] = await chunks[x][z].export();
			}
		}

		return {
			chunks: chunks,
			resources: this.resources,
			time: this.time
		};
	}
};