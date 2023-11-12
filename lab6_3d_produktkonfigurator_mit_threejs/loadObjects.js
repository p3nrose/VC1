import * as THREE from "three";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";

export function loadObjects(renderFn, scene, renderer, camera, renderTarget) {
  // table
  const TABLE_POSITION = {
    X: -230,
    Y: -390,
    Z: 590,
  };
  const TABLE_ROTATION_Y = Math.PI * 0.75;
  new FBXLoader()
    .setPath("./table/table_industrial_m/")
    .load("table_industrial_m_standard.FBX", (object) => {
      object.position.x = TABLE_POSITION.X;
      object.position.y = TABLE_POSITION.Y;
      object.position.z = TABLE_POSITION.Z;
      object.rotation.y = TABLE_ROTATION_Y;
      object.name = "table";
      object.scale.setScalar(0.25);
      scene.add(object);

      document.dispatchEvent(new CustomEvent('objectsLoaded', {detail: {name: 'table', object: object}}));
    });

  // plate
  const PLATE_POSITION = {
    X: -210,
    Y: -190,
    Z: 545,
  };

  let plateMaterial = new THREE.MeshStandardMaterial({
    envMap: renderTarget,
    roughness: 0.1,
    metalness: 0.8,
    color: 0xababab,
  });

  new FBXLoader().load("plate.fbx", (object) => {
    object.position.x = PLATE_POSITION.X;
    object.position.y = PLATE_POSITION.Y;
    object.position.z = PLATE_POSITION.Z;
    object.name = "plate";

    applyMaterial(object, plateMaterial);
    scene.add(object);

    document.dispatchEvent(new CustomEvent('objectsLoaded', {detail: {name: 'plate', object: object}}));
  });

  // cuttlery
  let cuttleryMaterial = new THREE.MeshStandardMaterial({
    envMap: renderTarget,
    roughness: 0.2,
    metalness: 1,
  });

  new OBJLoader().load("Tablespoon.obj", (object) => {
    object.position.x = PLATE_POSITION.X - 60;
    object.position.y = PLATE_POSITION.Y;
    object.position.z = PLATE_POSITION.Z + 75;
    object.rotation.y = -TABLE_ROTATION_Y;
    object.name = "spoon";
    object.scale.setScalar(3);

    applyMaterial(object, cuttleryMaterial);
    scene.add(object);

    document.dispatchEvent(new CustomEvent('objectsLoaded', {detail: {name: 'spoon', object: object}}));
  });

  new OBJLoader().load("Knife.obj", (object) => {
    object.position.x = PLATE_POSITION.X - 55;
    object.position.y = PLATE_POSITION.Y;
    object.position.z = PLATE_POSITION.Z - 25;
    object.rotation.y = TABLE_ROTATION_Y;
    object.name = "knife";
    object.scale.setScalar(3);

    applyMaterial(object, cuttleryMaterial);
    scene.add(object);

    document.dispatchEvent(new CustomEvent('objectsLoaded', {detail: {name: 'knife', object: object}}));
  });

  new OBJLoader().load("Fork.obj", (object) => {
    object.position.x = PLATE_POSITION.X + 25;
    object.position.y = PLATE_POSITION.Y;
    object.position.z = PLATE_POSITION.Z + 50;
    object.rotation.y = TABLE_ROTATION_Y;
    object.name = "fork";
    object.scale.setScalar(3);

    applyMaterial(object, cuttleryMaterial);
    scene.add(object);

    document.dispatchEvent(new CustomEvent('objectsLoaded', {detail: {name: 'fork', object: object}}));
  });

  // glass
  let glassMaterial = new THREE.MeshPhysicalMaterial({
    envMap: renderTarget,
    roughness: 0,
    metalness: 0,
    opacity: 0.6,
    color: 0xeeeeee,
    transparent: true,
  });

  new OBJLoader().load("./glasses/BeerGlass_01.obj", (object) => {
    object.position.x = PLATE_POSITION.X - 380;
    object.position.y = PLATE_POSITION.Y;
    object.position.z = PLATE_POSITION.Z + 10;
    object.scale.setScalar(3);

    applyMaterial(object, glassMaterial);
    scene.add(object);

    document.dispatchEvent(new CustomEvent('objectsLoaded', {detail: {name: 'glass', object: object}}));
  });

  function addTransformControl(object) {
    const transformControls = new TransformControls(
      camera,
      renderer.domElement,
    );
    transformControls.addEventListener("change", renderFn);
    transformControls.addEventListener("dragging-changed", function (event) {
      console.log(object.position);
    });
    transformControls.attach(object);
    scene.add(transformControls);
  }
}

function applyMaterial(object, material) {
  object.traverse(function (child) {
    if (child instanceof THREE.Mesh) {
      child.material = material;
    }
  });
}
