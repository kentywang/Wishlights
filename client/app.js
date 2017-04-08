const scene = document.querySelector('a-scene');

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

obj.setAttribute('lantern',{});

obj.setAttribute('position', {
    x: 0,
    y: 1,
    z: 0,
});

obj.setAttribute('light', {
  color,
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
}, 2000);

scene.appendChild(obj);

for (let i = 0; i < 100; i++) {
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

  obj.setAttribute('lantern',{});

  obj.setAttribute('position', {
	    x: getRandCoord(),
	    y: getRandCoord(1),
	    z: getRandCoord(),
	});

  obj.setAttribute('glow', {});

	// all lanterns fly in and converge
  obj.setAttribute('animation', {
    property: 'position',
    dir: 'alternate',
    dur: 5000,
    easing: 'easeInSine',
    loop: true,
    to: "0 3 -5",
  });

  // all lanterns fly in one direction
  // obviously don't use setTimeout, find proper way to getAttribute once loaded
  // setTimeout(() => {
		// obj.setAttribute('animation', {
	 //    property: 'position',
	 //    dir: 'alternate',
	 //    dur: 5000,
	 //    easing: 'easeInSine',
	 //    loop: true,
	 //    to: `${obj.getAttribute('position').x + 20} ${obj.getAttribute('position').y - 3} ${obj.getAttribute('position').z + 20}`,
	 //  });
  // }, 2000);

  // need to change this so that only nearby lanterns lit, and cap the total number of lit lanterns
 //  if (Math.random() > .97) {
 //  		// never add more than 5 lights, too demanding
	//   	obj.setAttribute('light', {
	// 	    color,
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

  scene.appendChild(obj);
}

function getRandColor () {
    // const letters = '0123456789ABCDEF'.split('');
    // let color = '#';
    // for (let i = 0; i < 6; i++) {
    //   color += letters[Math.floor(Math.random() * 16)];
    // }

    const colors = [
    	"#ffae0c", 	// orange
    	"#FF4500",	// orangered
    	"#ff4f6f",	// pink
    	"#ffd84f",	// yellow
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];

    return color;
}

function getRandCoord (onlyTop = -1) {
  const coord = Math.random() * 50;
  return Math.random() < .5 ? coord : coord * onlyTop;
}

function gaussianRand() {
  var rand = 0;

  for (var i = 0; i < 6; i += 1) {
    rand += Math.random();
  }

  return rand / 6;
}