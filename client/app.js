'use strict';

import 'aframe';
import 'aframe-animation-component';
import './external/gradientsky.min';
import './render/components';
import './render/water';
import { ParticleEngine } from './render/particleSystem';
import Utils from './render/utils';



// createScene();
createBoat(); // we create our lantern here too because it is tied with the boat
createSkyBox();
createWater();
createStars();
// createCursor();
// createOtherLanterns(); // this is old lanterns creation implementation
createLanterns();  // this is the particle system lantern implementation


function createScene(){
  const scene = document.createElement('a-scene');
  document.getElementById('ascene').appendChild(scene);
}

function createBoat(){
  const boatAndLantern = document.createElement('a-entity');
  const boat = document.createElement('a-entity');
  boatAndLantern.appendChild(boat);

  boat.setAttribute('boat', {});

  boat.setAttribute('position', {
    x: '0',
    y: '.25',
    z: '0',
  });

   boat.setAttribute('rotation', {
    x: '0',
    y: '90',
    z: '0',
  });

  boat.setAttribute('scale', {
    x: '0.6',
    y: '0.5',
    z: '0.5',
  });

  boat.setAttribute('animation', {
    property: 'rotation',
    dir: 'alternate',
    dur: 2000,
    easing: 'easeInSine',
    loop: true,
    from: '-3 90 0',
    to: '3 90 0',
  });

  createOwnLantern(boatAndLantern);

  const scene = document.querySelector('a-scene');
  scene.appendChild(boatAndLantern);
}

function createOwnLantern(ownParentObject) {
  const ownObj = document.createElement('a-entity');
  const color = Utils.getRandColor();

  ownObj.setAttribute('lantern',{
    light: color.light,
    dark: color.dark
  });

  ownObj.setAttribute('position', '0 .5 -1');

  ownObj.setAttribute('rotation', {
      x: 0,
      y: Math.random() * 90,
      z: 0,
  });

  ownObj.setAttribute('light', {
    color: color.light,
    type: 'point',
    intensity: 1,
    distance: 20,
    decay: 1,
  });

  ownObj.setAttribute('glow', {});

  ownObj.setAttribute('cursor-listener', {});

  // probably need event listener like for camera
  // http://stackoverflow.com/questions/41419014/how-to-access-the-default-camera-from-a-component
  setTimeout(() => {
    ownObj.setAttribute('animation', {
      property: 'position',
      dir: 'alternate',
      dur: 3000,
      easing: 'easeInSine',
      loop: true,
      to: `0 ${ownObj.getAttribute('position').y + .1} ${ownObj.getAttribute('position').z}`,
    });

    ownObj.setAttribute('animation__2', {
        property: 'rotation',
        dur: 12000,
        easing: 'linear',
        loop: true,
        to: `0 ${ownObj.getAttribute('rotation').y + 360} 0`,
    });
  }, 0);

  ownParentObject.appendChild(ownObj);
}

function createSkyBox(){
  const sky = document.createElement('a-gradient-sky');

  sky.setAttribute('material', {
      shader: 'gradient',
      bottomColor: '23 15 89', // old color -- more purpish
      // bottomColor: '11 4 25', // new color -- more black
      topColor: '11 4 25',
  });

  const scene = document.querySelector('a-scene');
  scene.appendChild(sky);
}

function createWater(){
  const water = document.createElement('a-entity');

  water.setAttribute('water', {});

  const scene = document.querySelector('a-scene');
  scene.appendChild(water);

}

function createStars() {
  const obj = document.createElement('a-entity');

  obj.setAttribute('stars',{});

  const scene = document.querySelector('a-scene');
  scene.appendChild(obj);
}

function createCursor() {
  document.querySelector('a-scene').addEventListener('camera-set-active', function (evt) {
      const camera = evt.detail.cameraEl;
      //obj.position.set(0, -.5, 2); // doesn't work as expected
      const obj = document.createElement('a-entity');

      obj.setAttribute('cursor', {fuse: true, fuseTimeout: 5000});

      // reposition camera
      obj.setAttribute('position', {x: 0, y: 0, z: -1});

      obj.setAttribute('geometry', {
        primitive: 'ring',
        radiusInner: 0.015,
        radiusOuter: 0.02,
      });

      obj.setAttribute('material', {color: 'white', shader: 'flat'});

      // create a-animation element for click
      // const anim = document.createElement('a-animation');

      // anim.setAttribute("begin", "click");
      // anim.setAttribute("easing", "ease-in");
      // anim.setAttribute("attribute", "scale");
      // anim.setAttribute("dur", "1000");
      // anim.setAttribute("fill", "backwards");
      // anim.setAttribute("from", "0.1 0.1 0.1");
      // anim.setAttribute("to", "1 1 1");

      // obj.appendChild(anim);

      // another for fusing
      // currently it's applying even when looking at the boat or water too, get rid of that
      const anim2 = document.createElement('a-animation');

      anim2.setAttribute("begin", "cursor-fusing");
      anim2.setAttribute("easing", "ease-in");
      anim2.setAttribute("attribute", "scale");
      anim2.setAttribute("dur", "5000");
      anim2.setAttribute("fill", "forwards");
      anim2.setAttribute("from", "1 1 1");
      anim2.setAttribute("to", "0.1 0.1 0.1");

      obj.appendChild(anim2);

      camera.appendChild(obj);
  });
}

function createOtherLanterns() {

  const scene = document.querySelector('a-scene');

  const parentObj = document.createElement('a-entity');

  for (let i = 0; i < 200; i++) {
    const obj = document.createElement('a-entity');
    const color = Utils.getRandColor();

    obj.setAttribute('lantern',{
      light: color.light,
      dark: color.dark
    });

    if (i < 50) {
      obj.setAttribute('position', {
        x: Utils.getRandCoord(3),
        y: Utils.getRandCoord(2, 1),
        z: Utils.getRandCoord(3),
      });
    } else if (i < 150) {
      obj.setAttribute('position', {
        x: Utils.getRandCoord(6),
        y: Utils.getRandCoord(4, 1),
        z: Utils.getRandCoord(6),
      });
    } else if (i < 180) {
      obj.setAttribute('position', {
        x: Utils.getRandCoord(20),
        y: Utils.getRandCoord(15, 1),
        z: Utils.getRandCoord(20),
      });
    } else {
      obj.setAttribute('position', {
        x: Utils.getRandCoord(50),
        y: Utils.getRandCoord(30, 1),
        z: Utils.getRandCoord(50),
      });
    }

    obj.setAttribute('rotation', {
      x: 0,
      y: Math.random() * 90,
      z: 0,
    });

    obj.setAttribute('glow', {});

    // all lanterns fly in and converge
    obj.setAttribute('animation', {
      property: 'position',
      dir: 'alternate',
      dur: 8000,
      easing: 'easeInSine',
      loop: true,
      to: "0 3 -5",
    });

    parentObj.appendChild(obj);
  }

  scene.appendChild(parentObj);
}

function createLanterns() {
  let engine = new ParticleEngine();
  engine.initialize();
}
