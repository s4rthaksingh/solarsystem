import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.5,1000)
camera.position.set(0,50,50);
camera.lookAt(0,0,0);
const light = new THREE.PointLight(0xffffff, 1, 1000);
light.position.set(0, 30, 30);
scene.add(light);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const loader = new THREE.TextureLoader();

const ambient = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambient);

scene.background = loader.load('/textures/stars.jpg');
scene.currentbackground = "stars";


const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const controls = new OrbitControls(camera,renderer.domElement);


const sungeo = new THREE.SphereGeometry(1);
const sunmat = new THREE.MeshStandardMaterial({map:loader.load('/textures/sun.jpg')})
const sun = new THREE.Mesh(sungeo,sunmat);
scene.add(sun);

let planets = [];
let orbits = [];

function createPlanet({name,radius,distance,omega,startangle,orbitthickness,orbitcolor}){

    const geometry = new THREE.SphereGeometry(radius);
    const material = new THREE.MeshStandardMaterial({
        map:loader.load(`/textures/${name}.jpg`),
    });
    const mesh = new THREE.Mesh(geometry,material);
    mesh.name = name;
    mesh.distance = distance;
    mesh.angle = startangle;
    mesh.omega = omega;
    mesh.orbitcolor = orbitcolor;
    mesh.orbitthickness = orbitthickness;
    scene.add(mesh);
    planets.push(mesh);
    return(mesh);
}

const gridhelper = new THREE.GridHelper(
    100,
    100
);
// scene.add(gridhelper);

const mercury = createPlanet({ name: 'mercury', radius: 0.3, distance: 5, omega: 0.04, startangle: 0, orbitthickness: 0.1, orbitcolor: 0x555555 });
const venus = createPlanet({ name: 'venus', radius: 0.5, distance: 8, omega: 0.025, startangle: Math.PI / 4, orbitthickness: 0.1, orbitcolor: 0x666666 });
const earth = createPlanet({ name: 'earth', radius: 0.8, distance: 11, omega: 0.02, startangle: Math.PI / 2, orbitthickness: 0.1, orbitcolor: 0x4f4cb0 });
const mars = createPlanet({ name: 'mars', radius: 0.6, distance: 14, omega: 0.015, startangle: Math.PI, orbitthickness: 0.1, orbitcolor: 0xff3300 });
const jupiter = createPlanet({ name: 'jupiter', radius: 1.4, distance: 18, omega: 0.01, startangle: Math.PI / 3, orbitthickness: 0.1, orbitcolor: 0xff9966 });
const saturn = createPlanet({ name: 'saturn', radius: 1.2, distance: 22, omega: 0.008, startangle: Math.PI / 6, orbitthickness: 0.1, orbitcolor: 0xffff99 });
const uranus = createPlanet({ name: 'uranus', radius: 1.0, distance: 26, omega: 0.006, startangle: Math.PI / 8, orbitthickness: 0.1, orbitcolor: 0x66ffff });
const neptune = createPlanet({ name: 'neptune', radius: 1.0, distance: 30, omega: 0.005, startangle: Math.PI / 10, orbitthickness: 0.1, orbitcolor: 0x3366ff });
// const galaxy = createPlanet({ name: 'galaxy', radius: 1000.0, distance: 0, omega: 0.0, startangle: 0, orbitthickness: 0.0, orbitcolor: 0x3366ff });

function updateorbits(){
    orbits.forEach(orbit => {
    scene.add(orbit);
    });
}

function createorbits(){
    planets.forEach(planet => {
        const orbitgeometry = new THREE.RingGeometry(planet.distance-planet.orbitthickness,planet.distance+planet.orbitthickness,64);
        const orbitmaterial = new THREE.MeshBasicMaterial({color:planet.orbitcolor,side:THREE.DoubleSide});
        const orbitmesh = new THREE.Mesh(orbitgeometry,orbitmaterial);
        orbitmesh.rotation.x = Math.PI/2;
        orbitmesh.planet = planet;
        planet.orbit = orbitmesh;
        orbitmesh.isOrbit = true;
        orbits.push(orbitmesh)
    });
    updateorbits();
}

function removeorbits(){
    orbits.forEach(orbit => {
    scene.remove(orbit);
    });
    orbits = [];
    updateorbits();
}

createorbits();

function rotateaboutsun(planet){
    planet.angle += planet.omega;
    planet.position.x = Math.cos(planet.angle) * planet.distance;
    planet.position.z = Math.sin(planet.angle) * planet.distance;
}

window.addEventListener('keydown',(e)=>{
    if(e.key === 's'){
        if(scene.currentbackground === "stars"){
            scene.background = loader.load('/textures/galaxy.jpg');
            scene.currentbackground = "galaxy"
        }
        else{
            scene.background = loader.load('/textures/stars.jpg');
            scene.currentbackground = 'stars';
        }
    }
    if(e.key === 'o'){
        if(orbits.length>0){
        removeorbits();
        }
        else{
            createorbits();
        }
    }
    if(e.key==='='){
        planets.forEach(planet => {
            planet.omega *= 1.1;
        });
    }
    if(e.key==='-'){
    planets.forEach(planet => {
        planet.omega *= 0.9;
    });
    }
})



window.addEventListener('click',(event)=>{
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera(pointer,camera);
    const intersects = raycaster.intersectObjects(planets.concat(orbits));
    if (intersects.length){
        let selected = intersects[0].object;
        if (selected.isOrbit){
            selected = selected.planet;
        }
        let distancecopy = selected.distance;
        let omegacopy = selected.omega;
        let ringgeometrycopy = selected.orbit.geometry;
        document.getElementById("planet-popup").style.display = 'block';
        document.getElementById("popup-title").innerText = selected.name.toUpperCase();
        document.getElementById("popup-close").onclick = () =>{
            document.getElementById("planet-popup").style.display = 'none';
        }
        document.getElementById("popup-reset").onclick = () =>{
            selected.distance = distancecopy;
            selected.orbit.geometry.dispose();
            selected.orbit.geometry = ringgeometrycopy;
            selected.omega = omegacopy;
            document.getElementById("distance").value = selected.distance;
            document.getElementById("omega").value = selected.omega;
        }
        document.getElementById("distance").value = selected.distance;
        document.getElementById("omega").value = selected.omega;
        document.getElementById("distance").oninput = () =>{
            selected.distance = parseFloat(document.getElementById("distance").value);
        }
        document.getElementById("distance").onchange = () =>{
            selected.orbit.geometry.dispose();
            let innerRadius = selected.distance-selected.orbitthickness;
            let outerRadius = selected.distance+selected.orbitthickness;
            console.log("inner:", innerRadius, "outer:", outerRadius);
            selected.orbit.geometry = new THREE.RingGeometry(innerRadius,outerRadius,64);
            selected.orbit.geometry.attributes.position.needsUpdate = true;
        }

        document.getElementById("omega").oninput = () =>{
            selected.omega = parseFloat(document.getElementById("omega").value);
        }
    }
})

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.updateProjectionMatrix();
})

function animate(){
    sun.rotation.y -= 0.02;
    planets.forEach(rotateaboutsun);
    renderer.render(scene,camera);
}
renderer.setAnimationLoop(animate);