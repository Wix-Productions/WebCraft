class World {
	static size = {
		chunk: {
			width: 4,
			height: 64,
			depth: 4
		},

		world: {
			width: 1,
			depth: 1
		}
	}

	static async generate (type="flat") {
		const gen = Script(resources.generations[type]);

		for (let cx = 0; cx < gen.chunks.length && cx < World.size.world.width; ++cx) {
			for (let cz = 0; cz < gen.chunks[cx].length && cz < World.size.world.depth; ++cz) {
				for (let x = 0; x < gen.chunks[cx][cz].blocks.length && x < World.size.chunk.width; ++x) {
					for (let z = 0; z < gen.chunks[cx][cz].blocks[x].length && z < World.size.chunk.depth; ++z) {
						for (let y = 0; y < gen.chunks[cx][cz].blocks[x][z].length && y < World.size.chunk.height; ++y) {
							const t = gen.chunks[cx][cz].blocks[x][z][y] || "air";
							const r = (t !== "air" ? (resources.blocks[t] || resources.blocks["error"]) : {
								rotation: {
									x: 0,
									y: 0,
									z: 0
								}
							});

							gen.chunks[cx][cz].blocks[x][z][y] = {
								datas: r.datas || [],
								position: {
									x: x,
									y: y,
									z: z
								},
								properties: r.properties || {},
								rotation: r.rotation || {
									x: Int(Random(0,4)),
									y: Int(Random(0,4)),
									z: Int(Random(0,4))
								},
								type: t
							};
						}
					}
				}

				gen.chunks[cx][cz].position = {
					x: cx,
					z: cz
				};
			}
		}

		console.info(gen);
		return new World(gen);
	}

	constructor (file) {
		this._internal = {
			FPS: {
				list: [],
				previousTimestamp: 0,
				precision: 100,
			},
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
		this.lights = {
			ambient: new THREE.AmbientLight("#FFF",0.25),
			hemisphere: new THREE.HemisphereLight("#FFF",1)
		};
		this.scene.add(this.lights.ambient,this.lights.hemisphere);

		this.camera = new THREE.PerspectiveCamera(45,0,0.1,10000);
		this.camera.position.set(-10,5,-10);
		this.camera.lookAt(0,0,0);

		this.setRenderer({
			antialias: true,
			canvas: this.canvas,
			powerPreference: "high-performance",
			precision: "highp"
		});

		this.size = [innerWidth,innerHeight];
		this.quality = devicePixelRatio;

		window.helper = new THREE.Object3D();
	}

	get antialias () {
		return this._internal.renderer.datas.antialias;
	}

	set antialias (v) {
		const d = this._internal.renderer.datas;
		d.antialias = v;
		this.setRenderer(d);
	}

	get FPS () {
		let FPS = 0;
		
		for (let x = 0; x < this._internal.FPS.list.length; ++x) {
			FPS += this._internal.FPS.list[x];
		}
		
		return FPS / this._internal.FPS.list.length;
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
		this.camera.aspect = v[0] / v[1];
		this.camera.updateProjectionMatrix();
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

		this.renderer.setAnimationLoop(async () => {
			const start = performance.now();

			if (this.rendering === true) {
				const rendering = performance.now();
				await this.render();
				this.renderingTime = performance.now() - rendering;

				this.rendering = false;
			}

			const displaying = performance.now();
			this.renderer.render(this.scene,this.camera);
			this.displayingTime = performance.now() - displaying;


			const FPS = (1 / (start - this._internal.FPS.previousTimestamp)) * 1000;
			
			this._internal.FPS.list.unshift(FPS);
			
			if (this._internal.FPS.list.length > this._internal.FPS.precision) {
				this._internal.FPS.list.pop();
			}
			
			this._internal.FPS.previousTimestamp = start;


			document.getElementsByClassName("stats")[0].innerHTML = `Rendering: ${Int(this.renderingTime)} ms<br />Displaying: ${Int(this.displayingTime)} ms<br />${Int(this.FPS)} FPS`;
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

		for (let x = 0; x < this.blocks.length && x < World.size.chunk.width; ++x) {
			for (let z = 0; z < this.blocks[x].length && z < World.size.chunk.depth; ++z) {
				for (let y = 0; y < this.blocks[x][z].length && y < World.size.chunk.height; ++y) {
					this.blocks[x][z][y] = new Block(this.blocks[x][z][y],this.position);
				}
			}
		}
	}

	get visible () {
		return true;
	}

	async render () {
		if (this.visible) {
			if (this.blockTypes) {
				for (let type in this.blockTypes) {
					this.blockTypes[type].removeFromParent();
					this.blockTypes[type].dispose();
				}
			}

			this.blockTypes = {};

			for (let x = 0; x < this.blocks.length && x < World.size.chunk.width; ++x) {
				for (let z = 0; z < this.blocks[x].length && z < World.size.chunk.depth; ++z) {
					for (let y = 0; y < this.blocks[x][z].length && y < World.size.chunk.height; ++y) {
						const block = this.blocks[x][z][y];

						if (block.type !==  "air") {
							this.blockTypes[block.type] = this.blockTypes[block.type] ? this.blockTypes[block.type] + 1 : 1;
						}
					}
				}
			}

			for (let type in this.blockTypes) {
				this.blockTypes[type] = new THREE.InstancedMesh(...Script(`const textureLoader=new THREE.TextureLoader();const load=(uri="")=>textureLoader.load(uri);return[${(resources.blocks[type] || resources.blocks["error"]).generate}]`),this.blockTypes[type]);
				world.scene.add(this.blockTypes[type]);
			}

			for (let x = 0; x < this.blocks.length && x < World.size.chunk.width; ++x) {
				for (let z = 0; z < this.blocks[x].length && z < World.size.chunk.depth; ++z) {
					for (let y = 0; y < this.blocks[x][z].length && y < World.size.chunk.height; ++y) {
						const block = this.blocks[x][z][y];
						if (block.type !== "air") {
							await block.render(this.blockTypes[block.type]);
							this.blockTypes[block.type].instanceMatrix.needsUpdate = true;
						}
					}
				}
			}
		}
	}
};

class Block {
	constructor (datas,chunkPosition) {
		this.datas = datas.datas;
		this.position = datas.position;
		this.properties = datas.properties;
		this.rotation = datas.rotation;
		this.type = datas.type || "air";

		this.chunkPosition = chunkPosition;
	}

	get visible () {
		return true;
	}

	async render (block) {
		if (this.visible) {
			helper.position.set(Int((this.chunkPosition.x * World.size.chunk.width) + this.position.x),Int(this.position.y),Int((this.chunkPosition.z * World.size.chunk.depth) + this.position.z));
			helper.rotation.set(Int(this.rotation.x),Int(this.rotation.y),Int(this.rotation.z));
			helper.updateMatrix();

			console.log(helper);

			block.setMatrixAt(this.id,helper.matrix);
		}
	}
};