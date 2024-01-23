console.log('start');

import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const pointsUI = document.querySelector("#points");
let points = 0;

const randomRangeNum = (max, min) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

const moveObstacles = (arr, speed, maxX, minX, maxZ, minZ) => {
    arr.forEach((el) => {
        el.position.z += speed;
        if (el.position.z > camera.position.z) {
            el.position.x = randomRangeNum(maxX, minX);
            el.position.z = randomRangeNum(maxZ, minZ);
        }
    });
};

const updateScore = () => {
    points += 1;
    pointsUI.textContent = points;
}

function playMusic() {
    const score = parseInt(document.getElementById('points').textContent, 10);
    if (score !== 0) {
        const backgroundMusic = document.getElementById('backgroundMusic');
        backgroundMusic.play();
    }
}

console.log('middle');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2;
camera.position.y = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false; 

const player = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.5, 0.5),
    new THREE.MeshBasicMaterial({
        color: 0x222222
    })
);
scene.add(player);

const powerups = []
for (let i = 0; i < 10; i++) {
    const powerup = new THREE.Mesh(
        new THREE.TorusGeometry(1, 0.4, 16, 50),
        new THREE.MeshBasicMaterial({
            color: 0x4c0101
        })
    );
    powerup.scale.set(0.1, 0.1, 0.1)
    powerup.name = "powerup" + i + 1
    powerup.position.x = randomRangeNum(8, -8)
    powerup.position.z = randomRangeNum(-5, -10)
    powerups.push(powerup)
    scene.add(powerup);
}

function checkCollision(object1, object2) {
    let box1 = new THREE.Box3().setFromObject(object1);
    let box2 = new THREE.Box3().setFromObject(object2);
    const collision = box1.intersectsBox(box2);
    console.log("Collision:", collision);
    return collision;
}

function animate() {
    requestAnimationFrame(animate);
    moveObstacles(powerups, 0.1, 8, -8, -5, -10);


    for (let i = 0; i < powerups.length; i++) {
		if(checkCollision(player, powerups[i]) && points <= 150){
			document.getElementById('ui').style.display = 'none'
			document.getElementById('endgame').style.display = 'flex'
            player.position.y = -50
		}
		if(points >= 500){
			document.getElementById('ui').style.display = 'none'
			document.getElementById('endgame0').style.display = 'flex'
            player.position.y = -50
		}
        if (checkCollision(player, powerups[i])) {
			points = Math.round(points / 2);
            pointsUI.textContent = points;

            powerups[i].position.x = randomRangeNum(8, -8);
            powerups[i].position.z = randomRangeNum(-5, -10);
        }

    }

	playMusic();
    controls.update();
    renderer.render(scene, camera);
}

setInterval(updateScore, 100);

animate();

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})

document.addEventListener('mousedown', (event) => {
    if (event.button === 2) {
        event.preventDefault();
        window.location.href = '../index.html';
    }
});

window.addEventListener("keydown", (e) => {
    if (e.key === 'd') {
        player.position.x += 0.1;
    }
    if (e.key === 'a') {
        player.position.x -= 0.1;
    }
})