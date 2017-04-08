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

obj.setAttribute('lantern',{
  light: color.light,
  dark: color.dark
});

obj.setAttribute('position', {
    x: 0,
    y: 1,
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
}, 2000);

scene.appendChild(obj);

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

  scene.appendChild(obj);
}

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