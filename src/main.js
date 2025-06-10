import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,0.1,1000000)
const controls = new OrbitControls(camera,renderer.domElement);
camera.lookAt(0,0,0);
camera.position.set(0,50,50);
controls.update();

const light = new THREE.PointLight(0xffffff, 3, 1000);
light.position.set(0, 30, 30);
scene.add(light);
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const loader = new THREE.TextureLoader();
let followtarget = null;
const ambient = new THREE.AmbientLight(0xffffff, 2.5);
scene.add(ambient);

scene.background = loader.load('/textures/stars.jpg');
scene.currentbackground = "stars";





let highlight = null;
let highlightedplanet = null;

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
    mesh.radius = radius;
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

let mercury = createPlanet({ name: 'mercury', radius: 0.3, distance: 5, omega: 0.04, startangle: 0, orbitthickness: 0.1, orbitcolor: 0x555555 });
let venus = createPlanet({ name: 'venus', radius: 0.5, distance: 8, omega: 0.025, startangle: Math.PI / 4, orbitthickness: 0.1, orbitcolor: 0x666666 });
let earth = createPlanet({ name: 'earth', radius: 0.8, distance: 11, omega: 0.02, startangle: Math.PI / 2, orbitthickness: 0.1, orbitcolor: 0x4f4cb0 });
let mars = createPlanet({ name: 'mars', radius: 0.6, distance: 14, omega: 0.015, startangle: Math.PI, orbitthickness: 0.1, orbitcolor: 0xff3300 });
let jupiter = createPlanet({ name: 'jupiter', radius: 1.4, distance: 18, omega: 0.01, startangle: Math.PI / 3, orbitthickness: 0.1, orbitcolor: 0xff9966 });
let saturn = createPlanet({ name: 'saturn', radius: 1.2, distance: 22, omega: 0.008, startangle: Math.PI / 6, orbitthickness: 0.1, orbitcolor: 0xffff99 });
let uranus = createPlanet({ name: 'uranus', radius: 1.0, distance: 26, omega: 0.006, startangle: Math.PI / 8, orbitthickness: 0.1, orbitcolor: 0x66ffff });
let neptune = createPlanet({ name: 'neptune', radius: 1.0, distance: 30, omega: 0.005, startangle: Math.PI / 10, orbitthickness: 0.1, orbitcolor: 0x3366ff });
// const stars = createPlanet({ name: 'stars', radius: 1000.0, distance: 0, omega: 0.0, startangle: 0, orbitthickness: 0.0, orbitcolor: 0x3366ff });
document.getElementById("realisticcheck").checked = false;
document.getElementById("realisticcheck").addEventListener('change',()=>{
    let popup = document.getElementById('planet-popup');
    let message = document.getElementById('realistic-mode-message')
    if (document.getElementById("realisticcheck").checked == false){
        popup.style.pointerEvents = 'auto';
        popup.style.opacity = '1';
        message.style.display = 'none';
        removeorbits();
    planets.forEach(planet => {
        planet.material.dispose();
        planet.geometry.dispose();
        scene.remove(planet);
    });
    planets = [];

    sun.scale.set(1,1,1);
        mercury = createPlanet({ name: 'mercury', radius: 0.3, distance: 5, omega: 0.04, startangle: 0, orbitthickness: 0.1, orbitcolor: 0x555555 });
        venus = createPlanet({ name: 'venus', radius: 0.5, distance: 8, omega: 0.025, startangle: Math.PI / 4, orbitthickness: 0.1, orbitcolor: 0x666666 });
        earth = createPlanet({ name: 'earth', radius: 0.8, distance: 11, omega: 0.02, startangle: Math.PI / 2, orbitthickness: 0.1, orbitcolor: 0x4f4cb0 });
        mars = createPlanet({ name: 'mars', radius: 0.6, distance: 14, omega: 0.015, startangle: Math.PI, orbitthickness: 0.1, orbitcolor: 0xff3300 });
        jupiter = createPlanet({ name: 'jupiter', radius: 1.4, distance: 18, omega: 0.01, startangle: Math.PI / 3, orbitthickness: 0.1, orbitcolor: 0xff9966 });
        saturn = createPlanet({ name: 'saturn', radius: 1.2, distance: 22, omega: 0.008, startangle: Math.PI / 6, orbitthickness: 0.1, orbitcolor: 0xffff99 });
        uranus = createPlanet({ name: 'uranus', radius: 1.0, distance: 26, omega: 0.006, startangle: Math.PI / 8, orbitthickness: 0.1, orbitcolor: 0x66ffff });
        neptune = createPlanet({ name: 'neptune', radius: 1.0, distance: 30, omega: 0.005, startangle: Math.PI / 10, orbitthickness: 0.1, orbitcolor: 0x3366ff });
        createorbits(planets);
        camera.position.set(0,20,20);
        controls.update();
    }
    else{
        popup.style.pointerEvents = 'none';
        popup.style.opacity = '0.0';
        popup.style.display = 'none';
        message.style.display = 'block';
        removeorbits();
    planets.forEach(planet => {
            planet.material.dispose();
            planet.geometry.dispose();
            scene.remove(planet);
    });
    planets = [];
    sun.scale.set(5,5,5);
    mercury = createPlanet({ name: 'mercury', radius: 0.035, distance: 8.3, omega: 0.024, startangle: 0, orbitthickness: 0.1, orbitcolor: 0x8c7853 });
    venus = createPlanet({ name: 'venus', radius: 0.087, distance: 15.5, omega: 0.015, startangle: Math.PI / 4, orbitthickness: 0.1, orbitcolor: 0xffc649 });
    earth = createPlanet({ name: 'earth', radius: 0.092, distance: 21.5, omega: 0.010, startangle: Math.PI / 2, orbitthickness: 0.1, orbitcolor: 0x6b93d6 });
    mars = createPlanet({ name: 'mars', radius: 0.049, distance: 32.7, omega: 0.0053, startangle: Math.PI, orbitthickness: 0.1, orbitcolor: 0xcd5c5c });
    jupiter = createPlanet({ name: 'jupiter', radius: 1.02, distance: 111.8, omega: 0.00084, startangle: Math.PI / 3, orbitthickness: 0.1, orbitcolor: 0xd8ca9d });
    saturn = createPlanet({ name: 'saturn', radius: 0.84, distance: 205.4, omega: 0.00034, startangle: Math.PI / 6, orbitthickness: 0.1, orbitcolor: 0xfad5a5 });
    uranus = createPlanet({ name: 'uranus', radius: 0.37, distance: 412.7, omega: 0.00012, startangle: Math.PI / 8, orbitthickness: 0.1, orbitcolor: 0x4fd0e7 });
    neptune = createPlanet({ name: 'neptune', radius: 0.35, distance: 645.9, omega: 0.000060, startangle: Math.PI / 10, orbitthickness: 0.1, orbitcolor: 0x4b70dd });
    createorbits(planets);
}})

