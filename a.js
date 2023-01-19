let renderer
    , controls
    , scene
    , camera
    , w, h
    , statsFps
    , statsMs

resize()
init()
animate()

function rand(min, max) {
    return Math.random() * (max - min) + min
}

function resize() {
    w = document.body.clientWidth
    h = document.body.clientHeight
    if (!camera) {
        return
    }
    
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
}

function init() {
    
    scene = new THREE.Scene()//

    camera = new THREE.PerspectiveCamera(75, w / h, 1, 6000)
    camera.position.z = 70
    
    renderer = new THREE.WebGLRenderer({alpha: true})
    renderer.setSize(w, h)
    renderer.setClearColor("#0C7CA5", 0)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.sortObjects = false
    renderer.autoClear = false
    renderer.generateMipmaps = false
    
    let light = new THREE.HemisphereLight('#fff', '#eee', 50)
    light.position.set(0, 0, 300)
    light.castShadow = true
    scene.add(light)//

    light = new THREE.PointLight(0x222222, 3)
    light.position.x = 1000
    light.position.y = 500
    light.position.z = 1000
    light.castShadow = true
    scene.add(light)    //
    
    camera.lookAt(scene.position)//
    
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    document.body.appendChild(renderer.domElement)
        
    statsFps = new Stats()
    document.body.appendChild(statsFps.dom)
    
    statsMs = new Stats()
    statsMs.showPanel(1)
    document.body.appendChild(statsMs.dom)
    
    window.addEventListener('resize', resize, false)
    
    const geometry = new THREE.CylinderGeometry( 7, 7, 75, 10, 10, true );
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe:true} );
    const cylinder = new THREE.Mesh( geometry, material );

    scene.add( cylinder );

    const fvNames = [ 'a', 'b', 'c', 'd' ];
    const verteciesHash = {};
    
    let v1 = new THREE.Vector3();
    let v2 = new THREE.Vector3();
    
    let fv;
    let geom = new THREE.Geometry();

    for (let i = 0; i < geometry.faces.length; i++) {
        let face = geometry.faces[i];
        if( face.vertexNormals === undefined ) {
            continue;
        }

        for( let v = 0, vl = face.vertexNormals.length; v < vl; v ++ ) {
            
            fv = face[fvNames[v]];
            
            if (fv in verteciesHash) {
                continue;
            }
            verteciesHash[fv] = 1;
            
            v1 = geometry.vertices[fv].clone();
            v2 = face.vertexNormals[v].clone()
                .multiplyScalar(5)
                .add( v1 )
            ;
            
            geom.vertices.push(v1, v2);
        }
    }
    let arrow = new THREE.LineSegments(geom, new THREE.LineBasicMaterial({color: 0x0000ff}));
    scene.add( arrow );
}

function animate() {
    
    requestAnimationFrame(animate)
    
    update()
    
    renderer.clear()
    renderer.render(scene, camera)
    
    controls.update()
    statsFps.update()
    statsMs.update()
    
}

function update() {
    
}




function convertConvexHullToTrimesh() {
    const shape = CannonUtils.CreateTrimesh(convexHull.geometry)
    body = new CANNON.Body({ mass: 1 })
    body.allowSleep = true
    body.addShape(shape)
    body.position.x = monkey.position.x
    body.position.y = monkey.position.y
    body.position.z = monkey.position.z
    body.quaternion.x = monkey.quaternion.x
    body.quaternion.y = monkey.quaternion.y
    body.quaternion.z = monkey.quaternion.z
    body.quaternion.w = monkey.quaternion.w
    world.addBody(body)
}

function createConvexHull() {
    const position = monkey.geometry.attributes.position.array
    const points: THREE.Vector3[] = []
    for (let i = 0; i < position.length; i += 3) {
        points.push(
            new THREE.Vector3(position[i], position[i + 1], position[i + 2])
        )
    }
    const convexGeometry = new ConvexGeometry(points)
    convexHull = new THREE.Mesh(
        convexGeometry,
        new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        })
    )
    monkey.add(convexHull)

    setTimeout(() => {
        addFloor()
    }, 2000)
}










import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import {OrbitControls} from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 50, 400);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);

scene.add(new THREE.GridHelper(500, 10));

let light = new THREE.DirectionalLight(0xffffff, 1);
light.position.setScalar(1);
scene.add(light, new THREE.AmbientLight(0xffffff, 0.25));

