import * as THREE from 'https://unpkg.com/three/build/three.module.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { PointerLockControls } from 'three/addons/controls/PointerLockControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .1, 1000);
camera.position.z = 3;
camera.position.x = 0;
camera.position.y = 4;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, document.body);
scene.add(controls.getObject());

document.addEventListener('click', () => {
    controls.lock();
});

const mtlLoader = new MTLLoader();
mtlLoader.load('assets/arcade.mtl', (materials) => {
    materials.preload();

    const objLoader = new OBJLoader();
    objLoader.setMaterials(materials);
    objLoader.load('assets/arcade.obj', (obj) => {

        obj.rotation.y = -Math.PI / 4;
        camera.rotation.x = Math.PI / -7;
        scene.add(obj);
    });
});

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 500, 100);
scene.add(directionalLight);


const onMouseMove = (event) => {
    if (controls.isLocked) {
        const btn = document.getElementById('text');
        btn.style.opacity = '0';
        btn.style.display = 'flex';
    
        setTimeout(() => {
            let opacityValue = 0;
            const fadeInInterval = setInterval(() => {
                if (opacityValue < 1) {
                    opacityValue += 0.5;
                    btn.style.opacity = opacityValue;
                } else {
                    clearInterval(fadeInInterval);
                }
            }, 5); 
        }, 1000); 
    }
};

document.addEventListener('mousemove', onMouseMove);

const animate = () => {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();