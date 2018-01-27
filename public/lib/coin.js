var coinTexture = new THREE.TextureLoader().load('./img/coin.png');
var coinMaterial = new THREE.MeshFaceMaterial([new THREE.MeshPhongMaterial({ map: coinTexture }), new THREE.MeshPhongMaterial({ color: oxFFFF00 })]);
var coinGeometry = new THREE.CylinderGeometry(30, 30, 5, 128);
for (var i = 0; i < coinGeometry.faces.length - coinGeometry.parameters.radialSegments * 2; i++) {
    coinGeometry.faces[i].materialIndex = 0;
}
for (var i = coinGeometry.faces.length - coinGeometry.parameters.radialSegments * 2; i < coinGeometry.faces.length; i++) {
    coinGeometry.faces[i].materialIndex = 1;
}

function coinMesh(x, y, z) {
    var mesh = new THREE.Mesh(coinGeometry, coinMaterial);
    mesh.position.set(x, y, z);
    mesh.rotation.set(0, THREE.Math.degToRad(90), 0);
    return mesh;
}