const transportCount = 500;

let transport = [];

for(let i = 0; i < transportCount; i++){
  let structure = new THREE.Group();
  structure.userData = {
    phase: Math.PI * 2 * Math.random(),
    radius: Math.random() * 200 + 200,
    speed: Math.random() * 0.05 + 0.01,
    height: -100 + Math.random() * 200
  }
  
  let body = new THREE.Object3D();
  body.scale.set(1.5, 1, 1);
  structure.add(body);
  
  let propeller = new THREE.Object3D();
  propeller.position.z = 10;
  structure.add(propeller);
  
  //scene.add(structure);
  transport.push(structure);
  
}

let gBody = new THREE.CylinderGeometry(10, 10, 2.5, 5);
let body = new THREE.InstancedMesh(gBody, new THREE.MeshLambertMaterial(), transportCount);
let c = new THREE.Color();
for(let i = 0; i < transportCount; i++){
  body.setColorAt(i, c.set(Math.random() * 0xffffff));
}

let gPropeller = new THREE.BoxGeometry(3, 10, 0.5);
let propeller = new THREE.InstancedMesh(gPropeller, new THREE.MeshLambertMaterial({color: "yellow"}), transportCount);

scene.add(body, propeller);

let clock = new THREE.Clock();

renderer.setAnimationLoop( _ => {
  
  let t = clock.getElapsedTime();
  
  transport.forEach( (tr, trIdx) => {
    
    let angle = t * tr.userData.speed + tr.userData.phase; 
    
    tr.position.set(Math.cos(angle), 0, Math.sin(angle)).multiplyScalar(tr.userData.radius).setY(tr.userData.height);
    tr.rotation.y = -angle;
    tr.children[1].rotation.z = t * 250 * tr.userData.speed + tr.userData.phase;
    tr.updateMatrixWorld(true);
    
    body.setMatrixAt(trIdx, tr.children[0].matrixWorld);
    propeller.setMatrixAt(trIdx, tr.children[1].matrixWorld);
    
  })
  body.instanceMatrix.needsUpdate = true;
  propeller.instanceMatrix.needsUpdate = true;
  
  renderer.render(scene, camera);
})



const geometry = new THREE.BufferGeometry();
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
const vertices = new Float32Array( [
	-1.0, -1.0,  1.0,
	 1.0, -1.0,  1.0,
	 1.0,  1.0,  1.0,

	 1.0,  1.0,  1.0,
	-1.0,  1.0,  1.0,
	-1.0, -1.0,  1.0
] );

// itemSize = 3 because there are 3 values (components) per vertex
geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
const mesh = new THREE.Mesh(geometry,material);










var pointsOfIntersection = new THREE.Geometry();

var a = new THREE.Vector3(),
  b = new THREE.Vector3(),
  c = new THREE.Vector3();
var planePointA = new THREE.Vector3(),
  planePointB = new THREE.Vector3(),
  planePointC = new THREE.Vector3();
var lineAB = new THREE.Line3(),
  lineBC = new THREE.Line3(),
  lineCA = new THREE.Line3();

var pointOfIntersection = new THREE.Vector3();


