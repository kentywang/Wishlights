console.log("Kenty!!!")
let x = 2;
console.log('this is xxx', x);

import test from './test';

test.printMyName('kenty!!!');

// const scene = document.querySelector('a-scene');

// // these are temporary functions that we will use until we implement particle system for lanterns
// createOwnLantern();
// createOtherLanterns();

// // let engine = new ParticleEngine();
// // engine.initialize();

// function createOwnLantern() {
//   const ownParentObject = document.createElement('a-entity');
//   const ownObj = document.createElement('a-entity');
//   const color = getRandColor();

//   ownObj.setAttribute('lantern',{
//     light: color.light,
//     dark: color.dark
//   });

//   ownObj.setAttribute('position', {
//       x: 0,
//       y: 1,
//       z: 0,
//   });

//   ownObj.setAttribute('rotation', {
//       x: 0,
//       y: Math.random() * 90,
//       z: 0,
//   });

//   ownObj.setAttribute('light', {
//     color: color.light,
//     type: 'point',
//     intensity: 1,
//     distance: 20,
//     decay: 1,
//   });

//   ownObj.setAttribute('glow', {});

//   // obviously don't use setTimeout, find proper way to getAttribute once loaded
//   setTimeout(() => {
//     ownObj.setAttribute('animation', {
//       property: 'position',
//       dir: 'alternate',
//       dur: 2000,
//       easing: 'easeInSine',
//       loop: true,
//       to: `0 ${ownObj.getAttribute('position').y + .5} 0}`,
//     });

//     ownObj.setAttribute('animation__2', {
//         property: 'rotation',
//         dur: 8000,
//         easing: 'linear',
//         loop: true,
//         to: `0 ${ownObj.getAttribute('rotation').y + 360} 0`,
//     });
//   }, 2000);

//   // add lantern to scene
//   ownParentObject.appendChild(ownObj);
//   scene.appendChild(ownParentObject);
// }

// function createOtherLanterns() {
//   const parentObj = document.createElement('a-entity');

//   for (let i = 0; i < 200; i++) {
//     const obj = document.createElement('a-entity');
//     const color = getRandColor();

//     obj.setAttribute('lantern',{
//       light: color.light,
//       dark: color.dark
//     });

//     if (i < 50) {
//       obj.setAttribute('position', {
//         x: getRandCoord(3),
//         y: getRandCoord(2, 1),
//         z: getRandCoord(3),
//       }); 
//     } else if (i < 150) {
//       obj.setAttribute('position', {
//         x: getRandCoord(6),
//         y: getRandCoord(4, 1),
//         z: getRandCoord(6),
//       }); 
//     } else if (i < 180) {
//       obj.setAttribute('position', {
//         x: getRandCoord(20),
//         y: getRandCoord(15, 1),
//         z: getRandCoord(20),
//       }); 
//     } else {
//       obj.setAttribute('position', {
//         x: getRandCoord(50),
//         y: getRandCoord(30, 1),
//         z: getRandCoord(50),
//       }); 
//     }
    
//     obj.setAttribute('rotation', {
//       x: 0,
//       y: Math.random() * 90,
//       z: 0,
//     });

//     obj.setAttribute('glow', {});

//     // all lanterns fly in and converge
//     // obj.setAttribute('animation', {
//     //   property: 'position',
//     //   dir: 'alternate',
//     //   dur: 8000,
//     //   easing: 'easeInSine',
//     //   loop: true,
//     //   to: "0 3 -5",
//     // });

//     // all lanterns fly in one direction
//     // obviously don't use setTimeout, find proper way to getAttribute once loaded
//     setTimeout(() => {
//       obj.setAttribute('animation', {
//         property: 'position',
//         dir: 'alternate',
//         dur: 10000,
//         easing: 'easeInSine',
//         loop: true,
//         to: `${obj.getAttribute('position').x + 10} ${obj.getAttribute('position').y - 3} ${obj.getAttribute('position').z + 10}`,
//       });

//       obj.setAttribute('animation__2', {
//         property: 'rotation',
//         dur: 10000 + Math.random() * 8000,
//         easing: 'linear',
//         loop: true,
//         to: `0 ${obj.getAttribute('rotation').y + 360 * randomSign()} 0`,
//       });
//     }, 2000);

//     parentObj.appendChild(obj);
//   }

//   scene.appendChild(parentObj);
// }