window.idList = [];
window.objectList = {};


class Core {
	static ID = () => {
		const PID = () => IntRandom(46656,1679615).toString(36);
		
		let id = 0;
		
		while (id === 0 || idList.includes(id)) {
			id = `${PID()}-${PID()}-${PID()}`;
		}

		idList.push(id);

		return id;
	};

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
			this._map = new Map(this.raw.map);
			this.raw.map = this._map.export();

			this._map.addListener("update",() => {
				this.raw.map = this._map.export();
				this.update();
			});
		}

		return this._map;
	}

	set map (v) {
		if (v instanceof Map) {
			this._map = v;
			this.raw.map = v.export();
		} else {
			crash("Invalid type","Cannot set map property of world with other than a Map");
		}
	}

	get package () {
		if (!this._package) {
			this._package = new Package(this.raw.package);
			this.raw.package = this._package.export();

			this._package.addListener("update",() => {
				this.raw.package = this._package.export();
				this.update();
			});
		}

		return this._package;
	}

	set package (v) {
		if (v instanceof Package) {
			this._package = v;
			this.raw.package = v.export();
		} else {
			crash("Invalid type","Cannot set package property of world with other than a Package");
		}
	}
};

class Map extends CoreObject {
	constructor (raw,id) {
		super(raw,id);

		this.update(Map);
	}

	getChunk (x=0,y=0) {
		this._generateChunks();

		return this.chunks[y][x];
	}

	setChunk (c,x=0,y=0) {
		this._generateChunks();

		if (c instanceof Chunk) {
			this.chunks[y][x] = c;
			this.raw.chunks[y][x] = c.export();
			
			c.addListener("update",() => {
				this.chunks[y][x] = c;
				this.raw.chunks[y][x] = c.export();
			});
		}
	}

	_generateChunks () {
		if (!this.chunks) {
			this.chunks = [];

			for (let y = 0; y < this.raw.chunks.length; ++y) {
				this.chunks[y] = [];

				for (let x = 0; x < this.raw.chunks[y].length; ++x) {
					this.chunks[y][x] = new Chunk(this.raw.chunks[y][x]);
					this.raw.chunks[y][x] = this.chunks[y][x].export();

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

		this.update(Chunk);
	}
};

class Block extends CoreObject {
	constructor (raw,id) {
		super(raw,id);

		this.update(Block);
	}
};


class Package extends CoreObject {
	constructor (raw,id) {
		super(raw,id);

		this.update(Package);
	}
};
