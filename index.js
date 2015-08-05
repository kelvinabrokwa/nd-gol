/* global THREE */

var camera, scene, renderer;

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
  var cell;
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 7; j++) {
      for (var k = 0; k < 7; k++) {
        cell = new Cell([i, j, k]);
        scene.add(cell.geometry);
      }
    }
  }
}

function render() {
  renderer.render(scene, camera);
}

function Cell(position) {
  this.position = {
    x: position[0],
    y: position[1],
    z: position[2]
  };
  this.geometry = new THREE.Mesh(
    new THREE.BoxGeometry(10, 10, 10),
    new THREE.MeshNormalMaterial()
  );
  var pos = this.position;
  this.geometry.position.set(pos.x * 25, pos.y * 25, pos.z * 25);
}
