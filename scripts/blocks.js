window.Texture = (uri="") => Block.generated.textures[uri] = Block.generated.textures[uri] || Script(world.resources.textures[uri])();

class Block {
	static generated = {
		blocks: {},
		geometries: {},
		materials: {},
		textures: {}
	}

	static generate (type="error") {
		const block = world.resources.blocks[type] || world.resources.blocks["error"];

		Block.generated.blocks[type] = new THREE.Mesh(
			Block.generated.geometries[block.geometry] = Block.generated.geometries[block.geometry] || Script(world.resources.geometries[block.geometry])(),
			Block.generated.materials[block.material] = Block.generated.materials[block.material] || Script(world.resources.materials[block.material])()
		);
	}

	constructor (type="error",position={},rotation={},datas=[]) {
		this.type = type;

		this.position = {
			x: position.x || 0,
			y: position.y || 0,
			z: position.z || 0
		};

		this.rotation = {
			x: rotation.x || 0,
			y: rotation.y || 0,
			z: rotation.z || 0
		};

		this.datas = datas;
	}

	get mesh () {
		if (!Block.generated.blocks[this.type]) {
			Block.generate(this.type);
		}

		if (!this._mesh) {
			this._mesh = Block.generated.blocks[this.type].clone();
			this._mesh.position.set(Int(this.position.x),Int(this.position.y),Int(this.position.z));
			this._mesh.rotation.set(Radian(Int(this.rotation.x) * 90),Radian(Int(this.rotation.y) * 90),Radian(Int(this.rotation.z) * 90));
		}

		return this._mesh;
	}

	async export () {
		return this;
	}
};