const M = (X,I=0) => {
	let P = {};

	switch (I) {
		case 0:
			X.magFilter = THREE.NearestFilter;
			P.map = X;
			P.transparent = true;
			break;

		default:
			throw "Invalid material type";
			break;
	}

	return new THREE.MeshLambertMaterial(P);
};

const T = (U) => (new THREE.TextureLoader()).load(U);