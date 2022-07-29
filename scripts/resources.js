class Resources {
	static async load (uri="https://webcraft.wixonic.fr/assets/default.resources.webcraft") {
		return new Resources(JSON.parse(await Request(uri)));
	}

	constructor (pack) {
		this.blocks = pack.datas.blocks;
		this.geometries = pack.datas.geometries;
		this.generations = pack.datas.generations;
		this.materials = pack.datas.materials;
		this.textures = pack.datas.textures;
		this.version = pack.version;
	}
};