const system = {
	positionStyle  : 'cube',
	positionBase   : new THREE.Vector3( 0, 100, 0 ),
	positionSpread : new THREE.Vector3( 400, 200, 400 ),

	velocityStyle  : 'cube',
	velocityBase   : new THREE.Vector3( 0, 0, 0 ),
	velocitySpread : new THREE.Vector3( 60, 20, 60 ), 
	
	particleTexture : THREE.ImageUtils.loadTexture( 'images/spark.png' ),

	// sizeBase   : 30.0,
	// sizeSpread : 2.0,
	// opacityTween : new Tween([0.0, 1.0, 1.1, 2.0, 2.1, 3.0, 3.1, 4.0, 4.1, 5.0, 5.1, 6.0, 6.1],
	//                          [0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2] ),				
	// colorBase   : new THREE.Vector3(0.30, 1.0, 0.6), // H,S,L
	// colorSpread : new THREE.Vector3(0.3, 0.0, 0.0),

	particlesPerSecond : 20,
	particleDeathAge   : 6.1,		
	emitterDeathAge    : 600,
};

function ParticleEngine()
{
	/////////////////////////
	// PARTICLE PROPERTIES //
	/////////////////////////
	
	this.positionStyle = 'cube';
	this.positionBase   = new THREE.Vector3();
	// cube shape data
	this.positionSpread = new THREE.Vector3();
	// sphere shape data
	this.positionRadius = 0; // distance from base at which particles start
	
	this.velocityStyle = 'cube';	
	// cube movement data
	this.velocityBase       = new THREE.Vector3();
	this.velocitySpread     = new THREE.Vector3(); 
	// sphere movement data
	//   direction vector calculated using initial position
	this.speedBase   = 0;
	this.speedSpread = 0;
	
	this.accelerationBase   = new THREE.Vector3();
	this.accelerationSpread = new THREE.Vector3();	
	
	this.angleBase               = 0;
	this.angleSpread             = 0;
	this.angleVelocityBase       = 0;
	this.angleVelocitySpread     = 0;
	this.angleAccelerationBase   = 0;
	this.angleAccelerationSpread = 0;
	
	// this.sizeBase   = 0.0;
	// this.sizeSpread = 0.0;
	/////////////this.sizeTween  = new Tween();
			
	// store colors in HSL format in a THREE.Vector3 object
	// http://en.wikipedia.org/wiki/HSL_and_HSV
	// this.colorBase   = new THREE.Vector3(0.0, 1.0, 0.5); 
	// this.colorSpread = new THREE.Vector3(0.0, 0.0, 0.0);
	// this.colorTween  = new Tween();
	
	// this.opacityBase   = 1.0;
	// this.opacitySpread = 0.0;
	// this.opacityTween  = new Tween();

	// this.blendStyle = THREE.NormalBlending; // false;

	this.particleArray = [];
	this.particlesPerSecond = 100;
	this.particleDeathAge = 1.0;
	
	////////////////////////
	// EMITTER PROPERTIES //
	////////////////////////
	
	this.emitterAge      = 0.0;
	this.emitterAlive    = true;
	this.emitterDeathAge = 60; // time (seconds) at which to stop creating particles.
	
	// How many particles could be active at any time?
	this.particleCount = this.particlesPerSecond * Math.min( this.particleDeathAge, this.emitterDeathAge );

	//////////////
	// THREE.JS //
	//////////////
	
	this.particleGeometry = new THREE.Geometry();
	this.particleTexture  = null;
	this.particleMaterial = new THREE.ShaderMaterial( 
	{
		uniforms: 
		{
			texture:   { type: "t", value: this.particleTexture },
		},
		attributes:     
		{
			customVisible:	{ type: 'f',  value: [] },
			customAngle:	{ type: 'f',  value: [] },
			customSize:		{ type: 'f',  value: [] },
			customColor:	{ type: 'c',  value: [] },
			customOpacity:	{ type: 'f',  value: [] }
		},
		vertexShader:   particleVertexShader,
		fragmentShader: particleFragmentShader,
		transparent: true, // alphaTest: 0.5,  // if having transparency issues, try including: alphaTest: 0.5, 
		blending: THREE.NormalBlending, depthTest: true,
		
	});
	//this.particleMesh = new THREE.Mesh();

	// Kenty's addition
	this.particleMesh = document.createElement('a-entity');
}

ParticleEngine.prototype.initialize = function()
{
	// link particle data with geometry/material data
	for (var i = 0; i < this.particleCount; i++)
	{
		// remove duplicate code somehow, here and in update function below.
		this.particleArray[i] = this.createParticle();
		this.particleGeometry.vertices[i] = this.particleArray[i].position;
		this.particleMaterial.attributes.customVisible.value[i] = this.particleArray[i].alive;
		this.particleMaterial.attributes.customColor.value[i]   = this.particleArray[i].color;
		this.particleMaterial.attributes.customOpacity.value[i] = this.particleArray[i].opacity;
		this.particleMaterial.attributes.customSize.value[i]    = this.particleArray[i].size;
		this.particleMaterial.attributes.customAngle.value[i]   = this.particleArray[i].angle;
	}
	
	this.particleMaterial.blending = this.blendStyle;
	if ( this.blendStyle != THREE.NormalBlending) 
		this.particleMaterial.depthTest = false;
	
	this.particleMesh = new THREE.ParticleSystem( this.particleGeometry, this.particleMaterial );
	this.particleMesh.dynamic = true;
	this.particleMesh.sortParticles = true;
	document.querySelector('a-scene').add( this.particleMesh );
}