function updateorbits(){
    orbits.forEach(orbit => {
    scene.add(orbit);
    });
}

// function createorbits(planetlist){
//     planetlist.forEach(planet => {
//         const orbitgeometry = new THREE.RingGeometry(planet.distance-planet.orbitthickness,planet.distance+planet.orbitthickness,64);
//         const orbitmaterial = new THREE.MeshBasicMaterial({color:planet.orbitcolor,side:THREE.DoubleSide});
//         const orbitmesh = new THREE.Mesh(orbitgeometry,orbitmaterial);
//         orbitmesh.rotation.x = Math.PI/2;
//         orbitmesh.planet = planet;
//         planet.orbit = orbitmesh;
//         orbitmesh.isOrbit = true;
//         orbits.push(orbitmesh)
//     });
//     updateorbits();
// }

function createorbits(planetlist){
    planetlist.forEach(planet => {
        const orbitPoints = [];
        for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            orbitPoints.push(new THREE.Vector3(
                Math.cos(angle) * planet.distance,
                0,
                Math.sin(angle) * planet.distance
            ));
        }
        
        const orbitgeometry = new THREE.BufferGeometry().setFromPoints(orbitPoints);
        const orbitmaterial = new THREE.LineBasicMaterial({
            color: planet.orbitcolor,
            linewidth: 2
        });
        const orbitmesh = new THREE.LineLoop(orbitgeometry, orbitmaterial);
        
        orbitmesh.planet = planet;
        planet.orbit = orbitmesh;
        orbitmesh.isOrbit = true;
        orbits.push(orbitmesh);
    });
    updateorbits();
}


function removeorbits(){
    orbits.forEach(orbit => {
    scene.remove(orbit);
    });
    orbits = [];
}

