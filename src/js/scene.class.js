const THREE = require("three");
import {
	GLTFLoader
} from 'three/examples/jsm/loaders/GLTFLoader';
import {
	PointerLockControls
} from 'three/examples/jsm/controls/PointerLockControls';

export default class MyScene {

	constructor() {
		/** @type {HTMLElement} */
		this.container = document.querySelector(".container");

		this.camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.01,
			30000
		);
		this.camera.position.set(-10, 2, 4);

		this.scene = new THREE.Scene();
		this.renderer = new THREE.WebGLRenderer();
		this.pointerControls = new PointerLockControls(this.camera);

		this.renderer.setPixelRatio = devicePixelRatio;
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.setClearColor(new THREE.Color("rgb(81%, 90%, 100%)"), 1);
		console.log(this.camera);
		this.init();
		this.animate();
	}

	init() {
		this.addLight();
		this.addGround();
		this.gltfModelLoad();
		this.addPointerControls();

		this.container.appendChild(this.renderer.domElement);
		this.container.style.touchAction = "none";

		window.addEventListener("resize", this.onWindowResize.bind(this));
		window.addEventListener('keydown', this.onKeyDown.bind(this), false);
	}

	addGround() {
		const geometry = new THREE.PlaneGeometry(200, 200);
		const material = new THREE.MeshBasicMaterial({
			color: new THREE.Color("rgb(17%, 62%, 11%)"),
			side: THREE.DoubleSide
		});
		const ground = new THREE.Mesh(geometry, material);
		ground.position.y = -0.3;
		ground.rotateX(-Math.PI / 2);
		this.scene.add(ground);
	}

	addPointerControls() {
		this.pointerControls.addEventListener('lock', function () {
			document.body.requestPointerLock();
		});
		this.pointerControls.addEventListener('unlock', function () {});
		this.pointerControls.addEventListener('change', function () {});
	}

	addLight() {
		/* directional light */
		const directionalLight = new THREE.DirectionalLight(new THREE.Color("rgb(100%, 100%, 100%)"), 1.0);
		directionalLight.position.set(5, 10, 3);
		this.scene.add(directionalLight);
		directionalLight.shadow.mapSize.width = 512;
		directionalLight.shadow.mapSize.height = 512;
		directionalLight.shadow.camera.near = 0.5;
		directionalLight.shadow.camera.far = 500;

		/* Ambient light */
		const ambientLight = new THREE.AmbientLight(new THREE.Color("rgb(255, 255, 255)"));
		this.scene.add(ambientLight);
	}

	animate() {
		requestAnimationFrame(this.animate.bind(this));
		this.renderer.render(this.scene, this.camera);
	}

	onKeyDown(event) {
		console.log(event.code);
		switch (event.code) {
			case 'KeyW':
				this.pointerControls.moveForward(0.1);
				break;
			case 'KeyA':
				this.pointerControls.moveRight(-0.1);
				break;
			case 'KeyS':
				this.pointerControls.moveForward(-0.1);
				break;
			case 'KeyD':
				this.pointerControls.moveRight(0.1);
				break;
			case 'Space':
				this.pointerControls.lock();
				break;
		}
	}

	gltfModelLoad() {
		const loader = new GLTFLoader();
		const urlWB = '../../models/model1/WB.gltf';
		const urlWY = '../../models/model2/WY.gltf';
		const urlBB = '../../models/model3/BB.gltf';
		const urlBY = '../../models/model4/BY.gltf';

		loader.load(urlWY, gltf => {
			const root = gltf.scene;
			this.scene.add(root);
			console.log(this.dumpObject(root).join('\n'));
			document.querySelector('.spin-wrapper').style.display = 'none';
		});
	}

	dumpObject(obj, lines = [], isLast = true, prefix = '') {
		const localPrefix = isLast ? '└─' : '├─';
		lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
		const newPrefix = prefix + (isLast ? '  ' : '│ ');
		const lastNdx = obj.children.length - 1;
		obj.children.forEach((child, ndx) => {
			const isLast = ndx === lastNdx;
			this.dumpObject(child, lines, isLast, newPrefix);
		});
		return lines;
	}

	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

}
