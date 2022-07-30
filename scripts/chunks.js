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
					this.blocks[x][z][y] = new Block(this.blocks[x][z][y]);
				}
			}
		}
	}

	get canRender () {
		return distanceBetween([this.position.x,0,this.position.z],[renderer.camera.position.x / Chunk.width,0,renderer.camera.position.z / Chunk.depth]) <= (settings.renderDistance + 1) * Math.min(Chunk.size.width,Chunk.size.depth);
	}

	async render () {
		if (this.mesh instanceof THREE.Mesh) {
			this.mesh.removeFromParent();
		}
		
		if (this.geometry instanceof THREE.BufferGeometry) {
			this.geometry.dispose();
		}
		
		if (this.material instanceof THREE.MeshFaceMaterial) {
			this.material.dispose();
		}
		
		if (this.canRender) {
			this.geometry = new THREE.BufferGeometry();
			const materials = [];
			
			for (let x = 0; x < this.blocks.length && x < Chunk.size.width; ++x) {
				for (let z = 0; z < this.blocks[x].length && z < Chunk.size.depth; ++z) {
					for (let y = 0; y < this.blocks[x][z].length && y < Chunk.size.height; ++y) {
						const block = new THREE.Mesh(this.blocks[x][z][y].geometry);
						block.position.set(x,y,z);
						block.updateMatrix();
						
						const geometry = block.geometry;
						geometry.faces.forEach((f) => f.materialIndex = 0);
						this.geometry.merge(block.geometry,block.matrix,materials.length);
						
						materials.push(block.material);
					}
				}
			}
			
			this.material = new THREE.MeshFaceMaterial(materials);
			
			return new THREE.Mesh(this.geometry,this.material);
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