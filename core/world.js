class World {
	static loadResourcesPackage = (url="https://webcraft.wixonic.fr/files/default.resources.webcraft") => {
		return new Promise((resolve,reject) => {
			Loader.say("Loading resources package");

			request(url,"text/plain")
			.then((result) => {
				Loader.step();
				Loader.say("Parsing resources package");

				try {
					resolve(JSON.parse(result));
				} catch (e) {
					reject("Parsing error on resources package",e,"3.3.1");
				}
			}).catch((e) => reject("Resources package not found",e,"3.3.0"));
		});
	};

	constructor () {
		Loader.say("Creating world");

		this.datas = {
			b: {},
			p: {},
			m: []
		};

		Loader.step();
	}

	async from (datas) {
		Loader.say("Setting world datas");
		this.datas = datas;
		Loader.step();

		Loader.say("Checking world datas");
		if (!this.datas.b) {
			crash("Corrupt world","Missing blocks property","3.0");
		}
		Loader.step();

		if (!this.datas.p) {
			crash("Corrupt world","Missing players property","3.0");
		}
		Loader.step();

		if (!this.datas.m) {
			crash("Corrupt world","Missing mobs property","3.0");
		}
		Loader.step();

		if (!this.datas.r) {
			await (new Promise((resolve) => {
				World.loadResourcesPackage().then((pack) => {
					this.datas.r = pack;
					Loader.step();
					resolve();
				}).catch((i,e,c) => crash(i || "Resources package error",e,c || "3.3"));
			}));
		} else {
			if (navigator.onLine) {
				Loader.say("Updating resources package");
				await (new Promise((resolve) => {
					World.loadResourcesPackage().then((pack) => {
						this.datas.r = pack;
						Loader.step();
						resolve();
					}).catch((i,e,c) => crash(i || "Resources package error",e,c || "3.3"));
				}));
			} else {
				Loader.step(2);
			}
		}

		Loader.say("Checking resources package datas");

		const r = this.datas.r;
		const l = (t) => t ? 0 : 1;

		if (!r) {
			crash("Corrupt world","Missing resources pack","3.0");
		} else if (!r.a || !r.c || !r.i || !r.n || !r.v || !r.d || !r.d.b) {
			crash("Missing properties on resources package","Missing properties","3.2.2");
		}
		Loader.step();
	}
};