ParticleEngine.prototype.createParticle = function()
{
	var particle = new Particle(this.obj);

	if (this.positionStyle == 'cube')
		particle.lantern.object3D.position = this.randomVector3( this.positionBase, this.positionSpread ); 
		// particle.lantern.setAttribute('position', {
		// 	this.randomVector3( this.positionBase, this.positionSpread ); 
		// });

	// if (this.positionStyle == Type.SPHERE)
	// {
	// 	var z = 2 * Math.random() - 1;
	// 	var t = 6.2832 * Math.random();
	// 	var r = Math.sqrt( 1 - z*z );
	// 	var vec3 = new THREE.Vector3( r * Math.cos(t), r * Math.sin(t), z );
	// 	particle.position = new THREE.Vector3().addVectors( this.positionBase, vec3.multiplyScalar( this.positionRadius ) );
	// }
		
	if ( this.velocityStyle == 'cube' )
	{
		particle.velocity     = this.randomVector3( this.velocityBase,     this.velocitySpread ); 
	}
	// if ( this.velocityStyle == Type.SPHERE )
	// {
	// 	var direction = new THREE.Vector3().subVectors( particle.position, this.positionBase );
	// 	var speed     = this.randomValue( this.speedBase, this.speedSpread );
	// 	particle.velocity  = direction.normalize().multiplyScalar( speed );
	// }
	
	particle.acceleration = this.randomVector3( this.accelerationBase, this.accelerationSpread ); 

	particle.angle = this.randomValue(this.angleBase, this.angleSpread);
	particle.angleVelocity = this.randomValue( this.angleVelocityBase,this.angleVelocitySpread );
	particle.angleAcceleration = this.randomValue(this.angleAccelerationBase, this.angleAccelerationSpread );

	// particle.size = this.randomValue( this.sizeBase, this.sizeSpread );

	// var color = this.randomVector3( this.colorBase, this.colorSpread );
	// particle.color = new THREE.Color().setHSL( color.x, color.y, color.z );
	
	// particle.opacity = this.randomValue( this.opacityBase, this.opacitySpread );

	particle.age   = 0;
	particle.alive = 0; // particles initialize as inactive
	
	return particle;
}

ParticleEngine.prototype.randomVector3 = function(base, spread)
{
	var rand3 = new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
	return new THREE.Vector3().addVectors( base, new THREE.Vector3().multiplyVectors( spread, rand3 ) );
}

Particle.prototype.update = function(dt)
{
	this.position.add( this.velocity.clone().multiplyScalar(dt) );
	this.velocity.add( this.acceleration.clone().multiplyScalar(dt) );
	
	// convert from degrees to radians: 0.01745329251 = Math.PI/180
	this.angle         += this.angleVelocity     * 0.01745329251 * dt;
	this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt;

	this.age += dt;
	
	// if the tween for a given attribute is nonempty,
	//  then use it to update the attribute's value

	if ( this.sizeTween.times.length > 0 )
		this.size = this.sizeTween.lerp( this.age );
				
	if ( this.colorTween.times.length > 0 )
	{
		var colorHSL = this.colorTween.lerp( this.age );
		this.color = new THREE.Color().setHSL( colorHSL.x, colorHSL.y, colorHSL.z );
	}
	
	if ( this.opacityTween.times.length > 0 )
		this.opacity = this.opacityTween.lerp( this.age );
}


function Particle(parObj)
{
	this.lantern = createLantern(parObj);

	this.position     = new THREE.Vector3();
	this.velocity     = new THREE.Vector3(); // units per second
	this.acceleration = new THREE.Vector3();

	this.angle             = 0;
	this.angleVelocity     = 0; // degrees per second
	this.angleAcceleration = 0; // degrees per second, per second
	
	// this.size = 16.0;

	// this.color   = new THREE.Color();
	// this.opacity = 1.0;
			
	this.age   = 0;
	this.alive = 0; // use float instead of boolean for shader purposes	
}

Particle.prototype.update = function(dt)
{
	this.position.add( this.velocity.clone().multiplyScalar(dt) );
	this.velocity.add( this.acceleration.clone().multiplyScalar(dt) );
	
	// convert from degrees to radians: 0.01745329251 = Math.PI/180
	this.angle         += this.angleVelocity     * 0.01745329251 * dt;
	this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt;

	this.age += dt;
	
	// if the tween for a given attribute is nonempty,
	//  then use it to update the attribute's value

	if ( this.sizeTween.times.length > 0 )
		this.size = this.sizeTween.lerp( this.age );
				
	if ( this.colorTween.times.length > 0 )
	{
		var colorHSL = this.colorTween.lerp( this.age );
		this.color = new THREE.Color().setHSL( colorHSL.x, colorHSL.y, colorHSL.z );
	}
	
	if ( this.opacityTween.times.length > 0 )
		this.opacity = this.opacityTween.lerp( this.age );
}
