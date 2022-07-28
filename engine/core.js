window.idList = [];
window.objectList = {};
window.chunkList = [];


class Angle {
	constructor (o) {
		this.value = o % 360;
	}

	get radian () {
		return this.value * Math.PI / 180;
	}

	set radian (o) {
		this.value = (o * 180 / Math.PI) % 360;
	}
};

class Vector3 {
	constructor (x,y,z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
};

class Angle3 extends Vector3 {
	constructor (x,y,z) {
		super(x,y,z);

		this.x = new Angle(this.x);
		this.y = new Angle(this.y);
		this.z = new Angle(this.z);
	}
};


class Core {
	static ID () {
		const PID = () => IntRandom(46656,1679615).toString(36);
		
		let id = 0;
		
		while (id === 0 || idList.includes(id)) {
			id = `${PID()}-${PID()}-${PID()}`;
		}

		idList.push(id);

		return id;
	}

	constructor (id) {
		this.id = id || CoreObject.ID();
	}
};

class CoreEvent extends Core {
	constructor (name) {
		super();

		this.list = {};
		this.name = name;
	}

	add (func) {
		this.list[CoreEvent.ID()] = func;
	}

	call (...args) {
		for (let id in this.list) {
			const func = this.list[id];

			if (typeof func === "function") {
				func({
					timestamp: performance.now(),
					type: this.name
				},...args);
			}
		}
	}
};

class CoreObject extends Core {
	constructor (raw,id) {
		super(id);

		this.raw = raw;

		this.events = {};

		this.addEvent("export");
		this.addEvent("reset");
		this.addEvent("update");

		this.update(CoreObject);
	}

	addEvent (name) {
		this.events[name] = new CoreEvent(name);
	}

	addListener (name,func) {
		return this.events[name].add(func);
	}

	removeListener (name,id) {
		this.events[name].list[id] = null;
	}

	export () {
		this.events.export.call();
		return this.raw;
	}

	reset () {
		this.events.reset.call();
		return new this.instanceof(this.raw,this.id).update();
	}

	update (i) {
		this.events.update.call();
		if (i) this.instanceof = i;
		objectList[this.id] = this;
	}
};

class World extends CoreObject {
	constructor (raw,id) {
		super(raw,id);

		this.update(World);
	}

	get map () {
		if (!this._map) {
			this._map = new WorldMap(this.raw.map);
			this.update();

			this._map.addListener("update",() => {
				this.raw.map = this._map.export();
				this.update();
			});
		}

		return this._map;
	}

	set map (v) {
		if (v instanceof WorldMap) {
			this._map = v;
			this.raw.map = v.export();
			this.update();
		} else {
			crash("Invalid type","Cannot set map property of world with other than a WorldMap");
		}
	}

	get pack () {
		if (!this._pack) {
			this._pack = new ResourcesPack(this.raw.pack);
			this.update();
		}

		return this._pack;
	}
};

class WorldMap extends CoreObject {
	constructor (raw,id) {
		super(raw,id);

		this.update(WorldMap);
	}

	getChunk (x=0,y=0) {
		this.generateChunks();

		return this.chunks[y][x];
	}

	setChunk (c,x=0,y=0) {
		this.generateChunks();

		if (c instanceof Chunk) {
			this.chunks[y][x] = c;
			this.update();
			
			c.addListener("update",() => {
				this.chunks[y][x] = c;
				this.raw.chunks[y][x] = c.export();
				this.update();
			});
		}
	}

	generateChunks () {
		if (!this.chunks) {
			this.chunks = [];

			for (let y = 0; y < this.raw.chunks.length; ++y) {
				this.chunks[y] = [];

				for (let x = 0; x < this.raw.chunks[y].length; ++x) {
					this.chunks[y][x] = new Chunk(this.raw.chunks[y][x]);
					this.update();

					this.chunks[y][x].addListener("update",() => {
						this.raw.chunks[y][x] = this.chunks[y][x].export();
						this.update();
					});
				}
			}
		}
	}
};

class Chunk extends CoreObject {
	constructor (raw,id) {
		super(raw,id);

		window.chunkList.push(this.id);

		this.update(Chunk);

		this.addListener("update",() => this.render());
	}

	get blocks () {
		this._generateBlocks();

		return this._blocks;
	}

	_generateBlocks () {
		if (!this._blocks) {
			this._blocks = {};

			for (let pos in this.raw.blocks) {
				this._blocks[pos] = new Block(this.raw.blocks[pos]);
				this.update();

				this._blocks[pos].addListener("update",() => {
					this.raw.blocks[pos] = this._blocks[pos].export();
					this.update();
				});
			}
		}
	}

	render () {
		for (let pos in this.blocks) {
			const block = this.blocks[pos];
			
			if (block.mesh instanceof THREE.Mesh) {
				const p = block.position;
				const r = block.rotation
				block.mesh.position.set(p.x,p.y,p.z);
				block.mesh.rotation.set(r.x.radian,r.y.radian,r.z.radian);
				renderer.scene.add(block.mesh);
			}
		}
	}
};

class RenderableObject extends CoreObject {
	constructor (raw,id) {
		super(raw,id);

		this.update(RenderableObject);
	}

	get position () {
		const p = this.raw.position.split("-");
		return new Vector3(Number(p[0]),Number(p[1]),Number(p[2]));
	}

	set position (v) {
		if (v instanceof Vector3) {
			this.raw.position = `${v.x}-${v.y}-${v.z}`;
		}
	}

	get rotation () {
		const p = this.raw.rotation.split("-");
		return new Angle3(Number(p[0]),Number(p[1]),Number(p[2]));
	}

	set rotation (v) {
		if (v instanceof Angle3) {
			this.raw.rotation = `${v.x.value}-${v.y.value}-${v.z.value}`;
		}
	}
};

class Block extends RenderableObject {
	constructor (raw,id) {
		super(raw,id);

		this.type = this.raw.id;
		this.geometry = world.pack.getGeometry(this.type);
		this.material = world.pack.getMaterial(this.type);
		this.mesh = new THREE.Mesh(this.geometry,this.material);

		this.update(Block);
	}

	remove () {
		this.mesh.dispose();
	}
};

class ResourcesPack extends CoreObject {
	static safe (js="") {
		return js.replaceAll(/(?:window|document)/g,"(null)");
	}

	constructor (raw,id) {
		super(raw,id);

		this.geometries = [];
		this.materials = [];

		this.update(ResourcesPack);
	}

	get author () {
		return this.raw.author;
	}

	get blocks () {
		return this.raw.blocks;
	}

	get creationDate () {
		return this.raw["creation-date"];
	}

	get version () {
		return this.raw.version;
	}

	getBlock (id="error") {
		return this.blocks[id] || this.blocks["error"];
	}

	getGeometry (id="error") {
		if (!this.geometries[id]) {
			this.geometries[id] = new Function(ResourcesPack.safe(`${renderingCode}; try {${this.raw.geometries[this.getBlock(id).geometry || "cube"]}} catch (e) {console.error("Error when generating geometry on ${id}: " + e); return new THREE.BoxGeometry(1,1,1)}`))();
		}

		return this.geometries[id];
	}

	getMaterial (id="error") {
		if (!this.materials[id]) {
			this.materials[id] = new Function(ResourcesPack.safe(`${renderingCode}; try {${this.raw.materials[this.getBlock(id).material || "error"]}} catch (e) {console.error("Error when generating material on ${id}: " + e); ${this.raw.materials[this.getBlock("error").material]}}`))();
		}

		return this.materials[id];
	}
};
