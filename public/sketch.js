//System
// var frameCount = 0;

//------------------------------------------------------
//car
var speed = 50;

//------------------------------------------------------
//scene
var scene = new THREE.Scene();

var width = 600;
var height = 400;
var fov = 60;
var aspect = width / height;
var near = 1;
var far = 1001;
var camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 50);

var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setClearColor(0x000000, 0);
renderer.setSize(width, height);
document.getElementById("field").appendChild(renderer.domElement);

var directionalLight = new THREE.DirectionalLight(0xffffff);
directionalLight.position.set(0, 0.7, 0.7);
scene.add(directionalLight);

//------------------------------------------------------
//meshes
// var coins = [];

var coin = null;
var spawnTimer;
const SPAWN_COUNT = 250;

function addCoin() {
    // var coinMesh = getCoinMesh(getRandomInt(-30, 30), getRandomInt(-30, 30), -500);
    // scene.add(coinMesh);
    // var coin = {
    //     coinMesh: coinMesh,
    //     available: true
    // }
    // coins.push(coin);

    coin = getCoinMesh(getRandomInt(-30, 30), getRandomInt(-30, 30), -500);
    scene.add(coinMesh);
}

function foundCoin() {
    if (!coin) return;
    coin = null;
    spawnTimer = SPAWN_COUNT;
}

// setInterval(addCoin, 1000);

//------------------------------------------------------
//loop
(function renderLoop() {
    requestAnimationFrame(renderLoop);
    // frameCount++;
    // if (frameCount % 10 == 0) {
    //     speed = getRandomInt(30, 200);
    // }
    // for (var i = coins.length - 1; i >= 0; i--) {
    //     coins[i].coinMesh.position.z += speed * 0.02; // .000005556
    //     if (coins[i].available && coins[i].coinMesh.position.z >= 50) {
    //         coins[i].available = false;
    //     }

    //     if (!coins[i].available) {
    //         scene.remove(coins[i].coinMesh);
    //         coins.splice(i, 1);
    //     }
    // }

    speed = 1000000000000;
    coins[i].coinMesh.position.z += speed * 0.000005556;
    if (!coin) {
        if (spawnTimer <= 0) addCoin();
    } else if (coins[i].coinMesh.position.z >= 50) {
        scene.remove(coin);
        coin = null;
        spawnTimer = (SPAWN_COUNT * 0.2);
    }

    renderer.render(scene, camera);
})();

//------------------------------------------------------
//functions
function getCoinMesh(x, y, z) {
    var coinTexture = new THREE.TextureLoader().load('./img/coin.png');
    var coinMaterial = new THREE.MeshPhongMaterial({ map: coinTexture });
    var coinGeometry = new THREE.CylinderGeometry(6, 6, 1, 128);
    for (var i = 0; i < coinGeometry.faces.length - coinGeometry.parameters.radialSegments * 2; i++) {
        coinGeometry.faces[i].materialIndex = 0;
    }
    for (var i = coinGeometry.faces.length - coinGeometry.parameters.radialSegments * 2; i < coinGeometry.faces.length; i++) {
        coinGeometry.faces[i].materialIndex = 1;
    }

    var mesh = new THREE.Mesh(coinGeometry, coinMaterial);
    mesh.position.set(x, y, z);
    mesh.rotation.set(THREE.Math.degToRad(90), 0, 0);
    return mesh;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}