class Resources {
	static async load (url="https://webcraft.wixonic.fr/resources/default.resources.webcraft") {
		return new Resources(await Load("resources/default.resources.webcraft","json"));
	}

	constructor (resources) {
		this.blocks = resources.blocks;
		this.description = resources.description;
		this.generations = resources.generations;
		this.name = resources.name;
		this.version = resources.version;

		this.blocks.error = {
			geometry: "new THREE.BoxGeometry(0.5,0.5,0.5)",
			material: "new THREE.MeshLambertMaterial({map:loadTexture(`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAYAAABytg0kAAAAFklEQVQImQXBAQEAAACAEP9PF1IISg1Dzgf5+WD3KgAAAABJRU5ErkJggg==`)})",
			name: "Errorblock",
			rotation: {x:0,y:0,z:0},
			scripts: {
				loop: "self.rotation.x++"
			}
		};

		this.check();
		this.compile();
	}

	check () {
		for (let name in this.blocks) {
			this.blocks[name].scripts = this.blocks[name].scripts ? this.blocks[name].scripts : {};
			this.blocks[name].geometry = this.blocks[name].geometry ? this.blocks[name].geometry : this.blocks.error.geometry;
			this.blocks[name].material = this.blocks[name].material ? this.blocks[name].material : this.blocks.error.material;
			this.blocks[name].name = this.blocks[name].name ? this.blocks[name].name : this.blocks.error.name;
		}
	}

	compile () {
		this.compiledBlocks = {};
		
		for (let name in this.blocks) {
			this.compiledBlocks[name] = {
				geometry: Script(`return ${this.blocks[name].geometry}`),
				material: Script(`window.loadTexture = (uri="") => {
	const textureLoader = new THREE.TextureLoader();
	const texture = textureLoader.load(uri);
	texture.magFilter = THREE.NearestFilter;
	return texture;
};

return ${this.blocks[name].material}`)
			};
		}
	}
};

