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

function addCoin() {
    if (coin) scene.remove(coin);
    coin = getCoinMesh(getRandomInt(-width / 4, width / 4), getRandomInt(-height / 4, height / 4), -10000);
    scene.add(coin);
}

function foundCoin() {
    coin.position.z = 5;
}

function isCoinExist() {
    return coin.position.z >= 5;
}

//------------------------------------------------------
// loop

// let isRendering = true;
let beforeHiyari = 0;
let beforeAttendance = 0;

(function renderLoop() {
    requestAnimationFrame(renderLoop);

    let hiyariNum = vm.nearHiyari(0.05);
    let attendance = 100;
    if (!coin || coin.position.z >= 300 || hiyariNum - beforeHiyari > 0 || beforeAttendance <= 20) addCoin();

    beforeHiyari = hiyariNum;
    beforeAttendance = attendance;
    coin.position.z += (50000) * 0.0005556;
    renderer.render(scene, camera);
})();

// function renderStop() {
//     isRendering = false;
//     renderer.domElement.style.display = 'hidden';
// }

// function renderStart() {
//     isRendering = true;
//     renderer.domElement.style.display = 'display';
//     renderLoop();
// }

//------------------------------------------------------
// functions

// var texloader = new THREE.TextureLoader();
// texloader.crossOrigin = 'anonymous';
// var coinTexture = texloader.load('./coin.png');
//var coinMaterial = new THREE.MeshPhongMaterial({ map: coinTexture });
var coinMaterial = new THREE.MeshPhongMaterial({ color: 0xFFFF00 });
var coinGeometry = new THREE.CylinderGeometry(6, 6, 1, 128);

function getCoinMesh(x, y, z) {
    var mesh = new THREE.Mesh(coinGeometry, coinMaterial);
    mesh.position.set(x, y, z);
    mesh.rotation.set(THREE.Math.degToRad(90), 0, 0);
    return mesh;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}