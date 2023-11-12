import * as THREE from "three";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";

export function initScene() {
  const container = addContainer();
  const renderer = addRenderer(container);
  const camera = addCamera();
  const { renderTarget, scene } = addEnvironmentMap();
  const controls = addControls(camera, renderer);
  addLightning(scene);

  return [scene, camera, renderer, renderTarget, controls];
}

function addLightning(scene) {
  const light = new THREE.AmbientLight(0xe0e1e5);
  light.intensity = 50;
  scene.add(light);
}

function addControls(camera, renderer) {
  const controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 0;
  controls.lookSpeed = 0.15;
  return controls;
}

function addEnvironmentMap(path = "./piazza/") {
  const cubeFaces = [
    "px.jpg",
    "nx.jpg",
    "py.jpg",
    "ny.jpg",
    "pz.jpg",
    "nz.jpg",
  ];

  const renderTarget = new THREE.CubeTextureLoader()
    .setPath(path)
    .load(cubeFaces);

  const scene = new THREE.Scene();
  scene.background = renderTarget;
  return { renderTarget, scene };
}

export function changeEnvironmentMap(scene, path) {
  const cubeFaces = [
    "px.jpg",
    "nx.jpg",
    "py.jpg",
    "ny.jpg",
    "pz.jpg",
    "nz.jpg",
  ];
  
  const newRenderTarget = new THREE.CubeTextureLoader()
    .setPath(path)
    .load(cubeFaces);

  scene.background = newRenderTarget;
}

function addCamera() {
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );
  camera.position.set(20, 0, 300);
  camera.rotateY(Math.PI * 0.75);
  camera.rotateX(Math.PI * -0.15);
  return camera;
}

function addRenderer(container) {
  const renderer = new THREE.WebGLRenderer();
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileCubemapShader();

  THREE.DefaultLoadingManager.onLoad = function () {
    pmremGenerator.dispose();
  };

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  return renderer;
}

function addContainer() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  window.addEventListener("resize", onWindowResize);
  return container;
}

function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
}
