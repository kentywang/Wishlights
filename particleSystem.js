// WORK IN PROGRESS
// todo: add back in all sphere properties for fireworks system

const particleDeathAge = 12;

const system = {
	// SPECS for FIREFLY
	// positionStyle  : 'cube',
	// positionBase   : new THREE.Vector3( 0, 100, 0 ),
	// positionSpread : new THREE.Vector3( 400, 200, 400 ),

	// velocityStyle  : 'cube',
	// velocityBase   : new THREE.Vector3( 0, 0, 0 ),
	// velocitySpread : new THREE.Vector3( 60, 20, 60 ),

	// particlesPerSecond : 20,
	// particleDeathAge   : 6.1,
	// emitterDeathAge    : 600,

	// SPECS for FIREWORKS
	// positionStyle  : 'sphere',
	// positionBase   : new THREE.Vector3( 0, 1, 0 ),
	// positionRadius : 10,

	// velocityStyle  : 'sphere',
	// speedBase      : 90,
	// speedSpread    : 10,

	// accelerationBase : new THREE.Vector3( 0, -80, 0 ),

	// particlesPerSecond : 3000,
	// particleDeathAge   : 2.5,
	// emitterDeathAge    : 0.2

};

class ParticleEngine {
	constructor()
	{
		/////////////////////////
		// PARTICLE PROPERTIES //
		/////////////////////////

		this.positionStyle = 'cube';
		this.positionBase   = new THREE.Vector3( 0, 5, 0 ); // 0 10 0
		// cube shape data
		this.positionSpread = new THREE.Vector3( 20, 15, 20 ); // 40 30 40
		// sphere shape data
		this.positionRadius = 0; // distance from base at which particles start

		this.velocityStyle = 'cube';
		// cube movement data
		this.velocityBase       = new THREE.Vector3( 0, 0, 0 );
		this.velocitySpread     = new THREE.Vector3( 3, 1, 3 );
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

		this.particleArray = [];
		this.particlesPerSecond = 10; // 40 or 100
		this.particleDeathAge = particleDeathAge;

		////////////////////////
		// EMITTER PROPERTIES //
		////////////////////////

		this.emitterAge      = 0.0;
		this.emitterAlive    = true;
		this.emitterDeathAge = 1000; // time (seconds) at which to stop creating particles.

		// How many particles could be active at any time?
		this.particleCount = this.particlesPerSecond * Math.min( this.particleDeathAge, this.emitterDeathAge );


		// Kenty's addition
		this.particleMesh = document.createElement('a-entity');
		this.particleMesh.setAttribute('lantern-system', { system }); // swappable particle systems not yet implemented
		this.particleMesh.parent = this;
		document.querySelector('a-scene').appendChild( this.particleMesh );
	}

	initialize()
	{
		// link particle data with geometry/material data
		for (var i = 0; i < this.particleCount; i++)
		{
			this.particleArray[i] = this.createParticle();
		}

	}

	createParticle()
	{
		var particle = new Particle(this.particleMesh);

		if (this.positionStyle == 'cube'){
			let obj= this.random3vals( this.positionBase, this.positionSpread );
			particle.lantern.setAttribute('position', {x: obj.x, y: obj.y, z: obj.z});
		}

		if (this.positionStyle == 'sphere') {
			let z = 2 * Math.random() - 1;
			let t = 6.2832 * Math.random();
			let r = Math.sqrt( 1 - z*z );
			let vec3 = new THREE.Vector3( r * Math.cos(t), r * Math.sin(t), z );
			let obj = new THREE.Vector3().addVectors( this.positionBase, vec3.multiplyScalar( this.positionRadius ) );
			particle.lantern.setAttribute('position', {x: obj.x, y: obj.y, z: obj.z});
		}

		if ( this.velocityStyle == 'cube' )
		{
			particle.velocity     = this.randomVector3( this.velocityBase,     this.velocitySpread );
		}

		if ( this.velocityStyle == 'sphere' )
		{
			let direction = new THREE.Vector3().subVectors( particle.position, this.positionBase );
			let speed     = this.randomValue( this.speedBase, this.speedSpread );
			particle.velocity  = direction.normalize().multiplyScalar( speed );
		}

		particle.acceleration = this.randomVector3( this.accelerationBase, this.accelerationSpread );

		particle.angle = this.randomValue(this.angleBase, this.angleSpread);
		particle.angleVelocity = this.randomValue( this.angleVelocityBase,this.angleVelocitySpread );
		particle.angleAcceleration = this.randomValue(this.angleAccelerationBase, this.angleAccelerationSpread );

		particle.age   = 0;
		particle.alive = 0;// particles initialize as inactive

		return particle;
	}

	randomValue(base, spread)
	{
		return base + spread * (Math.random() - 0.5);
	}

