/* global THREE */

var camera, scene, pointLight, renderer, controls;
var cells = {}, nextGen = {};

init();
render();

function init() {

  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight;

  var VIEW_ANGLE = 45,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 0.1,
      FAR = 10000;

  renderer = new THREE.WebGLRenderer();

  camera = new THREE.PerspectiveCamera(
      VIEW_ANGLE,
      ASPECT,
      NEAR,
      FAR
      );

  scene = new THREE.Scene();

  scene.add(camera);

  camera.position.set(60, 40, 70);

  renderer.setSize(WIDTH, HEIGHT);

  document.body.appendChild(renderer.domElement);

  controls = new THREE.OrbitControls(camera);
  controls.addEventListener('change', render);

  pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.set(0, 0, 1000);
  scene.add(pointLight);

  // add cells
  var id;
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      for (var k = 0; k < 9; k++) {
        id = [i, j, k].map(String).join('');
        cells[id] = {
          cell: new Cell([i, j, k], id),
          isAlive: false
        };
        if (Math.random() > 0.4) {
          cells[id].isAlive = true;
          scene.add(cells[id].cell.geometry);
        }
      }
    }
  }
  animate();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
}

function render() {
  renderer.render(scene, camera);
}

setInterval(function() {
  setNextScene();
  render();
}, 1000);

function setNextScene() {
  scene = new THREE.Scene();
  scene.add(camera);
  scene.add(pointLight);
  var id;
  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      for (var k = 0; k < 9; k++) {
        id = [i, j, k].map(String).join('');
        nextGen[id] = {
          isAlive: cells[id].cell.next(),
          cell: cells[id].cell
        };
        if (nextGen[id].isAlive) {
          scene.add(cells[id].cell.geometry);
        }
      }
    }
  }
  cells = nextGen;
  nextGen = {};
}

function Cell(position, id) {
  this.position = {
    x: position[0],
    y: position[1],
    z: position[2]
  };
  this.id = id;

  this.geometry = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshNormalMaterial()
  );
  var p = this.position;
  this.geometry.position.set(p.x * 3, p.y * 3, p.z * 3);

  this.neighbors = [];
  for (var i = p.x - 1; i <= p.x + 1; i++) {
    for (var j = p.y - 1; j <= p.y + 1; j++) {
      for (var k = p.z - 1; k <= p.z + 1; k++) {
        id = [i, j, k].map(String).join('');
        if (id !== this.id) {
          this.neighbors.push(id);
        }
      }
    }
  }
}

Cell.prototype.next = function() {
  var liveNeighbors = 0;
  for (var i = 0, ii = this.neighbors.length; i < ii; i++) {
    if (typeof cells[this.neighbors[i]] !== 'undefined' && cells[this.neighbors[i]].isAlive) {
      liveNeighbors++;
    }
  }
  return liveNeighbors > 9 && liveNeighbors < 20;
};

