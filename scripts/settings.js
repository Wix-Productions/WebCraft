class Settings {
	static async load () {
		const settings = new Settings();

		settings.antialiasing = Boolean(storage.getItem("setting-antialiasing") || true);
		settings.dev = Boolean(sessionStorage.getItem("setting-dev") || false);
		settings.fov = Number(storage.getItem("setting-fov") || 60);
		settings.powerPreference = storage.getItem("setting-powerPreference") || "high-performance";
		settings.precision = storage.getItem("setting-precision") || "highp";
		settings.quality = Number(storage.getItem("setting-quality") || devicePixelRatio);
		settings.renderDistance = Number(storage.getItem("setting-renderDistance") || 4);
		settings.WebGL2 = Boolean(storage.getItem("setting-WebGL2") || true);

		return settings;
	}

	constructor (datas={}) {
		this.datas = {};
	}

	get antialiasing () {
		return this.datas.antialiasing || true;
	}

	set antialiasing (b) {
		if (typeof b === "boolean") {
			this.datas.antialiasing = b;
			storage.setItem("setting-antialiasing",b);
		}
	}

	get dev () {
		return this.datas.dev || false;
	}

	set dev (b) {
		if (typeof b === "boolean") {
			this.datas.dev = b;
			sessionStorage.setItem("setting-dev",b);
		}
	}

	get fov () {
		return this.datas.fov || 60;
	}

	set fov (i) {
		if (Number.isValid(i) && i >= 45 && i <= 100) {
			this.datas.fov = i;
			storage.setItem("setting-fov",i);
		}
	}

	get powerPreference () {
		return this.datas.powerPreference || "high-performance";
	}

	set powerPreference (t) {
		const list = ["low-power","high-performance"];

		if (list.indexOf(t) !== -1) {
			this.datas.powerPreference = t;
			storage.setItem("setting-powerPreference",t);
		}
	}

	get precision () {
		return this.datas.precision || "highp";
	}

	set precision (t) {
		const list = ["lowp","mediump","highp"];

		if (list.indexOf(t) !== -1) {
			this.datas.precision = t;
			storage.setItem("setting-precision",t);
		}
	}

	get quality () {
		return this.datas.quality || devicePixelRatio;
	}

	set quality (i) {
		if (Number.isValid(i) && i >= 0.5 && i <= devicePixelRatio) {
			this.datas.quality = i;
			storage.setItem("setting-quality",i);
		}
	}

	get renderDistance () {
		return this.datas.renderDistance || 4;
	}

	set renderDistance (i) {
		if (Number.isValid(i) && i >= 1 && i <= 32) {
			this.datas.renderDistance = i;
			storage.setItem("setting-renderDistance",i);
		}
	}

	get WebGL2 () {
		return this.datas.WebGL2 || true;
	}

	set WebGL2 (b) {
		if (typeof b === "boolean") {
			this.datas.WebGL2 = b;
			storage.setItem("setting-WebGL2",b);
		}
	}
};