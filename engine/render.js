class Renderer extends CoreObject {
	constructor (raw,id) {
		super(raw,id);

		this.canvas = document.createElement("canvas");
		this.canvas.setAttribute("id","core");
		document.body.append(this.canvas);

		settings.addListener("change",(e,n,v) => {
			const removeList = ["antialias","powerPreference","precision","WebGL2"];

			if (removeList.indexOf(n) !== -1) {
				this.renderer.dispose();
				this.create();
			}

			const changeList = ["FOV","quality","renderDistance"];
			const changeFunc = [
				() => {
					this.camera.fov = v;
					this.camera.updateProjectionMatrix();
				},
				() => {
					this.renderer.setPixelRatio(v);
				},
				() => {
					this.camera.far = v * 16;
					this.camera.updateProjectionMatrix();
				}
			];
			const index = changeList.indexOf(n);

			if (index !== -1) {
				changeFunc[index]();
				this.update();
			}
		});

		window.addEventListener("resize",() => {
			this.renderer.setSize(innerWidth,innerHeight);
			this.camera.aspect = innerWidth / innerHeight;
			this.camera.updateProjectionMatrix();
			this.update();
		});

		this.create();

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(settings.FOV,innerWidth / innerHeight,0.01,settings.renderDistance * 16);
		
		this.camera.position.y = 5;
		this.camera.position.z = 20;

		this.camera.lookAt(0,0,0);

		this.scene.add(new THREE.AmbientLight("#FFF",0.25));

		this.scene.background = new THREE.Color("#111");

		this.update(Renderer);
	}

	create () {
		const options = {
			antialias: settings.antialiasing,
			canvas: this.canvas,
			powerPreference: settings.powerPreference,
			precision: settings.precision
		};

		this.renderer = WebGL2Available && settings.WebGL2 ? new THREE.WebGLRenderer(options) : new THREE.WebGL1Renderer(options);
		this.renderer.setSize(innerWidth,innerHeight);
		this.renderer.setPixelRatio(settings.quality);

		this.update();
	}

	render () {
		if (window.render && !window.renderingLocked && this.scene instanceof THREE.Scene && this.camera instanceof THREE.PerspectiveCamera) {
			this.renderer.render(this.scene,this.camera);
			this.update();
		}
	}
};