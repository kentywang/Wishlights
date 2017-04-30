import Utils from './utils';
import water from './water';

AFRAME.registerComponent('water', {
  init: function () {  
    const entity = this.el;

    document.querySelector('a-scene').addEventListener('camera-set-active', function () {
      const renderer = document.querySelector('a-scene').renderer;
      const camera = document.querySelector('a-scene').camera;
      const scene = document.querySelector('a-scene').object3D;


      water.initialize(renderer, camera, scene);

      entity.setObject3D('meshMirror', water.aMeshMirror);
    });
  },

  tick: function () {
    water.update();
  }
});

AFRAME.registerComponent('boat', {
  init: function () {  
    const entity = this.el;
    let mesh = null;
    const material = new THREE.MeshPhongMaterial({
      color: '#423028',
      shading:THREE.FlatShading,
    });
    const loader = new THREE.JSONLoader();

    loader.load('./img/boat.json', function(geometry) {
      mesh = new THREE.Mesh(geometry, material);

      entity.setObject3D('boaty', mesh);
    });
  }
});
 
AFRAME.registerComponent('glow', {
  init: function () {  
    const entity = this.el;

    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: new THREE.TextureLoader().load('./img/glow.png'), 
      color: entity.getAttribute('lantern').light,
      transparent: false,
      blending: THREE.AdditiveBlending,
    });
    const sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(1.2, 1.2, 1.2);
    sprite.position.set(0, -.1, 0);

    entity.setObject3D('glowy', sprite);
  }
});
 
AFRAME.registerComponent('lantern', {
  schema: {
    light: {type: 'number'},
    dark: {type: 'number'},
    holder: {type: 'string'}
  },

  init: function () {  
    const data = this.data;
    const entity = this.el;

    const height = Math.random() / 10 + .32;
    const width = Math.random() / 10 + .15;

    const mesh = Math.random() > .5 ? 
      Utils.makeGradientCube(data.light, data.dark, width,width,height, .95) :
      Utils.makeGradientCylinder(data.light, data.dark, width/2,height/1.3, .95);

    entity.setObject3D('lant', mesh);
  },


  tick: function () {
    // for fading in and out
    if (this.data.holder) {
      this.el.object3D.children[0].material.opacity = Utils.expoInOut(this.data.holder.age / this.data.holder.particleDeathAge);

      if (this.el.object3D.children[1].material) {

        this.el.object3D.children[1].material.opacity = Utils.expoInOut(this.data.holder.age / this.data.holder.particleDeathAge);
      }
    }
  }
});

AFRAME.registerComponent('lantern-system', {
  schema: {
    system: {type: 'string'},
  },

  init: function () {  
    const entity = this.el;
    const data = this.data;
    
  },

  tick: function (time, timeDelta) {
    this.el.parent.update(timeDelta);
  },
});

AFRAME.registerComponent('stars', {
  init: function () {
    const particleCount = 500,
    particles = new THREE.Geometry(),
    pMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1
    });

    for (let p = 0; p < particleCount; p++) {
      const pX = Math.random() * 1000 - 500,
          pY = Math.random() * 500,
          pZ = Math.random() * 1000 - 500,
          particle = new THREE.Vector3(pX, pY, pZ)
          particle.normalize().multiplyScalar(Math.random() * 1000 + 600)
      // add it to the geometry
      particles.vertices.push(particle);
    }

    // create the particle system
    const particleSystem = new THREE.Points(
        particles,
        pMaterial);

    this.el.setObject3D('stars', particleSystem);
  }
});

AFRAME.registerComponent('cursor-listener', {
  init: function () {
    // var COLORS = ['red', 'green', 'blue'];
    this.el.addEventListener('click', function (evt) {
      // var randomIndex = Math.floor(Math.random() * COLORS.length);
      // this.setAttribute('material', 'color', COLORS[randomIndex]);
      console.log('I was clicked at: ', evt.detail.intersection.point);
    });
  }
});