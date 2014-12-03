CelestialBody = function(name, radius, obliquity, rotationSpeed, semiMajorAxis, orbitalInclination, orbitalSpeed) {
	this.radius = radius;
	this.obliquity = obliquity;
	this.rotationSpeed = rotationSpeed;
	this.semiMajorAxis = semiMajorAxis;
	this.orbitalInclination = orbitalInclination;
	this.orbitalSpeed = orbitalSpeed;

	THREE.ImageUtils.crossOrigin = '';
	var imgTexture = THREE.ImageUtils.loadTexture( "img/planets/"+name+".jpg" || "img/planets/default.jpg");
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

	var moons = [];
	for (var i=0 ; i<4 ; i++) {
		var r = Math.floor(Math.random()*5+5);
		var s = new THREE.Mesh( new THREE.SphereGeometry(r,r,r), new THREE.MeshPhongMaterial( { map: imgTexture, bumpMap: imgTexture, bumpScale: bumpScale, color: 0xffffff, ambient: 0x777777, specular: specular, shininess: shininess, shading: shading } ) );
		s.position.x = radius+r;
		var moon = new THREE.Object3D();
		moon.add(s);
		moon.rotation.y = Math.random()*Math.PI*2;
		sphere.add(moon);
		moons[i] = moon;
	}
	this.rotate = function() {
		sphere.rotation.y = (sphere.rotation.y)%(Math.PI*2) + rotationSpeed;
	}
	this.orbit = function() {
		axis.rotation.y = (axis.rotation.y)%(Math.PI*2) + orbitalSpeed;
	}
	this.sphere = function() {
		return sphere;
	}
	this.moons = function() {
		for (moon of moons) {
			moon.rotation.y = (moon.rotation.y)%(Math.PI*2) + 0.02;
		}
	}
}
CelestialBody.prototype = new THREE.Object3D();
CelestialBody.prototype.constructor = THREE.Object3D;