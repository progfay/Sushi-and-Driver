//System
// var frameCount = 0;

//------------------------------------------------------
// car
var speed = 50;

//------------------------------------------------------
// scene
var scene = new THREE.Scene();

var $w = $(window),
    bw = 1200,
    bh = (bw / 16) * 9,
    w = $w.width(),
    h = $w.height(),
    width = w,
    height = Math.round(bh * (width / bw));

if (height < h) {
    height = h;
    width = Math.round(bw * (height / bh));
}

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
// meshes

var coin = null;
var spawnTimer;
const SPAWN_COUNT = 250;

function addCoin() {
    coin = getCoinMesh(getRandomInt(-30, 30), getRandomInt(-30, 30), -500);
    scene.add(coin);
}

function foundCoin() {
    if (!coin) return;
    coin = null;
    spawnTimer = SPAWN_COUNT;
}

//------------------------------------------------------
//loop
(function renderLoop() {
    requestAnimationFrame(renderLoop);
    if (!coin) {
        if (spawnTimer <= 0) addCoin();
    } else if (coin.position.z >= 50) {
        coin.position.z += vm.speed * 0.000005556;
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