class World {
	static size = {
		chunk: {
			width: 2,
			height: 8,
			depth: 2
		},

		world: {
			width: 2,
			depth: 2
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
							const r = (t !== "air" ? (resources.blocks[t] || resources.blocks["error"]) : {});

							gen.chunks[cx][cz].blocks[x][z][y] = {
								datas: r.datas || [],
								position: {
									x: x,
									y: y,
									z: z
								},
								properties: r.properties || {},
								rotation: r.rotation || {
									x: Int(Random(0,3)),
									y: Int(Random(0,3)),
									z: Int(Random(0,3))
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

		return new World(gen);
	}

	constructor (file) {
		this._internal = {
			displayingTime: [],
			FPS: {
				list: [],
				previousTimestamp: 0,
			},
			precision: 100,
			renderer: {},
			updatingTime: []
		};

		this.scene = new THREE.Scene();
		this.lights = {
			ambient: new THREE.AmbientLight("#FFF",0.25),
			hemisphere: new THREE.HemisphereLight("#FFF",1)
		};
		this.scene.add(this.lights.ambient,this.lights.hemisphere);

		this.canvas = document.createElement("canvas");

		this.camera = new THREE.PerspectiveCamera(45,0,0.1,100);
		this.camera.position.set(2 * World.size.world.width * World.size.chunk.width,2 * World.size.chunk.height,2 * World.size.world.depth * World.size.chunk.depth);
		this.camera.lookAt(World.size.world.width * World.size.chunk.width / 2,World.size.chunk.height / 2,World.size.world.depth * World.size.chunk.depth / 2);
		this.camera.updateMatrixWorld();

		this.setRenderer({
			antialias: true,
			canvas: this.canvas,
			powerPreference: "high-performance",
			precision: "highp"
		});

		this.chunks = [];

		for (let x = 0; x < file.chunks.length && x < World.size.world.width; ++x) {
			this.chunks[x] = [];

			for (let z = 0; z < file.chunks[x].length && z < World.size.world.depth; ++z) {
				this.chunks[x][z] = new Chunk(file.chunks[x][z]);
				this.scene.add(this.chunks[x][z].group);
			}
		}

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

	get displayingTime () {
		let displayingTime = 0;
		
		for (let x = 0; x < this._internal.displayingTime.length; ++x) {
			displayingTime += this._internal.displayingTime[x];
		}
		
		return displayingTime / this._internal.displayingTime.length;
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

	get updatingTime () {
		let updatingTime = 0;
		
		for (let x = 0; x < this._internal.updatingTime.length; ++x) {
			updatingTime += this._internal.updatingTime[x];
		}
		
		return updatingTime / this._internal.updatingTime.length;
	}


	setRenderer (d) {
		if (this.renderer) {
			this.renderer.setAnimationLoop(() => null);
			this.dispose();
		}

		this._internal.renderer.datas = d;

		this.renderer = new THREE.WebGLRenderer(d);

		this.renderer.setAnimationLoop(async () => {
			const start = performance.now();

			if (this.rendering === true) {
				const rendering = performance.now();
				for (let x = 0; x < this.chunks.length; ++x) {
					for (let z = 0; z < this.chunks[x].length; ++z) {
						await this.chunks[x][z].render();
					}
				}

				this.renderingTime = performance.now() - rendering;

				this.rendering = false;
			}

			const updating = performance.now();
			for (let x = 0; x < this.chunks.length; ++x) {
				for (let z = 0; z < this.chunks[x].length; ++z) {
					await this.chunks[x][z].update();
				}
			}
			this._internal.updatingTime.unshift(performance.now() - updating);
			if (this._internal.updatingTime.length > this._internal.precision) {
				this._internal.updatingTime.pop();
			}

			const displaying = performance.now();
			this.renderer.render(this.scene,this.camera);
			this._internal.displayingTime.unshift(performance.now() - displaying);
			if (this._internal.displayingTime.length > this._internal.precision) {
				this._internal.displayingTime.pop();
			}


			const FPS = (1 / (start - this._internal.FPS.previousTimestamp)) * 1000;
			
			this._internal.FPS.list.unshift(FPS);
			
			if (this._internal.FPS.list.length > this._internal.precision) {
				this._internal.FPS.list.pop();
			}
			
			this._internal.FPS.previousTimestamp = start;

			document.getElementsByClassName("stats")[0].innerHTML = `Rendering: ${Int(this.renderingTime)} ms<br />updating: ${Int(this.updatingTime)} ms<br />Displaying: ${Int(this.displayingTime)} ms<br />${Int(this.FPS)} FPS`;
		});
	}
};

class Chunk {
	constructor (datas={}) {
		this.blocks = datas.blocks || [];
		this.position = {
			x: datas.position.x || 0,
			z: datas.position.z || 0
		};

		this.group = new THREE.Group();
		this.group.position.set(Int(this.position.x),0,Int(this.position.z));

		for (let x = 0; x < this.blocks.length && x < World.size.chunk.width; ++x) {
			for (let z = 0; z < this.blocks[x].length && z < World.size.chunk.depth; ++z) {
				for (let y = 0; y < this.blocks[x][z].length && y < World.size.chunk.height; ++y) {
					this.blocks[x][z][y] = new Block(this.blocks[x][z][y]);
				}
			}
		}

		this.changed = true;
	}

	get visible () {
		return true;
	}

	async update () {
		if (this.visible) {
			for (let x = 0; x < this.blocks.length && x < World.size.chunk.width; ++x) {
				for (let z = 0; z < this.blocks[x].length && z < World.size.chunk.depth; ++z) {
					for (let y = 0; y < this.blocks[x][z].length && y < World.size.chunk.height; ++y) {
						await this.blocks[x][z][y].update();
					}
				}
			}
		}
	}

	async render () {
		if (this.visible && this.changed) {
			this.changed = false;
			this.group.clear();

			for (let x = 0; x < this.blocks.length && x < World.size.chunk.width; ++x) {
				for (let z = 0; z < this.blocks[x].length && z < World.size.chunk.depth; ++z) {
					for (let y = 0; y < this.blocks[x][z].length && y < World.size.chunk.height; ++y) {
						await this.blocks[x][z][y].render(this.group);
					}
				}
			}
		}
	}
};

class Block {
	constructor (datas={}) {
		this._internal = {
			position: datas.position,
			rotation: datas.rotation
		};

		this.datas = datas.datas;
		this.position = datas.position;
		this.properties = datas.properties;
		this.rotation = datas.rotation;
		this.type = datas.type || "air";

		this.scripts = {
			loop: new Function("self",`${(resources.blocks[this.type] || resources.blocks["error"]).scripts.loop || ""}; return self;`)
		};
	}

	get position () {
		return [Int(this._internal.position.x),Int(this._internal.position.y),Int(this._internal.position.z)];
	}

	set position (v) {
		this._internal.position = v;
	}

	get rotation () {
		return [Radian(Int(this._internal.rotation.x * 90)),Radian(Int(this._internal.rotation.y * 90)),Radian(Int(this._internal.rotation.z * 90))];
	}

	set rotation (v) {
		this._internal.rotation = v;
	}

	get visible () {
		return this.type !== "air";
	}

	async render (group) {
		if (this.visible) {
			const compiled = resources.compiledBlocks[this.type] || resources.compiledBlocks["error"];
			const mesh = new THREE.Mesh(compiled.geometry,compiled.material);
			mesh.position.set(...this.position);
			mesh.rotation.set(...this.rotation);
			group.add(mesh);
		}
	}

	async update () {
		if (this.visible) {
				const loop = this.scripts.loop.call(null,{
				position: this._internal.position,
				rotation: this._internal.rotation
			});

			this._internal.position = loop.position;
			this._internal.rotation = loop.rotation;
		}
	}
};