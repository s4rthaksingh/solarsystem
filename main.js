import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.5,1000)
camera.position.set(0,20,20);
camera.lookAt(0,0,0);

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls(camera,renderer.domElement);

const sungeo = new THREE.SphereGeometry(1);
const sunmat = new THREE.MeshBasicMaterial({color:0xffd700});
const sun = new THREE.Mesh(sungeo,sunmat);
scene.add(sun);

const planets = [];

function createPlanet({name,radius,color,distance,omega,startangle,orbitthickness,orbitcolor}){
    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshBasicMaterial({color:color});
    const mesh = new THREE.Mesh(geometry,material);
    mesh.name = name;
    mesh.distance = distance;
    mesh.angle = startangle;
    mesh.omega = omega;
    scene.add(mesh);
    planets.push(mesh);

    const orbitgeometry = new THREE.RingGeometry(distance-orbitthickness,distance+orbitthickness,64);
    const orbitmaterial = new THREE.MeshBasicMaterial({color:orbitcolor,side:THREE.DoubleSide});
    const orbitmesh = new THREE.Mesh(orbitgeometry,orbitmaterial);
    orbitmesh.rotation.x = Math.PI/2;
    scene.add(orbitmesh);

    return(mesh);
}

const gridhelper = new THREE.GridHelper(
    100,
    100
);
// scene.add(gridhelper);

const mercury = createPlanet({ name: 'mercury', radius: 0.3, color: 0xaaaaaa, distance: 5, omega: 0.04, startangle: 0, orbitthickness: 0.1, orbitcolor: 0x555555 });
const venus = createPlanet({ name: 'venus', radius: 0.5, color: 0xffcc66, distance: 8, omega: 0.025, startangle: Math.PI / 4, orbitthickness: 0.1, orbitcolor: 0x666666 });
const earth = createPlanet({ name: 'earth', radius: 0.8, color: 0x4f4cb0, distance: 11, omega: 0.02, startangle: Math.PI / 2, orbitthickness: 0.1, orbitcolor: 0x4f4cb0 });
const mars = createPlanet({ name: 'mars', radius: 0.6, color: 0xff3300, distance: 14, omega: 0.015, startangle: Math.PI, orbitthickness: 0.1, orbitcolor: 0xff3300 });
const jupiter = createPlanet({ name: 'jupiter', radius: 1.4, color: 0xff9966, distance: 18, omega: 0.01, startangle: Math.PI / 3, orbitthickness: 0.1, orbitcolor: 0xff9966 });
const saturn = createPlanet({ name: 'saturn', radius: 1.2, color: 0xffff99, distance: 22, omega: 0.008, startangle: Math.PI / 6, orbitthickness: 0.1, orbitcolor: 0xffff99 });
const uranus = createPlanet({ name: 'uranus', radius: 1.0, color: 0x66ffff, distance: 26, omega: 0.006, startangle: Math.PI / 8, orbitthickness: 0.1, orbitcolor: 0x66ffff });
const neptune = createPlanet({ name: 'neptune', radius: 1.0, color: 0x3366ff, distance: 30, omega: 0.005, startangle: Math.PI / 10, orbitthickness: 0.1, orbitcolor: 0x3366ff });


function rotateaboutsun(planet){
    planet.angle += planet.omega;
    planet.position.x = Math.cos(planet.angle) * planet.distance;
    planet.position.z = Math.sin(planet.angle) * planet.distance;
}

function animate(){
    sun.rotation.x += 0.1;
    planets.forEach(rotateaboutsun);
    renderer.render(scene,camera);
}
renderer.setAnimationLoop(animate);