var DEMO = {
	// ms_Canvas: null,
	ms_Renderer: null,
	ms_Camera: null, 
	ms_Scene: null, 
	// ms_Controls: null,
	ms_Water: null,

    enable: (function enable() {
        try {
            var aCanvas = document.createElement('canvas');
            return !! window.WebGLRenderingContext && (aCanvas.getContext('webgl') || aCanvas.getContext('experimental-webgl'));
        }
        catch(e) {
            return false;
        }
    })(),
	
	initialize: function initialize(renderer, camera, scene) {
		// this.ms_Canvas = $('#'+inIdCanvas);
		
		// Initialize Renderer, Camera and Scene
		this.ms_Renderer = renderer; // this.enable? new THREE.WebGLRenderer() : new THREE.CanvasRenderer();
		// this.ms_Canvas.html(this.ms_Renderer.domElement);
		this.ms_Scene = scene;// new THREE.Scene();
		
		this.ms_Camera = camera;// new THREE.PerspectiveCamera(55.0, window.ms_Width / window.ms_Height, 0.5, 3000000);
		// this.ms_Camera.position.set(1000, 500, -1500);
		// this.ms_Camera.lookAt(new THREE.Vector3(0, 0, 0));
		
		// Initialize Orbit control		
		// this.ms_Controls = new THREE.OrbitControls(this.ms_Camera, this.ms_Renderer.domElement);
	
		// Add light
		this.directionalLight = new THREE.DirectionalLight(0xffff55, 1);
		this.directionalLight.position.set(600, 300, -600);
		// this.ms_Scene.add(this.directionalLight);
		
		// Load textures		
		var waterNormals = new THREE.ImageUtils.loadTexture('./img/waternormals.jpg');
		waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping; 
		
		// Create the water effect
		this.ms_Water = new THREE.Water(this.ms_Renderer, this.ms_Camera, this.ms_Scene, {
			textureWidth: 512,
			textureHeight: 512,
			waterNormals: waterNormals,
			alpha: 	1.0,
			sunDirection: this.directionalLight.position.normalize(),
			sunColor: 0xffffff,
			waterColor: 0x000000,
			betaVersion: 0,
			side: THREE.DoubleSide,
			distortionScale: 20,
		});
		this.aMeshMirror = new THREE.Mesh(
			new THREE.PlaneBufferGeometry(2000, 2000, 10, 10), 
			this.ms_Water.material
		);
		this.aMeshMirror.add(this.ms_Water);
		this.aMeshMirror.rotation.x = - Math.PI * 0.5;
		
		// this.ms_Scene.add(this.aMeshMirror);
	
		// this.loadSkyBox();
	},
	
	// loadSkyBox: function loadSkyBox() {
	// 	var aCubeMap = THREE.ImageUtils.loadTextureCube([
	// 	  './img/space.jpg',
	// 	  './img/space.jpg',
	// 	  './img/space.jpg',
	// 	  './img/space.jpg',
	// 	  './img/space.jpg',
	// 	  './img/space.jpg'
	// 	]);
	// 	aCubeMap.format = THREE.RGBFormat;

	// 	var aShader = THREE.ShaderLib['cube'];
	// 	aShader.uniforms['tCube'].value = aCubeMap;

	// 	var aSkyBoxMaterial = new THREE.ShaderMaterial({
	// 	  fragmentShader: aShader.fragmentShader,
	// 	  vertexShader: aShader.vertexShader,
	// 	  uniforms: aShader.uniforms,
	// 	  depthWrite: false,
	// 	  side: THREE.BackSide
	// 	});

	// 	this.aSkybox = new THREE.Mesh(
	// 	  new THREE.BoxGeometry(1000000, 1000000, 1000000),
	// 	  aSkyBoxMaterial
	// 	);
		
	// 	//this.ms_Scene.add(this.aSkybox);
	// },

    display: function display() {
		this.ms_Water.render();
		// this.ms_Renderer.render(/*this.ms_Scene*/ null, this.ms_Camera);
	},
	
	update: function update() {
		this.ms_Water.material.uniforms.time.value += 1.0 / 360.0;
		// this.ms_Controls.update();
		this.display();
	},
	
	resize: function resize(inWidth, inHeight) {
		// this.ms_Camera.aspect =  inWidth / inHeight;
		// this.ms_Camera.updateProjectionMatrix();
		this.ms_Renderer.setSize(inWidth, inHeight);
		// this.ms_Canvas.html(this.ms_Renderer.domElement);
		this.display();
	}
};