createorbits(planets);

function rotateaboutsun(planet){
    planet.angle += planet.omega;
    planet.position.x = Math.cos(planet.angle) * planet.distance;
    planet.position.z = Math.sin(planet.angle) * planet.distance;
}

window.addEventListener('keydown',(e)=>{
    if(e.key === 's'){
        if(scene.currentbackground === "stars"){
            scene.background = null;
            scene.currentbackground = null;
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
            createorbits(planets);
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

function createhighlight(planet){
    if(highlight) scene.remove(highlight);
    const highlightgeo = new THREE.SphereGeometry(planet.geometry.parameters.radius+0.3);
    const highlightmat = new THREE.MeshBasicMaterial({color:0xe9e9e9,transparent:true,opacity:0.5})
    highlight = new THREE.Mesh(highlightgeo,highlightmat);
    highlightedplanet = planet;
    scene.add(highlight);
}

function updatehighlight(){

    if(highlight){
        highlight.position.set(highlightedplanet.position.x,highlightedplanet.position.y,highlightedplanet.position.z);
}}

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
        createhighlight(selected);
        if(selected != followtarget){
        document.getElementById("followmode").checked = false;
        }
        let distancecopy = selected.distance;
        let omegacopy = selected.omega;
        let ringgeometrycopy = selected.orbit.geometry;
        let radiuscopy = selected.radius;
        document.getElementById("planet-popup").style.display = 'block';
        document.getElementById("popup-title").innerText = selected.name.toUpperCase();
        document.getElementById("followmodelabel").textContent = `Follow ${capitalizeFirstLetter(selected.name)}`;
        document.getElementById("followmode").onchange = ()=>{
            if(document.getElementById("followmode").checked) followtarget = selected;
            else{ 
                followtarget = null;
                controls.enabled = true;
                camera.position.set(0,50,50);
                controls.update();
            }
        }
        document.getElementById("popup-close").onclick = () =>{
            document.getElementById("planet-popup").style.display = 'none';
            scene.remove(highlight);
            highlight = null;
            highlightedplanet = null;
        }
        document.getElementById("popup-reset").onclick = () =>{
            selected.distance = distancecopy;
            selected.orbit.geometry.dispose();
            selected.orbit.geometry = ringgeometrycopy;
            selected.omega = omegacopy;
            selected.scale.set(radiuscopy,radiuscopy,radiuscopy);
            document.getElementById("distance").value = selected.distance;
            document.getElementById("omega").value = selected.omega;
        }
        document.getElementById("distance").value = selected.distance;
        document.getElementById("omega").value = selected.omega;
        document.getElementById("radius").value = selected.radius;
        document.getElementById("distance").oninput = () =>{
            selected.distance = parseFloat(document.getElementById("distance").value);
        }
        document.getElementById("distance").onchange = () =>{
            let orbitpoints = [];
            for (let i = 0; i < 64; i++) {
                const angle = i/64 * Math.PI * 2;
                orbitpoints.push(new THREE.Vector3(
                    Math.cos(angle) * selected.distance,
                    0,
                    Math.sin(angle) * selected.distance
                ))
            }
            selected.orbit.geometry.dispose();
            selected.orbit.geometry = new THREE.BufferGeometry().setFromPoints(orbitpoints);
        }

        document.getElementById("omega").oninput = () =>{
            selected.omega = parseFloat(document.getElementById("omega").value);
        }
        // document.getElementById("radius").oninput = () =>{
        //     let radius = parseFloat(document.getElementById("radius").value);
        //     selected.scale.set(radius,radius,radius);
        // }
        document.getElementById("radius").oninput = () =>{
            let radius = parseFloat(document.getElementById("radius").value);
            selected.geometry.dispose();
            selected.geometry = new THREE.SphereGeometry(radius,32,32);
            createhighlight(selected);
        }
    }
})

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    renderer.setSize( window.innerWidth, window.innerHeight );
    camera.updateProjectionMatrix();
})

function animate(){
    if(followtarget){
        controls.enabled = false;
        camera.position.set(followtarget.position.x,followtarget.position.y+5,followtarget.position.z+5);
        camera.lookAt(followtarget.position);
    }
    sun.rotation.y -= 0.02;
    planets.forEach(rotateaboutsun);
    updatehighlight();
    renderer.render(scene,camera);
    controls.update();
}
renderer.setAnimationLoop(animate);