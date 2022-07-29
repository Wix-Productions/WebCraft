class Renderer {
	constructor () {
		this.canvas = document.createElement("canvas");

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(50,0,0.1,1);

		this.camera.position.set(0,25,-5);
		this.camera.lookAt(0,0,0);

		this.lights = {
			ambient: new THREE.AmbientLight("#FFF",1),
			spot: new THREE.SpotLight("#FFF",1,0,Math.PI / 2)
		};

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

		this.render = false;
	}

	async update () {
		this.startUpdate = performance.now();

		if (window.render === true && this.render === true) {
			window.render = false;

			const W = innerWidth;
			const H = innerHeight;

			this.camera.aspect = W / H;
			this.camera.fov = settings.fov;
			this.camera.far = settings.renderDistance * Math.min(Chunk.size.width,Chunk.size.depth);
			this.camera.updateProjectionMatrix();

			this.renderer.setSize(W,H);

			this.startRender = performance.now();

			for (let x = 0; x < world.chunks.length && x < World.size.width; ++x) {
				for (let z = 0; z < world.chunks[x].length && z < World.size.depth; ++z) {
					world.chunks[x][z].render();
				}
			}

			this.renderer.render(this.scene,this.camera);

			this.endRender = performance.now();
		}

		this.endUpdate = performance.now();

		requestAnimationFrame(() => this.update());
	}
};