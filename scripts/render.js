class Renderer {
	constructor () {
		this.canvas = document.createElement("canvas");

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(50,0,0.1,10000);

		this.camera.position.set(-50,25,-50);
		this.camera.lookAt(25,7,25);

		this.lights = {
			ambient: new THREE.AmbientLight("#FFF",0.25),
			spot: new THREE.SpotLight("#FFF",1,0,Math.PI / 2)
		};
		
		this.lights.spot.position.set(0,1000,0);
		this.lights.spot.lookAt(0,0,0);

		this.scene.add(this.lights.ambient,this.lights.spot);

		this.create();

		DOM.tag("main").append(this.canvas);

		this.update();
	}

	get background () {
		return this.scene.background;
	}

	set background (v) {
		if (v instanceof THREE.Color) {
			this.scene.background = v;
			render = true;
		}
	}

	get quality () {
		return this.renderer.getPixelRatio();
	}

	set quality (v) {
		if (typeof v === "number" && v >= 0.25 && v <= devicePixelRatio) {
			this.renderer.setPixelRatio(v);
			render = true;
		}
	}

	get renderTime () {
		return this.endRender - this.startRender;
	}

	get updateTime () {
		return this.endUpdate - this.startUpdate;
	}

	create () {
		this.renderer = new THREE.WebGLRenderer({
			canvas: this.canvas
		});
	}

	async update () {
		this.startUpdate = performance.now();

		if (window.render === true && this.render === true) {
			window.render = false;

			const W = innerWidth;
			const H = innerHeight;

			this.camera.aspect = W / H;
			this.camera.fov = settings.fov;
			this.camera.updateProjectionMatrix();

			this.renderer.setSize(W,H);

			this.startRender = performance.now();

			for (let x = 0; x < world.chunks.length && x < World.size.width; ++x) {
				for (let z = 0; z < world.chunks[x].length && z < World.size.depth; ++z) {
					await world.chunks[x][z].render();
				}
			}

			this.renderer.render(this.scene,this.camera);

			this.endRender = performance.now();

			console.info(`${this.renderer.info.render.triangles} triangles displayed in ${this.renderTime} ms`);
		}

		this.endUpdate = performance.now();

		requestAnimationFrame(() => this.update());
	}
};