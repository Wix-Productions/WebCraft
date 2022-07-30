class Chunk {
	static size = {
		width: 16,
		height: 64,
		depth: 16
	}

	constructor (blocks,position,resources) {
		this.blocks = blocks || [];
		
		this._position = {
			x: position.x || 0,
			z: position.z || 0
		};

		for (let x = 0; x < this.blocks.length && x < Chunk.size.width; ++x) {
			for (let z = 0; z < this.blocks[x].length && z < Chunk.size.depth; ++z) {
				for (let y = 0; y < this.blocks[x][z].length && y < Chunk.size.height; ++y) {
					const block = this.blocks[x][z][y];
					const rblock = resources.blocks[block.type || "error"] || resources.blocks["error"];
					this.blocks[x][z][y] = new Block(block.type || "error",block.position || {x:x,y:y,z:z},block.rotation || rblock.rotation || {x:Int(Random(0,4)),y:Int(Random(0,4)),z:Int(Random(0,4))},block.datas || rblock.datas || []);
				}
			}
		}
	}

	get position () {
		return [Int(this._position.x) * Chunk.size.width,0,Int(this._position.z) * Chunk.size.depth];
	}

	get visible () {
		return distanceBetween(this.position,[renderer.camera.position.x / Chunk.width,0,renderer.camera.position.z / Chunk.depth]) <= settings.renderDistance * Math.min(Chunk.size.width,Chunk.size.depth);
	}

	async render () {
		if (!this.group) {
			this.group = new THREE.Group();
			this.group.position.set(this.position[0],this.position[1],this.position[2]);
		}

		if (this.visible) {
			this.group.visible = true;

			for (let x = 0; x < this.blocks.length && x < Chunk.size.width; ++x) {
				for (let z = 0; z < this.blocks[x].length && z < Chunk.size.depth; ++z) {
					for (let y = 0; y < this.blocks[x][z].length && y < Chunk.size.height; ++y) {
						if (this.blocks[x][z][y].visible) {
							this.group.add(this.blocks[x][z][y].mesh);
						}
					}
				}
			}

			renderer.scene.add(this.group);
		} else {
			this.group.clear();
			this.group.visible = false;
		}
	}

	export () {
		let blocks = this.blocks;

		for (let x = 0; x < blocks.length && x < Chunk.size.width; ++x) {
			for (let z = 0; z < blocks[x].length && z < Chunk.size.depth; ++z) {
				for (let y = 0; y < blocks[x][z].length && y < Chunk.size.height; ++y) {
					blocks[x][z][y] = blocks[x][z][y].export();
				}
			}
		}

		return {
			blocks: blocks,
			position: {
				x: this.position.x,
				z: this.position.z
			}
		};
	}
};