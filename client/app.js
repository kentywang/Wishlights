'use strict';

import 'aframe';
import 'aframe-animation-component';
import './external/gradientsky.min';
import './render/components';
import './render/water';
import { ParticleEngine } from './render/particleSystem';
import Utils from './render/utils';

createScene();

createOwnLantern();

createSkyBox();

createWater();

// createOtherLanterns();

createBoat();

createLanterns();

// createParticles(); // not working...

function createParticles() {
  const obj = document.createElement('a-entity');

  obj.setAttribute('particle-system', {preset: 'snow', particleCount: 2000});

  const scene = document.querySelector('a-scene');
  scene.appendChild(obj);
}

function createLanterns() {
  let engine = new ParticleEngine();
  engine.initialize();
}

function createSkyBox(){
  const sky = document.createElement('a-gradient-sky');

  sky.setAttribute('material', {
      shader: 'gradient',
      bottomColor: '17 7 58',
      topColor: '11 4 25',
  });

  const scene = document.querySelector('a-scene');
  scene.appendChild(sky);
}

function createBoat(){
  const boat = document.createElement('a-entity');

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

  const scene = document.querySelector('a-scene');
  scene.appendChild(boat);

}

function createWater(){
  const water = document.createElement('a-entity');

  water.setAttribute('water', {});

  const scene = document.querySelector('a-scene');
  scene.appendChild(water);

}

function createScene(){
  const scene = document.createElement('a-scene');
  document.body.appendChild(scene);
}

// let engine = new ParticleEngine();
// engine.initialize();

function createOwnLantern() {
  const scene = document.querySelector('a-scene');
  const ownParentObject = document.createElement('a-entity');
  const ownObj = document.createElement('a-entity');
  const color = Utils.getRandColor();

  ownObj.setAttribute('lantern',{
    light: color.light,
    dark: color.dark
  });

  ownObj.setAttribute('position', '0 1 -2');

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
  scene.appendChild(ownParentObject);
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