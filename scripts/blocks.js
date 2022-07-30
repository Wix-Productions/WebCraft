class Block {
	constructor (type="error",position={},rotation={},datas=[]) {
		this.type = type;

		this._position = {
			x: position.x || 0,
			y: position.y || 0,
			z: position.z || 0
		};

		this._rotation = {
			x: rotation.x || 0,
			y: rotation.y || 0,
			z: rotation.z || 0
		};
		
		this.datas = datas;
	}
	
	get position () {
		return [Int(this._position.x),Int(this._position.y),Int(this._position.z)];
	}
	
	get rotation () {
		return [Radian(Int(this._rotation.x) * 90),Radian(Int(this._rotation.y) * 90),Radian(Int(this._rotation.z) * 90)];
	}
	
	get geometry () {
		const block = world.resources.blocks[this.type] || world.resources.blocks["error"];
		
		return Generated.geometries[block.geometry];
	}
	
	get material () {
		const block = world.resources.blocks[this.type] || world.resources.blocks["error"];
		
		return Generated.materials[block.material];
	}

	get mesh () {
		this._mesh = new THREE.Mesh(this.geometry,this.material);
		this._mesh.position.set(this.position[0],this.position[1],this.position[2]);
		this._mesh.rotation.set(this.rotation[0],this.rotation[1],this.rotation[2]);
		this._mesh.updateMatrix();

		return this._mesh;
	}

	get visible () {
		return true;
	}

	export () {
		return {
			datas: this.datas,
			position: this._position,
			rotation: this._rotation,
			type: this.type
		};
	}
};