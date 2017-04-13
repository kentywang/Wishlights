// WORK IN PROGRESS
import Utils from './utils';

	const system = {
		positionStyle  : 'cube',
		positionBase   : new THREE.Vector3( 0, 100, 0 ),
		positionSpread : new THREE.Vector3( 400, 200, 400 ),

		velocityStyle  : 'cube',
		velocityBase   : new THREE.Vector3( 0, 0, 0 ),
		velocitySpread : new THREE.Vector3( 60, 20, 60 ), 

		particlesPerSecond : 20,
		particleDeathAge   : 6.1,		
		emitterDeathAge    : 600,
	};
export class ParticleEngine {
	constructor()
	{
		/////////////////////////
		// PARTICLE PROPERTIES //
		/////////////////////////
		
		this.positionStyle = 'cube';
		this.positionBase   = new THREE.Vector3( 0, 1, 0 );//new THREE.Vector3();
		// cube shape data
		this.positionSpread = new THREE.Vector3( 10, 3, 10);//new THREE.Vector3();
		// sphere shape data
		this.positionRadius = 0; // distance from base at which particles start
		
		this.velocityStyle = 'cube';	
		// cube movement data
		this.velocityBase       = new THREE.Vector3( 0, 0, 0 );//new THREE.Vector3();
		this.velocitySpread     = new THREE.Vector3( 3, 1, 3 );//new THREE.Vector3(); 
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
		this.particlesPerSecond = 5; // 100
		this.particleDeathAge = 6.1;
		
		////////////////////////
		// EMITTER PROPERTIES //
		////////////////////////
		
		this.emitterAge      = 0.0;
		this.emitterAlive    = true;
		this.emitterDeathAge = 60; // time (seconds) at which to stop creating particles.
		
		// How many particles could be active at any time?
		this.particleCount = this.particlesPerSecond * Math.min( this.particleDeathAge, this.emitterDeathAge );


		// Kenty's addition
		this.particleMesh = document.createElement('a-entity');
		this.particleMesh.setAttribute('particle-system', { system });
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
					//console.log(particle.lantern.object3D);
			let obj= this.random3vals( this.positionBase, this.positionSpread );
			//console.log(obj);
			particle.lantern.setAttribute('position', {x: obj.x, y: obj.y, z: obj.z}); 
			// particle.lantern.object3D.position.x = 0//obj.x;
			// particle.lantern.object3D.position.y = 1//obj.y;
			// particle.lantern.object3D.position.z = -1//obj.z;
		}
			
		if ( this.velocityStyle == 'cube' )
		{
			particle.velocity     = this.randomVector3( this.velocityBase,     this.velocitySpread ); 
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
		//console.log(this.particleCount)
		var recycleIndices = [];
		
		// update particle data
		for (var i = 0; i < this.particleCount; i++)
		{
			if ( this.particleArray[i].alive )
			{
				this.particleArray[i].update(dt);

				// check if particle should expire
				// could also use: death by size<0 or alpha<0.
				if ( this.particleArray[i].age > this.particleDeathAge ) 
				{
					// console.log('died');
					this.particleMesh.removeChild(this.particleArray[i].lantern);
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
			this.particleArray[i] = this.createParticle();
			this.particleArray[i].alive = 1.0; // activate right away
			// this.particleGeometry.vertices[i] = this.particleArray[i].position;
		}

		// stop emitter?
		this.emitterAge += dt;
		if ( this.emitterAge > this.emitterDeathAge )  this.emitterAlive = false;
	}

}
export class Particle {
	constructor(parObj)
	{
		this.lantern = this.createLantern(parObj);

		this.position     = new THREE.Vector3();
		this.velocity     = new THREE.Vector3(); // units per second
		this.acceleration = new THREE.Vector3();

		this.angle             = 0;
		this.angleVelocity     = 0; // degrees per second
		this.angleAcceleration = 0; // degrees per second, per second
				
		this.age   = 0;
		this.alive = 0; // use float instead of boolean for shader purposes	
	}

	update(dt)
	{

		// console.log('lantern',dt)

		let additionalVelo = this.velocity.clone().multiplyScalar(dt);
		let origPost = this.lantern.getAttribute('position');

		this.lantern.setAttribute('position',
			{
				x: origPost.x + additionalVelo.x,
				y: origPost.y + additionalVelo.y,
				z: origPost.z + additionalVelo.z,
			}
		);

		this.velocity.add( this.acceleration.clone().multiplyScalar(dt) );
		
		// convert from degrees to radians: 0.01745329251 = Math.PI/180
		this.angle         += this.angleVelocity     * 0.01745329251 * dt;
		this.angleVelocity += this.angleAcceleration * 0.01745329251 * dt;

		this.age += dt;

	}


	createLantern(parentObject) {
	  const obj = document.createElement('a-entity');
	  const color = Utils.getRandColor();

	  obj.setAttribute('lantern',{
	    light: color.light,
	    dark: color.dark
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

	  // setTimeout(() => {
	  //   // obj.setAttribute('animation', {
	  //   //   property: 'position',
	  //   //   dir: 'alternate',
	  //   //   dur: 10000,
	  //   //   easing: 'easeInSine',
	  //   //   loop: true,
	  //   //   to: `${obj.getAttribute('position').x + 10} ${obj.getAttribute('position').y - 3} ${obj.getAttribute('position').z + 10}`,
	  //   // });

	  //   obj.setAttribute('animation__2', {
	  //     property: 'rotation',
	  //     dur: 10000 + Math.random() * 8000,
	  //     easing: 'linear',
	  //     loop: true,
	  //     to: `0 ${obj.getAttribute('rotation').y + 360 * randomSign()} 0`,
	  //   });
	  // }, 2000);

	  parentObject.appendChild(obj);

	  return obj;
	}
}