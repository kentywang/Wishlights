AFRAME.registerComponent('water', {
  init: function () {  
    const el = this.el;

    document.querySelector('a-scene').addEventListener('camera-set-active', function () {
      const renderer = document.querySelector('a-scene').renderer;
      const camera = document.querySelector('a-scene').camera;
      const scene = document.querySelector('a-scene').object3D;


      DEMO.initialize(renderer, camera, scene);

      el.setObject3D('meshMirror', DEMO.aMeshMirror);
    });
  },

  tick: function () {
    DEMO.update();
  }
});

AFRAME.registerComponent('boat', {
  init: function () {  
    const el = this.el;
    let mesh = null;
    const material = new THREE.MeshPhongMaterial({
      color: '#423028',
      shading:THREE.FlatShading,
    });
    const loader = new THREE.JSONLoader();

    loader.load('./img/boat.json', function(geometry) {
      mesh = new THREE.Mesh(geometry, material);

      el.setObject3D('boaty', mesh);
    });
  }
});
 
AFRAME.registerComponent('glow', {
  init: function () {  
    const el = this.el;

    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: new THREE.ImageUtils.loadTexture('./img/glow.png'), 
      useScreenCoordinates: false, 
      color: 0x0000ff,
      transparent: false, 
      blending: THREE.AdditiveBlending,
    });
    const sprite = new THREE.Sprite( spriteMaterial );
    sprite.scale.set(1, 1, 1.0);
    sprite.position.set(0,2,-4)

      el.setObject3D('glowy', sprite);
  }
});
 