function drawIntersectionPoints(plane,obj) {
    var mathPlane = new THREE.Plane();
    plane.localToWorld(planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
    plane.localToWorld(planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
    plane.localToWorld(planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
    mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);
  
    obj.geometry.faces.forEach(function(face) {
      obj.localToWorld(a.copy(obj.geometry.vertices[face.a]));
      obj.localToWorld(b.copy(obj.geometry.vertices[face.b]));
      obj.localToWorld(c.copy(obj.geometry.vertices[face.c]));
      lineAB = new THREE.Line3(a, b);
      lineBC = new THREE.Line3(b, c);
      lineCA = new THREE.Line3(c, a);
      setPointOfIntersection(lineAB, mathPlane);
      setPointOfIntersection(lineBC, mathPlane);
      setPointOfIntersection(lineCA, mathPlane);
    });
  
    var pointsMaterial = new THREE.PointsMaterial({
      size: 1,
      color: 0xffff00
    });
    var points = new THREE.Points(pointsOfIntersection, pointsMaterial);
    scene.add(points);
  
    var lines = new THREE.LineSegments(pointsOfIntersection, new THREE.LineBasicMaterial({
      color: 0xffffff
    }));
    scene.add(lines);
  }
  
  function setPointOfIntersection(line, plane) {
    pointOfIntersection = plane.intersectLine(line);
    if (pointOfIntersection) {
      pointsOfIntersection.vertices.push(pointOfIntersection.clone());
    };
  }






















var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 10, 50);
var renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var controls = new THREE.OrbitControls(camera, renderer.domElement);

scene.add(new THREE.AxisHelper(2));

var planeGeom = new THREE.PlaneGeometry(30, 30);
planeGeom.rotateX(-Math.PI / 2);
var plane = new THREE.Mesh(planeGeom, new THREE.MeshBasicMaterial({
  color: "lightgray",
  transparent: true,
  opacity: 0.75,
  side: THREE.DoubleSide
}));
plane.position.y = -3.14;
plane.rotation.x = Math.PI / 5;
scene.add(plane);

var objGeom = new THREE.DodecahedronGeometry(10, 0);
var obj = new THREE.Mesh(objGeom, new THREE.MeshBasicMaterial({
  color: "green",
  wireframe: true
}));
obj.rotation.z = Math.PI / 10;
obj.position.set(0, 3.14, 0);
scene.add(obj);

pressMe.addEventListener("click", drawIntersectionPoints, false);

var pointsOfIntersection = new THREE.Geometry();

var a = new THREE.Vector3(),
  b = new THREE.Vector3(),
  c = new THREE.Vector3();
var planePointA = new THREE.Vector3(),
  planePointB = new THREE.Vector3(),
  planePointC = new THREE.Vector3();
var lineAB = new THREE.Line3(),
  lineBC = new THREE.Line3(),
  lineCA = new THREE.Line3();

var pointOfIntersection = new THREE.Vector3();

function drawIntersectionPoints() {
  var mathPlane = new THREE.Plane();
  plane.localToWorld(planePointA.copy(plane.geometry.vertices[plane.geometry.faces[0].a]));
  plane.localToWorld(planePointB.copy(plane.geometry.vertices[plane.geometry.faces[0].b]));
  plane.localToWorld(planePointC.copy(plane.geometry.vertices[plane.geometry.faces[0].c]));
  mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC);

  obj.geometry.faces.forEach(function(face) {
    obj.localToWorld(a.copy(obj.geometry.vertices[face.a]));
    obj.localToWorld(b.copy(obj.geometry.vertices[face.b]));
    obj.localToWorld(c.copy(obj.geometry.vertices[face.c]));
    lineAB = new THREE.Line3(a, b);
    lineBC = new THREE.Line3(b, c);
    lineCA = new THREE.Line3(c, a);
    setPointOfIntersection(lineAB, mathPlane);
    setPointOfIntersection(lineBC, mathPlane);
    setPointOfIntersection(lineCA, mathPlane);
  });

  var pointsMaterial = new THREE.PointsMaterial({
    size: 1,
    color: 0xffff00
  });
  var points = new THREE.Points(pointsOfIntersection, pointsMaterial);
  scene.add(points);
                                    
  var lines = new THREE.LineSegments(pointsOfIntersection, new THREE.LineBasicMaterial({
    color: 0xffffff
  }));
  scene.add(lines);
}

function setPointOfIntersection(line, plane) {
  pointOfIntersection = plane.intersectLine(line);
  if (pointOfIntersection) {
    pointsOfIntersection.vertices.push(pointOfIntersection.clone());
  };
}


render();

function render() {
  requestAnimationFrame(render);
  renderer.render(scene, camera);
}




























/**
 * @author qiao / https://github.com/qiao
 * @author mrdoob / http://mrdoob.com
 * @author alteredq / http://alteredqualia.com/
 * @author WestLangley / http://github.com/WestLangley
 * @author erich666 / http://erichaines.com
 */
/*global THREE, console */

