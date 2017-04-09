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
			distortionScale: 15,
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

function makeGradientCube(c1, c2, w, d, h, opacity){
	if(typeof opacity === 'undefined')opacity = 1.0;
	if(typeof c1 === 'number') var lighter = new THREE.Color( c1 );
	if(typeof c2 === 'number') var darker = new THREE.Color( c2 );

	var cubeGeometry = new THREE.BoxGeometry(w, h, d);

	var cubeMaterial = new THREE.MeshBasicMaterial({
	    vertexColors:THREE.VertexColors
	    });

	if(opacity < 1.0){
	    cubeMaterial.opacity = opacity;
	    cubeMaterial.transparent = true;
	    }

	const x = parseInt(colorLuminance('#'+c1.toString(16), 1));
	const y = parseInt(colorLuminance('#'+c2.toString(16), .5));

	const c1b = new THREE.Color(x);

	const c2t = new THREE.Color(y);

	for(var ix=0;ix<12;++ix){
	    if(ix==4 || ix==5){ //Top edge, all c2
	        cubeGeometry.faces[ix].vertexColors = [c2t,c2t,c2t];
	        }
	    else if(ix==6 || ix==7){ //Bottom edge, all c1
	        cubeGeometry.faces[ix].vertexColors = [c1b,c1b,c1b];
	        }
	    else if(ix%2 ==0){ //First triangle on each side edge
	        cubeGeometry.faces[ix].vertexColors = [darker,lighter,darker];
	        }
	    else{ //Second triangle on each side edge
	        cubeGeometry.faces[ix].vertexColors = [lighter,lighter,darker];
	        }
	    }

	return new THREE.Mesh(cubeGeometry, cubeMaterial);
}

function makeGradientCylinder(c1, c2, w, h, opacity){
	if(typeof opacity === 'undefined')opacity = 1.0;
	if(typeof c1 === 'number') var lighter = new THREE.Color( c1 );
	if(typeof c2 === 'number') var darker = new THREE.Color( c2 );

	var cubeGeometry = new THREE.CylinderGeometry(w, w, h, 16, 1);

	var cubeMaterial = new THREE.MeshBasicMaterial({
	    vertexColors:THREE.VertexColors
	    });

	if(opacity < 1.0){
	    cubeMaterial.opacity = opacity;
	    cubeMaterial.transparent = true;
	}
	
	const x = parseInt(colorLuminance('#'+c1.toString(16), .5));
	const y = parseInt(colorLuminance('#'+c2.toString(16), .5));

	const c1b = new THREE.Color(x);
	const c2t = new THREE.Color(y);


	for(var ix=0;ix<64;++ix){
	    if (ix >= 32 && ix < 48) {
	    	cubeGeometry.faces[ix].vertexColors = [darker,darker,c2t];
	    }
	    else if (ix >= 48) {
	    	cubeGeometry.faces[ix].vertexColors = [c1b,c1b,new THREE.Color(0xffffff)];
	    }
	    else if(ix%2 ==0){
	        cubeGeometry.faces[ix].vertexColors = [darker,lighter,darker];
	        }
	    else{
	        cubeGeometry.faces[ix].vertexColors = [lighter,lighter,darker];
	        }
	    }

	return new THREE.Mesh(cubeGeometry, cubeMaterial);
}

function colorLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if(hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    
    // convert to decimal and change luminosity
    var rgb = '0x', c, i;
    for(i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ('00' + c).substr(c.length);
    }
    //console.log(rgb);
    return rgb;
}