	randomVector3(base, spread)
	{
		var rand3 = new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
		return new THREE.Vector3().addVectors( base, new THREE.Vector3().multiplyVectors( spread, rand3 ) );
	}

	random3vals(base, spread)
	{
		var rand3 = new THREE.Vector3( Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5 );
		var vec3 = new THREE.Vector3().addVectors( base, new THREE.Vector3().multiplyVectors( spread, rand3 ) );
		return {x: vec3.x, y: vec3.y, z: vec3.z}
	}

	update(dt)
	{
		dt /= 1000;
		var recycleIndices = [];

		// update particle data
		for (var i = 0; i < this.particleCount; i++)
		{
			if ( this.particleArray[i].alive > 0.0 )
			{
				this.particleArray[i].update(dt);

				// check if particle should expire
				// could also use: death by size<0 or alpha<0.
				if ( this.particleArray[i].age > this.particleDeathAge )
				{
					this.particleArray[i].alive = 0.0;
					recycleIndices.push(i);
				}
			}
		}

		// check if particle emitter is still running
		if ( !this.emitterAlive ) return;

		// if no particles have died yet, then there are still particles to activate
		if ( this.emitterAge < this.particleDeathAge )
		{
			// determine indices of particles to activate
			var startIndex = Math.round( this.particlesPerSecond * (this.emitterAge +  0) );
			var   endIndex = Math.round( this.particlesPerSecond * (this.emitterAge + dt) );
			if  ( endIndex > this.particleCount )
				  endIndex = this.particleCount;

			for (var i = startIndex; i < endIndex; i++)
				this.particleArray[i].alive = 1.0;
		}

		// if any particles have died while the emitter is still running, we imediately recycle them
		for (var j = 0; j < recycleIndices.length; j++)
		{
			var i = recycleIndices[j];

			this.cleanupParticle(this.particleArray[i])

			this.particleArray[i] = this.createParticle();
			this.particleArray[i].alive = 1.0; // activate right away
			// this.particleGeometry.vertices[i] = this.particleArray[i].position;
		}

		// stop emitter?
		this.emitterAge += dt;
		if ( this.emitterAge > this.emitterDeathAge )  this.emitterAlive = false;
	}

	cleanupParticle(particle) {
		this.particleMesh.removeChild(particle.lantern);
	}
}

class Particle {
	constructor(particleMesh)
	{
		this.lantern = this.createLantern(particleMesh, this);

		this.position     = new THREE.Vector3();
		this.velocity     = new THREE.Vector3(); // units per second
		this.acceleration = new THREE.Vector3();

		this.angle             = 0;
		this.angleVelocity     = 0; // degrees per second
		this.angleAcceleration = 0; // degrees per second, per second

		this.age   = 0;
		this.alive = 0; // use float instead of boolean for shader purposes
		this.particleDeathAge = particleDeathAge;
	}

	update(dt)
	{
		let additionalVelo = this.velocity.clone().multiplyScalar(dt);
		let origPost = this.lantern.getAttribute('position');
		if (origPost) {
			this.lantern.setAttribute('position',
				{
					x: origPost.x + additionalVelo.x,
					y: origPost.y + additionalVelo.y,
					z: origPost.z + additionalVelo.z,
				}
			);
		}

		this.velocity.add( this.acceleration.clone().multiplyScalar(dt) );

		// convert from degrees to radians: 0.01745329251 = Math.PI/180
		this.angle         += this.angleVelocity     * 0.01745329251 * dt;
		this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt;

		this.age += dt;

	}

	createLantern(parentObject, holder) {
	  const obj = document.createElement('a-entity');
	  const color = Utils.getRandColor();

	  obj.setAttribute('lantern',{
	    light: color.light,
	    dark: color.dark,
	    holder
	  });

	  obj.setAttribute('position', {
	    x: 0,
	    y: 0,
	    z: 0,
	  });

	  obj.setAttribute('rotation', {
	    x: 0,
	    y: Math.random() * 90,
	    z: 0,
	  });

	  obj.setAttribute('glow', {});


	  obj.setAttribute('animation', {
      property: 'rotation',
	    dir: 'alternate',
	    dur: 2000 + Math.random() * 1000,
	    easing: 'easeInSine',
	    loop: true,
	    from: '-6 0 0',
	    to: '6 0 0',
    });

	  // probably need event listener like for camera
  	// http://stackoverflow.com/questions/41419014/how-to-access-the-default-camera-from-a-component
	  setTimeout(() => {
		  if (obj.getAttribute('rotation')) {
			obj.setAttribute('animation__2', {
			  property: 'rotation',
			  dur: 12000 + Math.random() * 8000,
			  easing: 'linear',
			  loop: true,
			  to: `0 ${obj.getAttribute('rotation').y + 360 * Utils.randomSign()} 0`,
			});
		  }
	  }, 0);

	  parentObject.appendChild(obj);

	  return obj;
	}
}
