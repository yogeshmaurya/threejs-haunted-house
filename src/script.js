import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";

THREE.ColorManagement.enabled = false;

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * House
 */
const house = new THREE.Group();
scene.add(house);

// WALLS
const wallProps = { depth: 4, height: 3, width: 4 };
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(wallProps.width, wallProps.height, wallProps.depth),
  new THREE.MeshStandardMaterial({ color: 0x0afd3f })
);
walls.position.y = wallProps.height / 2;
house.add(walls);

gui.add(walls.material, "wireframe").name("Wall wireframe");

// ROOF
const roofProps = { baseSize: wallProps.width, height: 1.5, numberOfSides: 4 };
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(
    roofProps.baseSize,
    roofProps.height,
    roofProps.numberOfSides
  ),
  new THREE.MeshStandardMaterial({ color: 0x0a3ffd })
);
roof.position.y = wallProps.height + roofProps.height / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

gui.add(roof.material, "wireframe").name("Roof wireframe");

// DOOR
const doorProps = { height: 2, width: 2 };
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorProps.width, doorProps.height),
  new THREE.MeshStandardMaterial({ color: 0xfa1283 })
);
door.position.y = doorProps.height / 2;
door.position.z = wallProps.depth / 2;
house.add(door);

gui.add(door.material, "wireframe").name("Door wireframe");

// BUSHES
// TODO: REFACTOR THIS CODE
const bushProps = { radius: 1, widthSegments: 16, heightSegments: 16 };
const bushGeometry = new THREE.SphereGeometry(
  bushProps.radius,
  bushProps.widthSegments,
  bushProps.heightSegments
);
const bushMaterial = new THREE.MeshStandardMaterial(0x00ff00);

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

gui.add(bushMaterial, "wireframe").name("Bush wireframe");


// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: "#a9c388" })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

gui.add(floor.material, "wireframe").name("Floor wireframe");

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight("#ffffff", 0.5);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
