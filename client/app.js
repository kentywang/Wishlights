const scene = document.querySelector('a-scene');

let parObj = document.createElement('a-entity');
const obj = document.createElement('a-entity');
const color = getRandColor();

// obj.setAttribute('geometry', {
//     primitive: 'cylinder',
//     height: .3,
//     radius: .1,
//   });

// obj.setAttribute('material', {
//   color,
//   shader: 'flat',
// });

obj.setAttribute('lantern',{
  light: color.light,
  dark: color.dark
});

obj.setAttribute('position', {
    x: 0,
    y: 1,
    z: 0,
});

obj.setAttribute('rotation', {
    x: 0,
    y: Math.random() * 90,
    z: 0,
});

obj.setAttribute('light', {
  color: color.light,
  type: 'point',
  intensity: 1,
  distance: 20,
  decay: 1,
});

obj.setAttribute('glow', {});

// obviously don't use setTimeout, find proper way to getAttribute once loaded
setTimeout(() => {
  obj.setAttribute('animation', {
    property: 'position',
    dir: 'alternate',
    dur: 2000,
    easing: 'easeInSine',
    loop: true,
    to: `0 ${obj.getAttribute('position').y + .5} 0}`,
  });

  obj.setAttribute('animation__2', {
      property: 'rotation',
      dur: 8000,
      easing: 'linear',
      loop: true,
      to: `0 ${obj.getAttribute('rotation').y + 360} 0`,
  });
}, 2000);

parObj.appendChild(obj);
scene.appendChild(parObj);

parObj = document.createElement('a-entity');

for (let i = 0; i < 200; i++) {
  const obj = document.createElement('a-entity');
	const color = getRandColor();

  // obj.setAttribute('geometry', {
  //   primitive: 'cylinder',
  //   height: .3,
  //   radius: .1,
  // });

  // obj.setAttribute('material', {
  //   color,
  //   shader: 'flat',
  // });

  obj.setAttribute('lantern',{
    light: color.light,
    dark: color.dark
  });

  if (i < 50) {
    obj.setAttribute('position', {
      x: getRandCoord(3),
      y: getRandCoord(2, 1),
      z: getRandCoord(3),
    }); 
  } else if (i < 150) {
    obj.setAttribute('position', {
      x: getRandCoord(6),
      y: getRandCoord(4, 1),
      z: getRandCoord(6),
    }); 
  } else if (i < 180) {
    obj.setAttribute('position', {
      x: getRandCoord(20),
      y: getRandCoord(15, 1),
      z: getRandCoord(20),
    }); 
  } else {
    obj.setAttribute('position', {
      x: getRandCoord(50),
      y: getRandCoord(30, 1),
      z: getRandCoord(50),
    }); 
  }
  
  obj.setAttribute('rotation', {
    x: 0,
    y: Math.random() * 90,
    z: 0,
  });

  obj.setAttribute('glow', {});

	// all lanterns fly in and converge
  // obj.setAttribute('animation', {
  //   property: 'position',
  //   dir: 'alternate',
  //   dur: 8000,
  //   easing: 'easeInSine',
  //   loop: true,
  //   to: "0 3 -5",
  // });

  // all lanterns fly in one direction
  // obviously don't use setTimeout, find proper way to getAttribute once loaded
  setTimeout(() => {
		obj.setAttribute('animation', {
	    property: 'position',
	    dir: 'alternate',
	    dur: 10000,
	    easing: 'easeInSine',
	    loop: true,
	    to: `${obj.getAttribute('position').x + 10} ${obj.getAttribute('position').y - 3} ${obj.getAttribute('position').z + 10}`,
	  });

    obj.setAttribute('animation__2', {
      property: 'rotation',
      dur: 10000 + Math.random() * 8000,
      easing: 'linear',
      loop: true,
      to: `0 ${obj.getAttribute('rotation').y + 360 * randSign()} 0`,
    });
  }, 2000);

  // need to change this so that only nearby lanterns lit, and cap the total number of lit lanterns
 //  if (Math.random() > .97) {
 //  		// never add more than 5 lights, too demanding
	//   	obj.setAttribute('light', {
	// 	    color.light,
	// 	    type: 'point',
	// 	    intensity: 1,
	// 	    distance: 20,
	// 	    decay: 1,
	// 	  });
	// }
  
  // color change not working
  // obj.setAttribute('animation', {
  //   property: 'color',
  //   dir: 'alternate',
  //   dur: 3000,
  //   easing: 'easeInSine',
  //   loop: true,
  //   to: '#5F5',
  // });

  parObj.appendChild(obj);
}

// setTimeout(() => {
//       parObj.setAttribute('animation', {
//       property: 'rotation',
//       dur: 20000,
//       easing: 'linear',
//       loop: true,
//       to: `0 360 0`,
//     });
//   }, 2000);

scene.appendChild(parObj);

function getRandColor () {
    // const letters = '0123456789ABCDEF'.split('');
    // let color = '#';
    // for (let i = 0; i < 6; i++) {
    //   color += letters[Math.floor(Math.random() * 16)];
    // }

    const colors = [
      {light: 0xffe5b0, dark: 0xe5cd57},  // yellow
      {light: 0xffae0c, dark: 0xFF4500},  // orange
      {light: 0xffb587, dark: 0xff8f49},  // light orange
      {light: 0xffc85b, dark: 0xff8f44},  // orange-pink
      {light: 0xffc19b, dark: 0xFF8FA7},  // pink
      {light: 0xFF9EAF, dark: 0xE648A0},  // dark pink
      {light: 0xFFC191, dark: 0xFF8866},  // pink-orange
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return color;
}

function getRandCoord (maxDist, onlyTop = -1) {
  const coord = Math.random() * maxDist;
  return Math.random() < .5 ? coord : coord * onlyTop;
}

function randSign() {
  return Math.random() > .5 ? -1 : 1;
}

function createLantern(parObj) {
  const obj = document.createElement('a-entity');
  const color = getRandColor();

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

  setTimeout(() => {
    // obj.setAttribute('animation', {
    //   property: 'position',
    //   dir: 'alternate',
    //   dur: 10000,
    //   easing: 'easeInSine',
    //   loop: true,
    //   to: `${obj.getAttribute('position').x + 10} ${obj.getAttribute('position').y - 3} ${obj.getAttribute('position').z + 10}`,
    // });

    obj.setAttribute('animation__2', {
      property: 'rotation',
      dur: 10000 + Math.random() * 8000,
      easing: 'linear',
      loop: true,
      to: `0 ${obj.getAttribute('rotation').y + 360 * randSign()} 0`,
    });
  }, 2000);

  parObj.appendChild(obj);

  return obj;
}

//let engine = new ParticleEngine();
// engine.particleMesh.setAttribute('partSystem', {}); 