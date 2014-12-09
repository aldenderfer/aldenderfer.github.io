/* CelestialBody.js
 * system object creation model
 * kristof aldenderfer
 */

CelestialBody = function(name, radius, obliquity, rotationSpeed, semiMajorAxis, orbitalInclination, orbitalSpeed) {
	this.radius = radius;
	this.obliquity = obliquity;
	this.rotationSpeed = rotationSpeed;
	this.semiMajorAxis = semiMajorAxis;
	this.orbitalInclination = orbitalInclination;
	this.orbitalSpeed = orbitalSpeed;
	this.name = name;

	THREE.ImageUtils.crossOrigin = '';
	var imgTexture = THREE.ImageUtils.loadTexture( "img/textures/"+name+".jpg" || "img/textures/default.jpg");
	imgTexture.repeat.set( (Math.floor(Math.random()*4)+1), 1 ); // longitude, latitude | randomize for more interesting texturing
	imgTexture.wrapS = imgTexture.wrapT = THREE.RepeatWrapping;
	imgTexture.anisotropy = 16;
	var shininess = 50, specular = 0x333333, bumpScale = 1, shading = THREE.SmoothShading;

	var sphere = new THREE.Mesh( new THREE.SphereGeometry(radius,radius,radius), new THREE.MeshPhongMaterial( { map: imgTexture, bumpMap: imgTexture, bumpScale: bumpScale, color: 0xffffff, ambient: 0x777777, specular: specular, shininess: shininess, shading: shading } ) );
	sphere.name = name;
	sphere.position.x = semiMajorAxis;
	sphere.rotation.z = obliquity;
	var axis = new THREE.Object3D();
	axis.add(sphere);
	axis.rotation.y = Math.random()*Math.PI*2; //random starting orbital position
	axis.rotation.x = orbitalInclination;
	this.add(axis);

	this.rotate = function() {
		sphere.rotation.y = (sphere.rotation.y)%(Math.PI*2) + rotationSpeed;
	}
	this.orbit = function() {
		axis.rotation.y = (axis.rotation.y)%(Math.PI*2) + orbitalSpeed;
	}
}
CelestialBody.prototype = new THREE.Object3D();
CelestialBody.prototype.constructor = THREE.Object3D;