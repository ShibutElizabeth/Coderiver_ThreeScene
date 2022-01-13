const THREE = require("three");
import {
  GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls';

(function () {

  let container;
  let camera, scene, renderer;
  let pointerControls;

  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;

  let _vector = new THREE.Vector3();

  init();
  animate();

  function init() {
    container = document.querySelector(".container");

    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      30000
    );
    camera.position.set(-10, 2, 4);

    scene = new THREE.Scene();

    addLight();
    addGround();
    gltfModelLoad();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio = devicePixelRatio;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(new THREE.Color("rgb(81%, 90%, 100%)"), 1);

    addPointerControls();

    container.appendChild(renderer.domElement);
    container.style.touchAction = "none";

    window.addEventListener("resize", onWindowResize);
    window.addEventListener('keydown', onKeyDown, false);
  }

  function addGround() {
    const geometry = new THREE.PlaneGeometry(200, 200);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color("rgb(17%, 62%, 11%)"),
      side: THREE.DoubleSide
    });
    const ground = new THREE.Mesh(geometry, material);
    ground.position.y = -0.3;
    ground.rotateX(-Math.PI / 2);
    scene.add(ground);
  }

  function addPointerControls(){
    pointerControls = new PointerLockControls(camera, document.body);
    pointerControls.addEventListener( 'lock', function () {
      document.body.requestPointerLock();
    } );
    pointerControls.addEventListener( 'unlock', function () {    
      
    } );
    pointerControls.addEventListener( 'change', function () {    
      
    } );
  }

  function addLight() {
    /* directional light */
    const directionalLight = new THREE.DirectionalLight(new THREE.Color("rgb(100%, 100%, 100%)"), 1.0);
    directionalLight.position.set(5, 10, 3);
    scene.add(directionalLight);
    directionalLight.shadow.mapSize.width = 512;
    directionalLight.shadow.mapSize.height = 512;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;

    /* Ambient light */
    const ambientLight = new THREE.AmbientLight(new THREE.Color("rgb(255, 255, 255)"));
    scene.add(ambientLight);
  }

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }


  function onKeyDown(event) {
    console.log(event.code);
    switch (event.code) {
      case 'KeyW':
        pointerControls.moveForward(0.1);
        break;
      case 'KeyA':
        pointerControls.moveRight(-0.1);
        break;
      case 'KeyS':
        pointerControls.moveForward(-0.1);
        break;
      case 'KeyD':
        pointerControls.moveRight(0.1);
        break;
      case 'Esc':
        pointerControls.unlock();
        break;
      case 'Space':
        pointerControls.lock();
        break;
    }
  }

  function gltfModelLoad() {
    const loader = new GLTFLoader();
    const urlWB = '../../models/model1/WB.gltf';
    const urlWY = '../../models/model2/WY.gltf';
    const urlBB = '../../models/model3/BB.gltf';
    const urlBY = '../../models/model4/BY.gltf';

    loader.load(urlWY, gltf => {
      const root = gltf.scene;
      scene.add(root);
      console.log(dumpObject(root).join('\n'));
      document.querySelector('.spin-wrapper').style.display = 'none';
    });
  }

  function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
  }

  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

})();
