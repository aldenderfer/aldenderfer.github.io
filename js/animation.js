/* animation.js
 * system javascript control
 * kristof aldenderfer
 */

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer, cameraTarget, pos, tweening = false;
var mouse = new THREE.Vector2();
var intersects, INTERSECTED;
var system, planet, particleLight;

init();

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 15000 );
	camera.position.z = 2000;
	system = new THREE.Object3D();
	system.name="system";
	scene.add(system);
	scene.add(camera);
	camera.target = scene.position.clone();
	cameraTarget = system;

	mouse.x = 0; mouse.y = 0;

	var planets = ["teaching", "projects", "services", "contact"];
	for (var i=0 ; i<planets.length ; i++) {
		// 							name	radius	obliquity	rotationSpeed	semiMajorAxis	orbitalInclination	orbitalSpeed
		planet = new CelestialBody(planets[i],(Math.floor(Math.random()*40)+40),(Math.random()-0.5),(Math.random()*0.01),(200+300*i),(Math.random()-0.5),(Math.random()*0.005));
		system.add(planet);
	}
	pos = new THREE.Vector3();
	var geometry = new THREE.Geometry();
	for ( var i = 0; i < 20000; i ++ ) {
		var phi = Math.random()*Math.PI;
		var theta = Math.random()*Math.PI*2;
		var object = new THREE.Vector3();
		object.x = 10000 * Math.cos( theta ) * Math.sin( phi );
		object.y = 10000 * Math.sin( theta ) * Math.sin( phi );
		object.z = 10000 * Math.cos( phi );
		geometry.vertices.push( object );
	} 
	var celestialSphere = new THREE.ParticleSystem( geometry, new THREE.ParticleSystemMaterial( { color: 0x888888 } ) );
	scene.add( celestialSphere );

	var textureFlare0 = THREE.ImageUtils.loadTexture( "img/lensflare/lensflare0.png" );
	var textureFlare2 = THREE.ImageUtils.loadTexture( "img/lensflare/lensflare2.png" );
	var textureFlare3 = THREE.ImageUtils.loadTexture( "img/lensflare/lensflare3.png" );
	scene.add( new THREE.PointLight( 0xffffff, 1.5, 2000));
	var flareColor = new THREE.Color( 0xffffff );
	flareColor.setHSL( 0.55, 0.9, 0.5 + 0.5 );
	var lensFlare = new THREE.LensFlare( textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare2, 512, 0.0, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 60, 0.6, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 0.7, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 120, 0.9, THREE.AdditiveBlending );
	lensFlare.add( textureFlare3, 70, 1.0, THREE.AdditiveBlending );
	lensFlare.customUpdateCallback = lensFlareUpdateCallback;
	scene.add( lensFlare );

	projector = new THREE.Projector();
	renderer = new THREE.WebGLRenderer( { antialias: true, gammaInput: true, gammaOutput: true, autoClear: false, alpha: true} );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.domElement.style.position = "relative";
	document.getElementById('system').appendChild( renderer.domElement );

	window.addEventListener( 'resize', onWindowResize, false );
	document.addEventListener( 'keydown', onKeyDown, false );
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	document.addEventListener( 'mousemove', onDocumentMouseMove, false );
	render();
}
//===============================================================================
function onKeyDown ( event ) {
	switch( event.keyCode ) {
		case 27: /*ESC*/
			if (cameraTarget.name != "system") {
				cameraTarget = system;
				pageHandler(cameraTarget);
			}
			break;
	}
}
function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}
function onDocumentMouseDown( event ) {
	event.preventDefault();
	if (cameraTarget.name == "system") {
		raycast();
		if (intersects.length > 0 ) {
			cameraTarget = intersects[0].object;
			pageHandler(cameraTarget);
		}
	}
}
function onWindowResize( event ) {
	renderer.setSize( window.innerWidth, window.innerHeight );
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}
//=================================================================================
function lensFlareUpdateCallback( object ) {
	var f, fl = object.lensFlares.length;
	var flare;
	var vecX = -object.positionScreen.x * 2;
	var vecY = -object.positionScreen.y * 2;

	for( f = 0; f < fl; f++ ) {
		   flare = object.lensFlares[ f ];
		   flare.x = object.positionScreen.x + vecX * flare.distance;
		   flare.y = object.positionScreen.y + vecY * flare.distance;
		   flare.rotation = 0;
	}
	object.lensFlares[ 2 ].y += 0.025;
	object.lensFlares[ 3 ].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad( 45 );
}
//=====================================================================================
function raycast() {
	var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
	projector.unprojectVector( vector, camera );
	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
	intersects = raycaster.intersectObjects( system.children, true );
}
function render() {
	requestAnimationFrame( render );
	TWEEN.update();
	if (!tweening) {
		for (var child of system.children) {
			if (child instanceof CelestialBody) {
				child.rotate();
				child.orbit();
			}
		}
		if (cameraTarget.name!="system") {
			pos.setFromMatrixPosition(cameraTarget.matrixWorld);
			camera.position.x = pos.x-cameraTarget.geometry.radius*2;
			camera.position.y = pos.y-cameraTarget.geometry.radius*2;
			camera.position.z = pos.z-cameraTarget.geometry.radius*2;
			camera.target = pos.clone();
			camera.lookAt(camera.target);
		}
		if (document.getElementById("container").innerHTML == "") {
			raycast();
			if (intersects.length > 0) {
				if (INTERSECTED != intersects[ 0 ].object) {
					if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
					INTERSECTED = intersects[ 0 ].object;
					INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
					INTERSECTED.material.emissive.setHex( 0x666666 );
					document.getElementById("rollover").innerHTML = INTERSECTED.name;
				}
			} 
			else {
				if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
				INTERSECTED = null;
				document.getElementById("rollover").innerHTML = "";
			}
		}
	}
	renderer.render( scene, camera );
}