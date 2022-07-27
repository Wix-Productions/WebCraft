class World {
	static loadResourcesPackage = (url="https://webcraft.wixonic.fr/files/default.resources.webcraft") => {
		return new Promise((resolve,reject) => {
			request()
			.then(() => {

			}).catch((e) => reject("","","3.3.1"));
		});
	};

	constructor () {
		this.datas = {
			b: {},
			p: {},
			m: []
		};
	}

	from (datas) {
		this.datas = datas;

		if (!this.datas.r) {
			this.datas.r = World.loadResourcesPackage().then((package) => {

			}).catch((i,e,c) => crash(i,e,c));
		}
	}
};