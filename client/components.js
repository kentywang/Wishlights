AFRAME.registerComponent('water', {
  init: function () {  
    const entity = this.el;

    document.querySelector('a-scene').addEventListener('camera-set-active', function () {
      const renderer = document.querySelector('a-scene').renderer;
      const camera = document.querySelector('a-scene').camera;
      const scene = document.querySelector('a-scene').object3D;


      DEMO.initialize(renderer, camera, scene);

      entity.setObject3D('meshMirror', DEMO.aMeshMirror);
    });
  },

  tick: function () {
    DEMO.update();
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
      map: new THREE.ImageUtils.loadTexture('./img/glow.png'), 
      useScreenCoordinates: false, 
      color: 0xffae0c,//entity.getAttribute('material').color,
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
  init: function () {  
    const entity = this.el;

    // const mesh = makeGradientCube(0xffae0c, 0xFF4500, .2,.2,.4, 1);
    const mesh = makeGradientCylinder(0xffae0c, 0xFF4500, .1,.3, 1);


    //mesh.position.set(0, 1, -3);

    entity.setObject3D('lant', mesh);
  }
});
