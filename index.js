/* global THREE */

var camera, scene, renderer;
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

  camera.position.set(70, 70, 400);
  //camera.rotation.x = 10 * Math.PI / 180;
  //camera.rotation.y = 10 * Math.PI / 180;

  renderer.setSize(WIDTH, HEIGHT);

  document.body.appendChild(renderer.domElement);

  var pointLight = new THREE.PointLight(0xFFFFFF);
  pointLight.position.set(0, 0, 1000);
  scene.add(pointLight);

  // add cells
  var id;
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 7; j++) {
      for (var k = 0; k < 7; k++) {
        id = [i, j, k].map(String).join('');
        cells[id] = new Cell([i, j, k], id);
        scene.add(cells[id].geometry);
      }
    }
  }
}

function render() {
  renderer.render(scene, camera);

  setInterval(function() {
    cells = nextGen;
    nextGen = {};
    generate();
  }, 1000);
}

function generate() {
  scene = null;
  var id;
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 7; j++) {
      for (var k = 0; k < 7; k++) {
        id = [i, j, k].map(String).join('');
        if (cells[id]) {
          scene.add(cells[id].geometry);
        }
      }
    }
  }

}

function Cell(position, id) {
  this.position = {
    x: position[0],
    y: position[1],
    z: position[2]
  };
  this.id = id;
  this.geometry = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshNormalMaterial()
  );
  var p = this.position;
  this.geometry.position.set(p.x * 25, p.y * 25, p.z * 25);

  this.neighbors = [];
  for (var i = p.x - 1; i <= p.x + 1; i++) {
    for (var j = p.y - 1; j <= p.y + 1; j++) {
      for (var k = p.z - 1; k <= p.z + 1; k++) {
        this.neighbors.push([i, j, k].map(String).join(''));
      }
    }
  }
}

Cell.prototype.alive = function() {
  var liveNeighbors = 0;
  for (var i = 0, ii = this.neighbors.length; i < ii; i++) {
    if (cells[this.neighbors[i]]) {
      liveNeighbors++;
    }
  }
  nextGen[this.id] = liveNeighbors > 10 && liveNeighbors < 20;
};
