class Chunk {
	static size = {
		width: 16,
		height: 64,
		depth: 16
	}

	constructor (blocks,position) {
		this.blocks = blocks || [];
		
		this.position = {
			x: position.x || 0,
			z: position.z || 0
		};

		for (let x = 0; x < this.blocks.length && x < Chunk.size.width; ++x) {
			for (let z = 0; z < this.blocks[x].length && z < Chunk.size.depth; ++z) {
				for (let y = 0; y < this.blocks[x][z].length && y < Chunk.size.height; ++y) {
					if (!this.blocks[x][z][y] instanceof Block) {
						this.blocks[x][z][y] = new Block(this.blocks[x][z][y]);
					}
				}
			}
		}
	}

	get canRender () {
		return distanceBetween([this.position.x,0,this.position.z],[renderer.camera.position.x / Chunk.width,0,renderer.camera.position.z / Chunk.depth]) <= (settings.renderDistance + 1) * Math.min(Chunk.size.width,Chunk.size.depth);
	}

	async render () {
		if (this.group instanceof THREE.Group) {
			this.group.clear();

			if (this.canRender) {
				this.group.visible = true;

				for (let x = 0; x < this.blocks.length && x < Chunk.size.width; ++x) {
					for (let z = 0; z < this.blocks[x].length && z < Chunk.size.depth; ++z) {
						for (let y = 0; y < this.blocks[x][z].length && y < Chunk.size.height; ++y) {
							const block = this.blocks[x][z][y];

							this.group.add(this.blocks[x][z][y].mesh.clone());
						}
					}
				}
				
				this.group.position.set(Int(this.position.x) * Chunk.size.width,0,Int(this.position.z) * Chunk.size.depth);
			} else {
				this.group.visible = false;
			}
		} else {
			this.group = new THREE.Group();
			renderer.scene.add(this.group);
			await this.render();
		}
	}

	async export () {
		let blocks = this.blocks;

		for (let x = 0; x < blocks.length && x < Chunk.size.width; ++x) {
			for (let z = 0; z < blocks[x].length && z < Chunk.size.depth; ++z) {
				for (let y = 0; y < blocks[x][z].length && y < Chunk.size.height; ++y) {
					blocks[x][z][y] = await blocks[x][z][y].export();
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