( function () {

	function OrbitConstraint ( object ) {

		this.object = object;

		// "target" sets the location of focus, where the object orbits around
		// and where it pans with respect to.
		this.target = new THREE.Vector3();

		// Limits to how far you can dolly in and out ( PerspectiveCamera only )
		this.minDistance = 0;
		this.maxDistance = Infinity;

		// Limits to how far you can zoom in and out ( OrthographicCamera only )
		this.minZoom = 0;
		this.maxZoom = Infinity;

		// How far you can orbit vertically, upper and lower limits.
		// Range is 0 to Math.PI radians.
		this.minPolarAngle = 0; // radians
		this.maxPolarAngle = Math.PI; // radians

		// How far you can orbit horizontally, upper and lower limits.
		// If set, must be a sub-interval of the interval [ - Math.PI, Math.PI ].
		this.minAzimuthAngle = - Infinity; // radians
		this.maxAzimuthAngle = Infinity; // radians

		// Set to true to enable damping (inertia)
		// If damping is enabled, you must call controls.update() in your animation loop
		this.enableDamping = false;
		this.dampingFactor = 0.25;

		////////////
		// internals

		var scope = this;

		var EPS = 0.000001;

		// Current position in spherical coordinate system.
		var theta;
		var phi;

		// Pending changes
		var phiDelta = 0;
		var thetaDelta = 0;
		var scale = 1;
		var panOffset = new THREE.Vector3();
		var zoomChanged = false;

		// API

		this.getPolarAngle = function () {

			return phi;

		};

		this.getAzimuthalAngle = function () {

			return theta;

		};

		this.rotateLeft = function ( angle ) {

			thetaDelta -= angle;

		};

		this.rotateUp = function ( angle ) {

			phiDelta -= angle;

		};

		// pass in distance in world space to move left
		this.panLeft = function() {

			var v = new THREE.Vector3();

			return function panLeft ( distance ) {

				var te = this.object.matrix.elements;

				// get X column of matrix
				v.set( te[ 0 ], te[ 1 ], te[ 2 ] );
				v.multiplyScalar( - distance );

				panOffset.add( v );

			};

		}();

		// pass in distance in world space to move up
		this.panUp = function() {

			var v = new THREE.Vector3();

			return function panUp ( distance ) {

				var te = this.object.matrix.elements;

				// get Y column of matrix
				v.set( te[ 4 ], te[ 5 ], te[ 6 ] );
				v.multiplyScalar( distance );

				panOffset.add( v );

			};

		}();

		// pass in x,y of change desired in pixel space,
		// right and down are positive
		this.pan = function ( deltaX, deltaY, screenWidth, screenHeight ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				// perspective
				var position = scope.object.position;
				var offset = position.clone().sub( scope.target );
				var targetDistance = offset.length();

				// half of the fov is center to top of screen
				targetDistance *= Math.tan( ( scope.object.fov / 2 ) * Math.PI / 180.0 );

				// we actually don't use screenWidth, since perspective camera is fixed to screen height
				scope.panLeft( 2 * deltaX * targetDistance / screenHeight );
				scope.panUp( 2 * deltaY * targetDistance / screenHeight );

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				// orthographic
				scope.panLeft( deltaX * ( scope.object.right - scope.object.left ) / screenWidth );
				scope.panUp( deltaY * ( scope.object.top - scope.object.bottom ) / screenHeight );

			} else {

				// camera neither orthographic or perspective
				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - pan disabled.' );

			}

		};

		this.dollyIn = function ( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale /= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom * dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );

			}

		};

		this.dollyOut = function ( dollyScale ) {

			if ( scope.object instanceof THREE.PerspectiveCamera ) {

				scale *= dollyScale;

			} else if ( scope.object instanceof THREE.OrthographicCamera ) {

				scope.object.zoom = Math.max( this.minZoom, Math.min( this.maxZoom, this.object.zoom / dollyScale ) );
				scope.object.updateProjectionMatrix();
				zoomChanged = true;

			} else {

				console.warn( 'WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled.' );

			}

		};

		this.update = function() {

			var offset = new THREE.Vector3();

			// so camera.up is the orbit axis
			var quat = new THREE.Quaternion().setFromUnitVectors( object.up, new THREE.Vector3( 0, 1, 0 ) );
			var quatInverse = quat.clone().inverse();

			var lastPosition = new THREE.Vector3();
			var lastQuaternion = new THREE.Quaternion();

			return function () {

				var position = this.object.position;

				offset.copy( position ).sub( this.target );

				// rotate offset to "y-axis-is-up" space
				offset.applyQuaternion( quat );

				// angle from z-axis around y-axis

				theta = Math.atan2( offset.x, offset.z );

				// angle from y-axis

				phi = Math.atan2( Math.sqrt( offset.x * offset.x + offset.z * offset.z ), offset.y );

				theta += thetaDelta;
				phi += phiDelta;

				// restrict theta to be between desired limits
				theta = Math.max( this.minAzimuthAngle, Math.min( this.maxAzimuthAngle, theta ) );

				// restrict phi to be between desired limits
				phi = Math.max( this.minPolarAngle, Math.min( this.maxPolarAngle, phi ) );

				// restrict phi to be betwee EPS and PI-EPS
				phi = Math.max( EPS, Math.min( Math.PI - EPS, phi ) );

				var radius = offset.length() * scale;

				// restrict radius to be between desired limits
				radius = Math.max( this.minDistance, Math.min( this.maxDistance, radius ) );

				// move target to panned location
				this.target.add( panOffset );

				offset.x = radius * Math.sin( phi ) * Math.sin( theta );
				offset.y = radius * Math.cos( phi );
				offset.z = radius * Math.sin( phi ) * Math.cos( theta );

				// rotate offset back to "camera-up-vector-is-up" space
				offset.applyQuaternion( quatInverse );

				position.copy( this.target ).add( offset );

				this.object.lookAt( this.target );

				if ( this.enableDamping === true ) {

					thetaDelta *= ( 1 - this.dampingFactor );
					phiDelta *= ( 1 - this.dampingFactor );

				} else {

					thetaDelta = 0;
					phiDelta = 0;

				}

				scale = 1;
				panOffset.set( 0, 0, 0 );

				// update condition is:
				// min(camera displacement, camera rotation in radians)^2 > EPS
				// using small-angle approximation cos(x/2) = 1 - x^2 / 8

				if ( zoomChanged ||
					 lastPosition.distanceToSquared( this.object.position ) > EPS ||
				    8 * ( 1 - lastQuaternion.dot( this.object.quaternion ) ) > EPS ) {

					lastPosition.copy( this.object.position );
					lastQuaternion.copy( this.object.quaternion );
					zoomChanged = false;

					return true;

				}

				return false;

			};

		}();

	};


	// This set of controls performs orbiting, dollying (zooming), and panning. It maintains
	// the "up" direction as +Y, unlike the TrackballControls. Touch on tablet and phones is
	// supported.
	//
	//    Orbit - left mouse / touch: one finger move
	//    Zoom - middle mouse, or mousewheel / touch: two finger spread or squish
	//    Pan - right mouse, or arrow keys / touch: three finter swipe

	THREE.OrbitControls = function ( object, domElement ) {

		var constraint = new OrbitConstraint( object );

		this.domElement = ( domElement !== undefined ) ? domElement : document;

		// API

		Object.defineProperty( this, 'constraint', {

			get: function() {

				return constraint;

			}

		} );

		this.getPolarAngle = function () {

			return constraint.getPolarAngle();

		};

		this.getAzimuthalAngle = function () {

			return constraint.getAzimuthalAngle();

		};

		// Set to false to disable this control
		this.enabled = true;

		// center is old, deprecated; use "target" instead
		this.center = this.target;

		// This option actually enables dollying in and out; left as "zoom" for
		// backwards compatibility.
		// Set to false to disable zooming
		this.enableZoom = true;
		this.zoomSpeed = 1.0;

		// Set to false to disable rotating
		this.enableRotate = true;
		this.rotateSpeed = 1.0;

		// Set to false to disable panning
		this.enablePan = true;
		this.keyPanSpeed = 7.0;	// pixels moved per arrow key push

		// Set to true to automatically rotate around the target
		// If auto-rotate is enabled, you must call controls.update() in your animation loop
		this.autoRotate = false;
		this.autoRotateSpeed = 2.0; // 30 seconds per round when fps is 60

		// Set to false to disable use of the keys
		this.enableKeys = true;

		// The four arrow keys
		this.keys = { LEFT: 37, UP: 38, RIGHT: 39, BOTTOM: 40 };

		// Mouse buttons
		this.mouseButtons = { ORBIT: THREE.MOUSE.LEFT, ZOOM: THREE.MOUSE.MIDDLE, PAN: THREE.MOUSE.RIGHT };

		////////////
		// internals

		var scope = this;

		var rotateStart = new THREE.Vector2();
		var rotateEnd = new THREE.Vector2();
		var rotateDelta = new THREE.Vector2();

		var panStart = new THREE.Vector2();
		var panEnd = new THREE.Vector2();
		var panDelta = new THREE.Vector2();

		var dollyStart = new THREE.Vector2();
		var dollyEnd = new THREE.Vector2();
		var dollyDelta = new THREE.Vector2();

		var STATE = { NONE : - 1, ROTATE : 0, DOLLY : 1, PAN : 2, TOUCH_ROTATE : 3, TOUCH_DOLLY : 4, TOUCH_PAN : 5 };

		var state = STATE.NONE;

		// for reset

		this.target0 = this.target.clone();
		this.position0 = this.object.position.clone();
		this.zoom0 = this.object.zoom;

		// events

		var changeEvent = { type: 'change' };
		var startEvent = { type: 'start' };
		var endEvent = { type: 'end' };

		// pass in x,y of change desired in pixel space,
		// right and down are positive
		function pan( deltaX, deltaY ) {

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			constraint.pan( deltaX, deltaY, element.clientWidth, element.clientHeight );

		}

		this.update = function () {

			if ( this.autoRotate && state === STATE.NONE ) {

				constraint.rotateLeft( getAutoRotationAngle() );

			}

			if ( constraint.update() === true ) {

				this.dispatchEvent( changeEvent );

			}

		};

		this.reset = function () {

			state = STATE.NONE;

			this.target.copy( this.target0 );
			this.object.position.copy( this.position0 );
			this.object.zoom = this.zoom0;

			this.object.updateProjectionMatrix();
			this.dispatchEvent( changeEvent );

			this.update();

		};

		function getAutoRotationAngle() {

			return 2 * Math.PI / 60 / 60 * scope.autoRotateSpeed;

		}

		function getZoomScale() {

			return Math.pow( 0.95, scope.zoomSpeed );

		}

		function onMouseDown( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			if ( event.button === scope.mouseButtons.ORBIT ) {

				if ( scope.enableRotate === false ) return;

				state = STATE.ROTATE;

				rotateStart.set( event.clientX, event.clientY );

			} else if ( event.button === scope.mouseButtons.ZOOM ) {

				if ( scope.enableZoom === false ) return;

				state = STATE.DOLLY;

				dollyStart.set( event.clientX, event.clientY );

			} else if ( event.button === scope.mouseButtons.PAN ) {

				if ( scope.enablePan === false ) return;

				state = STATE.PAN;

				panStart.set( event.clientX, event.clientY );

			}

			if ( state !== STATE.NONE ) {

				document.addEventListener( 'mousemove', onMouseMove, false );
				document.addEventListener( 'mouseup', onMouseUp, false );
				scope.dispatchEvent( startEvent );

			}

		}

		function onMouseMove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			if ( state === STATE.ROTATE ) {

				if ( scope.enableRotate === false ) return;

				rotateEnd.set( event.clientX, event.clientY );
				rotateDelta.subVectors( rotateEnd, rotateStart );

				// rotating across whole screen goes 360 degrees around
				constraint.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );

				// rotating up and down along whole screen attempts to go 360, but limited to 180
				constraint.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

				rotateStart.copy( rotateEnd );

			} else if ( state === STATE.DOLLY ) {

				if ( scope.enableZoom === false ) return;

				dollyEnd.set( event.clientX, event.clientY );
				dollyDelta.subVectors( dollyEnd, dollyStart );

				if ( dollyDelta.y > 0 ) {

					constraint.dollyIn( getZoomScale() );

				} else if ( dollyDelta.y < 0 ) {

					constraint.dollyOut( getZoomScale() );

				}

				dollyStart.copy( dollyEnd );

			} else if ( state === STATE.PAN ) {

				if ( scope.enablePan === false ) return;

				panEnd.set( event.clientX, event.clientY );
				panDelta.subVectors( panEnd, panStart );

				pan( panDelta.x, panDelta.y );

				panStart.copy( panEnd );

			}

			if ( state !== STATE.NONE ) scope.update();

		}

		function onMouseUp( /* event */ ) {

			if ( scope.enabled === false ) return;

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );
			scope.dispatchEvent( endEvent );
			state = STATE.NONE;

		}

		function onMouseWheel( event ) {

			if ( scope.enabled === false || scope.enableZoom === false || state !== STATE.NONE ) return;

			event.preventDefault();
			event.stopPropagation();

			var delta = 0;

			if ( event.wheelDelta !== undefined ) {

				// WebKit / Opera / Explorer 9

				delta = event.wheelDelta;

			} else if ( event.detail !== undefined ) {

				// Firefox

				delta = - event.detail;

			}

			if ( delta > 0 ) {

				constraint.dollyOut( getZoomScale() );

			} else if ( delta < 0 ) {

				constraint.dollyIn( getZoomScale() );

			}

			scope.update();
			scope.dispatchEvent( startEvent );
			scope.dispatchEvent( endEvent );

		}

		function onKeyDown( event ) {

			if ( scope.enabled === false || scope.enableKeys === false || scope.enablePan === false ) return;

			switch ( event.keyCode ) {

				case scope.keys.UP:
					pan( 0, scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.BOTTOM:
					pan( 0, - scope.keyPanSpeed );
					scope.update();
					break;

				case scope.keys.LEFT:
					pan( scope.keyPanSpeed, 0 );
					scope.update();
					break;

				case scope.keys.RIGHT:
					pan( - scope.keyPanSpeed, 0 );
					scope.update();
					break;

			}

		}

		function touchstart( event ) {

			if ( scope.enabled === false ) return;

			switch ( event.touches.length ) {

				case 1:	// one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;

					state = STATE.TOUCH_ROTATE;

					rotateStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
					break;

				case 2:	// two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;

					state = STATE.TOUCH_DOLLY;

					var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
					var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
					var distance = Math.sqrt( dx * dx + dy * dy );
					dollyStart.set( 0, distance );
					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;

					state = STATE.TOUCH_PAN;

					panStart.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
					break;

				default:

					state = STATE.NONE;

			}

			if ( state !== STATE.NONE ) scope.dispatchEvent( startEvent );

		}

		function touchmove( event ) {

			if ( scope.enabled === false ) return;

			event.preventDefault();
			event.stopPropagation();

			var element = scope.domElement === document ? scope.domElement.body : scope.domElement;

			switch ( event.touches.length ) {

				case 1: // one-fingered touch: rotate

					if ( scope.enableRotate === false ) return;
					if ( state !== STATE.TOUCH_ROTATE ) return;

					rotateEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
					rotateDelta.subVectors( rotateEnd, rotateStart );

					// rotating across whole screen goes 360 degrees around
					constraint.rotateLeft( 2 * Math.PI * rotateDelta.x / element.clientWidth * scope.rotateSpeed );
					// rotating up and down along whole screen attempts to go 360, but limited to 180
					constraint.rotateUp( 2 * Math.PI * rotateDelta.y / element.clientHeight * scope.rotateSpeed );

					rotateStart.copy( rotateEnd );

					scope.update();
					break;

				case 2: // two-fingered touch: dolly

					if ( scope.enableZoom === false ) return;
					if ( state !== STATE.TOUCH_DOLLY ) return;

					var dx = event.touches[ 0 ].pageX - event.touches[ 1 ].pageX;
					var dy = event.touches[ 0 ].pageY - event.touches[ 1 ].pageY;
					var distance = Math.sqrt( dx * dx + dy * dy );

					dollyEnd.set( 0, distance );
					dollyDelta.subVectors( dollyEnd, dollyStart );

					if ( dollyDelta.y > 0 ) {

						constraint.dollyOut( getZoomScale() );

					} else if ( dollyDelta.y < 0 ) {

						constraint.dollyIn( getZoomScale() );

					}

					dollyStart.copy( dollyEnd );

					scope.update();
					break;

				case 3: // three-fingered touch: pan

					if ( scope.enablePan === false ) return;
					if ( state !== STATE.TOUCH_PAN ) return;

					panEnd.set( event.touches[ 0 ].pageX, event.touches[ 0 ].pageY );
					panDelta.subVectors( panEnd, panStart );

					pan( panDelta.x, panDelta.y );

					panStart.copy( panEnd );

					scope.update();
					break;

				default:

					state = STATE.NONE;

			}

		}

		function touchend( /* event */ ) {

			if ( scope.enabled === false ) return;

			scope.dispatchEvent( endEvent );
			state = STATE.NONE;

		}

		function contextmenu( event ) {

			event.preventDefault();

		}

		this.dispose = function() {

			this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
			this.domElement.removeEventListener( 'mousedown', onMouseDown, false );
			this.domElement.removeEventListener( 'mousewheel', onMouseWheel, false );
			this.domElement.removeEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox

			this.domElement.removeEventListener( 'touchstart', touchstart, false );
			this.domElement.removeEventListener( 'touchend', touchend, false );
			this.domElement.removeEventListener( 'touchmove', touchmove, false );

			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'mouseup', onMouseUp, false );

			window.removeEventListener( 'keydown', onKeyDown, false );

		}

		this.domElement.addEventListener( 'contextmenu', contextmenu, false );

		this.domElement.addEventListener( 'mousedown', onMouseDown, false );
		this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
		this.domElement.addEventListener( 'MozMousePixelScroll', onMouseWheel, false ); // firefox

		this.domElement.addEventListener( 'touchstart', touchstart, false );
		this.domElement.addEventListener( 'touchend', touchend, false );
		this.domElement.addEventListener( 'touchmove', touchmove, false );

		window.addEventListener( 'keydown', onKeyDown, false );

		// force an update at start
		this.update();

	};

	THREE.OrbitControls.prototype = Object.create( THREE.EventDispatcher.prototype );
	THREE.OrbitControls.prototype.constructor = THREE.OrbitControls;

	Object.defineProperties( THREE.OrbitControls.prototype, {

		object: {

			get: function () {

				return this.constraint.object;

			}

		},

		target: {

			get: function () {

				return this.constraint.target;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: target is now immutable. Use target.set() instead.' );
				this.constraint.target.copy( value );

			}

		},

		minDistance : {

			get: function () {

				return this.constraint.minDistance;

			},

			set: function ( value ) {

				this.constraint.minDistance = value;

			}

		},

		maxDistance : {

			get: function () {

				return this.constraint.maxDistance;

			},

			set: function ( value ) {

				this.constraint.maxDistance = value;

			}

		},

		minZoom : {

			get: function () {

				return this.constraint.minZoom;

			},

			set: function ( value ) {

				this.constraint.minZoom = value;

			}

		},

		maxZoom : {

			get: function () {

				return this.constraint.maxZoom;

			},

			set: function ( value ) {

				this.constraint.maxZoom = value;

			}

		},

		minPolarAngle : {

			get: function () {

				return this.constraint.minPolarAngle;

			},

			set: function ( value ) {

				this.constraint.minPolarAngle = value;

			}

		},

		maxPolarAngle : {

			get: function () {

				return this.constraint.maxPolarAngle;

			},

			set: function ( value ) {

				this.constraint.maxPolarAngle = value;

			}

		},

		minAzimuthAngle : {

			get: function () {

				return this.constraint.minAzimuthAngle;

			},

			set: function ( value ) {

				this.constraint.minAzimuthAngle = value;

			}

		},

		maxAzimuthAngle : {

			get: function () {

				return this.constraint.maxAzimuthAngle;

			},

			set: function ( value ) {

				this.constraint.maxAzimuthAngle = value;

			}

		},

		enableDamping : {

			get: function () {

				return this.constraint.enableDamping;

			},

			set: function ( value ) {

				this.constraint.enableDamping = value;

			}

		},

		dampingFactor : {

			get: function () {

				return this.constraint.dampingFactor;

			},

			set: function ( value ) {

				this.constraint.dampingFactor = value;

			}

		},

		// backward compatibility

		noZoom: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				return ! this.enableZoom;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noZoom has been deprecated. Use .enableZoom instead.' );
				this.enableZoom = ! value;

			}

		},

		noRotate: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				return ! this.enableRotate;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noRotate has been deprecated. Use .enableRotate instead.' );
				this.enableRotate = ! value;

			}

		},

		noPan: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				return ! this.enablePan;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noPan has been deprecated. Use .enablePan instead.' );
				this.enablePan = ! value;

			}

		},

		noKeys: {

			get: function () {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				return ! this.enableKeys;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .noKeys has been deprecated. Use .enableKeys instead.' );
				this.enableKeys = ! value;

			}

		},

		staticMoving : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				return ! this.constraint.enableDamping;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .staticMoving has been deprecated. Use .enableDamping instead.' );
				this.constraint.enableDamping = ! value;

			}

		},

		dynamicDampingFactor : {

			get: function () {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				return this.constraint.dampingFactor;

			},

			set: function ( value ) {

				console.warn( 'THREE.OrbitControls: .dynamicDampingFactor has been renamed. Use .dampingFactor instead.' );
				this.constraint.dampingFactor = value;

			}

		}

	} );

}() );
