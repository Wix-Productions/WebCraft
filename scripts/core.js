class World {
	static size = {
		chunk: {
			width: 8,
			height: 64,
			depth: 8
		},

		world: {
			width: 4,
			depth: 4
		}
	}

	static generate (type="flat",...d) {
		const gen = Script(resources.generations[type]);

		for (let cx = 0; cx < gen.chunks.length && cx < World.size.world.width; ++cx) {
			for (let cz = 0; cz < gen.chunks[cx].length && cz < World.size.world.depth; ++cz) {
				for (let x = 0; x < gen.chunks[cx][cz].blocks.length && x < World.size.chunk.width; ++x) {
					for (let z = 0; z < gen.chunks[cx][cz].blocks[x].length && z < World.size.chunk.depth; ++z) {
						for (let y = 0; x < gen.chunks[cx][cz].blocks[x][z].length && y < World.size.chunk.height; ++y) {
							gen.chunks[cx][cz].blocks[x][z][y] = resources.blocks[gen.chunks[cx][cz].blocks[x][z][y]] || resources.blocks["error"];
							gen.chunks[cx][cz].blocks[x][z][y].position = {x:x,y:y,z:z};
						}
					}
				}
			}
		}

		return new World(gen);
	}

	constructor (file) {
		this._internal = {
			renderer: {}
		};

		this.chunks = [];

		for (let x = 0; x < file.chunks.length && x < World.size.world.width; ++x) {
			this.chunks[x] = [];

			for (let z = 0; z < file.chunks[x].length && z < World.size.world.depth; ++z) {
				this.chunks[x][z] = new Chunk(file.chunks[x][z]);
			}
		}

		this.canvas = document.createElement("canvas");

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(45,1,0,0);
		this.setRenderer({
			antialias: true,
			canvas: this.canvas,
			powerPreference: "high-performance",
			precision: "highp"
		});

		this.size = [innerWidth,innerHeight];
		this.quality = devicePixelRatio;
	}

	get antialias () {
		return this._internal.renderer.datas.antialias;
	}

	set antialias (v) {
		const d = this._internal.renderer.datas;
		d.antialias = v;
		this.setRenderer(d);
	}

	get powerPreference () {
		return this._internal.renderer.datas.powerPreference;
	}

	set powerPreference (v) {
		const d = this._internal.renderer.datas;
		d.powerPreference = v;
		this.setRenderer(d);
	}

	get precision () {
		return this.renderer.capabilities.precision;
	}

	set precision (v) {
		const d = this._internal.renderer.datas;
		d.precision = v;
		this.setRenderer(d);
	}

	get quality () {
		return this.renderer.getPixelRatio();
	}

	set quality (v) {
		this.renderer.setPixelRatio(v);
	}

	get size () {
		return this.renderer.getSize();
	}

	set size (v) {
		this.renderer.setSize(v[0],v[1]);
	}


	async render () {
		for (let x = 0; x < this.chunks.length; ++x) {
			for (let z = 0; z < this.chunks[x].length; ++z) {
				await this.chunks[x][z].render();
			}			
		}
	}

	setRenderer (d) {
		if (this.renderer) {
			this.dispose();
		}

		this._internal.renderer.datas = d;

		this.renderer = new THREE.WebGLRenderer(d);

		this.renderer.setAnimationLoop(() => {
			if (this.rendering === true) {
				this.render();
			}

			this.rendering = false;

			this.renderer.render(this.scene,this.camera);
		});
	}
};

class Chunk {
	constructor (datas={}) {
		this.blocks = datas.blocks || [];
		this.position = {
			x: datas.position.x || 0,
			y: 0,
			z: datas.position.z || 0
		};
	}

	get visible () {
		return true;
	}

	async render () {
		if (this.visible) {
			this.blockTypes = {};

			for (let x = 0; x < this.blocks.length && x < World.size.chunk.width; ++x) {
				for (let z = 0; z < this.blocks[x].length && z < World.size.chunk.depth; ++z) {
					for (let y = 0; x < this.blocks[x][z].length && y < World.size.chunk.height; ++y) {
						this.blocks[x][z][y] = new Block(this.blocks[x][z][y],this);
					}
				}
			}

			for (let type in this.blockTypes) {
				this.blockTypes[type] = new THREE.InstancedMesh(...Script(`const textureLoader=new THREE.TextureLoader();const load=(uri="")=>textureLoader.load(uri,()=>world.rendering=true);return[${(resources.blocks[type] || resources.blocks["error"]).generate}]`),this.blockTypes[type]);
				
				world.scene.add(this.blockTypes[type]);
			}

			for (let x = 0; x < this.blocks.length && x < World.size.chunk.width; ++x) {
				for (let z = 0; z < this.blocks[x].length && z < World.size.chunk.depth; ++z) {
					for (let y = 0; x < this.blocks[x][z].length && y < World.size.chunk.height; ++y) {
						await this.blocks[x][z][y].render(this.blockTypes[this.blocks[x][z][y].type]);
					}
				}
			}
		}
	}
};

class Block {
	constructor (datas,chunk) {
		this.type = datas.type;
		this.position = {
			x: datas.position.x || 0,
			y: datas.position.y || 0,
			z: datas.position.z || 0
		};
		this.rotation = {
			x: datas.rotation.x || 0,
			y: datas.rotation.y || 0,
			z: datas.rotation.z || 0
		};
		chunk.blockTypes[this.type] = chunk.blockTypes[this.type] ? chunk.blockTypes[this.type] + 1 : 1;
		this.chunkPosition = chunk.position;
	}

	get visible () {
		return true;
	}

	async render (block) {
		if (this.visible) {
			const obj = new THREE.Object3D();
			obj.position.set(Int((this.chunkPosition.x * World.size.chunk.width) + this.position.x),Int(this.position.y),Int((this.chunkPosition.z * World.size.chunk.depth) + this.position.z));
			obj.rotation.set(Int(this.rotation.x),Int(this.rotation.y),Int(this.rotation.z));
			obj.updateMatrix();

			block.setMatrixAt(this.id,obj.matrix);
		}
	}
};