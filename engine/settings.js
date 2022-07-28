class Settings extends CoreObject {
	constructor (raw,id) {
		super(raw || {},id);

		this.addEvent("change");

		this.antialiasing = Boolean(storage.getItem("setting-antialiasing") || true);
		this.dev = Boolean(sessionStorage.getItem("setting-dev") || false);
		this.fov = Number(storage.getItem("setting-fov") || 60);
		this.powerPreference = storage.getItem("setting-powerPreference") || "high-performance";
		this.precision = storage.getItem("setting-precision") || "highp";
		this.quality = Number(storage.getItem("setting-quality") || devicePixelRatio);
		this.renderDistance = Number(storage.getItem("setting-renderDistance") || 4);
		this.WebGL2 = Boolean(storage.getItem("setting-WebGL2") || true);
		
		this.update(Settings);
	}

	get antialiasing () {
		return this.raw.antialiasing;
	}

	set antialiasing (b) {
		if (typeof b === "boolean") {
			this.raw.antialiasing = b;
			storage.setItem("setting-antialiasing",b);
			this.events.change.call("antialiasing",b);
			this.update();
		}
	}

	get dev () {
		return this.raw.dev;
	}

	set dev (b) {
		if (typeof b === "boolean") {
			this.raw.dev = b;
			sessionStorage.setItem("setting-dev",b);
			this.events.change.call("dev",b);
			this.update();
		}
	}

	get powerPreference () {
		return this.raw.powerPreference;
	}

	set powerPreference (t) {
		const list = ["low-power","high-performance"];

		if (list.indexOf(t) !== -1) {
			this.raw.powerPreference = t;
			storage.setItem("setting-powerPreference",t);
			this.events.change.call("powerPreference",t);
			this.update();
		}
	}

	get precision () {
		return this.raw.precision;
	}

	set precision (t) {
		const list = ["lowp","mediump","highp"];

		if (list.indexOf(t) !== -1) {
			this.raw.precision = t;
			storage.setItem("setting-precision",t);
			this.events.change.call("precision",t);
			this.update();
		}
	}

	get quality () {
		return this.raw.quality;
	}

	set quality (i) {
		if (typeof i === "number" && i >= 0.5 && i <= devicePixelRatio) {
			this.raw.quality = i;
			storage.setItem("setting-quality",i);
			this.events.change.call("quality",i);
			this.update();
		}
	}

	get renderDistance () {
		return this.raw.renderDistance;
	}

	set renderDistance (i) {
		if (typeof i === "number" && i >= 1 && i <= 32) {
			this.raw.renderDistance = i;
			storage.setItem("setting-renderDistance",i);
			this.events.change.call("renderDistance",i);
			this.update();
		}
	}

	get WebGL2 () {
		return this.raw.WebGL2;
	}

	set WebGL2 (b) {
		if (typeof b === "boolean") {
			this.raw.WebGL2 = b;
			storage.setItem("setting-WebGL2",b);
			this.events.change.call("WebGL2",b);
			this.update();
		}
	}
};