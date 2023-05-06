import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import * as CANNON from 'cannon-es'
import { Points } from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import "./slice.js"
function randomNumber(min, max) { 
    return Math.floor(Math.random() * (max - min) + min);
} 
  
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')

const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)

let mixer = null
var eggplant = new THREE.Mesh()

// Scene
const scene = new THREE.Scene()
gltfLoader.load(
    '/models/box.glb',
    (gltf) =>
    {
        gltf.scene.scale.set(0.025, 0.025, 0.025)
        console.log("add")
        console.log(gltf.scene.children[0])
        scene.add(gltf.scene.children[0])
        // Animation
    }
)
/**
 * Debug
 */
const gui = new dat.GUI()
const debugObject = {}
//inter
function intersect(mesh,theplane,scene,points) {
    var positions = [];
    var mathPlane = new THREE.Plane();
    var intersectlines=[]
    

    var a = new THREE.Vector3(),
        b = new THREE.Vector3(),
        c = new THREE.Vector3();
    var planePointA = new THREE.Vector3(),
        planePointB = new THREE.Vector3(),
        planePointC = new THREE.Vector3();

    var pointOfIntersection = new THREE.Vector3();


    const positionAttribute = theplane.geometry.getAttribute('position');   
    const localVertex = new THREE.Vector3();

    localVertex.fromBufferAttribute(positionAttribute, 0);
    theplane.localToWorld(planePointA.copy(localVertex));
    localVertex.fromBufferAttribute(positionAttribute, 1);
    theplane.localToWorld(planePointB.copy(localVertex));
    localVertex.fromBufferAttribute(positionAttribute, 2);
    theplane.localToWorld(planePointC.copy(localVertex));
    //console.log(mathPlane,planePointA,planePointB,planePointC)
    mathPlane.setFromCoplanarPoints(planePointA, planePointB, planePointC)
    const dodecaPositionAttribute = mesh.geometry.getAttribute('position')
    console.log(dodecaPositionAttribute)//local
    for (let vertexIndex = 0; vertexIndex < dodecaPositionAttribute.count; vertexIndex += 1) {
        localVertex.fromBufferAttribute(dodecaPositionAttribute, vertexIndex);
        //console.log(localVertex)
        a.copy(localVertex);
        a.add(mesh.position)    
        //console.log(a)
        localVertex.fromBufferAttribute(dodecaPositionAttribute, vertexIndex + 1);
        b.copy(localVertex);
        b.add(mesh.position)
        
        let lineAB = new THREE.Line3(a, b);
        //draw line
        const linepoints = [];
        linepoints.push(a.clone());
        linepoints.push(b.clone());
        points.push(linepoints)
        
        //pa pb pc
        //console.log(lineAB.start.x,lineAB.start.y,lineAB.start.z,lineAB.end.x,lineAB.end.y,lineAB.end.z)
        setPointOfIntersection(lineAB, mathPlane, positions, pointOfIntersection,intersectlines);
    }
    //console.log(intersectlines)
    
    var pointsOfIntersection = new THREE.BufferGeometry();
    pointsOfIntersection.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(positions), 3));

    var pointsMaterial = new THREE.PointsMaterial({
        size: 0.01,
        color: hslToHex(100,100,100)
    });

    points = new THREE.Points(pointsOfIntersection, pointsMaterial);
    //console.log(points)
    scene.add(points)
    function setPointOfIntersection(line, myplane, positions, pointOfIntersection,intersectedlines) {
        myplane.intersectLine(line,pointOfIntersection);
        
        //console.log(line.start.x,line.start.y,line.start.z,line.end.x,line.end.y,line.end.z)
        //console.log(pointOfIntersection.x,pointOfIntersection.y,pointOfIntersection.z)
        //console.log(line)
        if (pointOfIntersection) {
            intersectedlines.push(line)
            positions.push(pointOfIntersection.x);
            positions.push(pointOfIntersection.y);
            positions.push(pointOfIntersection.z);
        };
    }
}
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}
  debugObject.addintersect=()=>{
    const geometry = new THREE.BoxBufferGeometry( 100, 100, 100 );
    const colorsAttr = geometry.attributes.position.clone();
    // Faces will be colored by vertex colors
    geometry.setAttribute('color', colorsAttr);
    const material = new THREE.MeshBasicMaterial({
        vertexColors: THREE.VertexColors
    });
    const cube = new THREE.Mesh( geometry, material );
    scene.add(cube);
  }
  
gui.add(debugObject, 'addintersect')
//inter
debugObject.add=()=>{
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
    const mesh = new THREE.Mesh( geometry, new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        wireframe: true,
    }) );
    //scene.add(mesh)
    var geo = new THREE.PlaneBufferGeometry(5, 5);
    var plane = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({
        color: "lightgray",
        transparent: true,
        opacity: 0.75,
        wireframe:true,
        side: THREE.DoubleSide
    }));
    const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        wireframe: true,
    }));
    const sphere=new THREE.Mesh(new THREE.SphereGeometry(0.5,20,20),new THREE.MeshStandardMaterial({
        color: 0x00ff00,
    }));
    
    sphere.position.copy(new THREE.Vector3(0,0.5,0.1))
    scene.add(box);
    console.log(box)
    //scene.add(mesh);
    var points=[]
    intersect(eggplant,plane,scene,points);
    console.log(points)
    for(let i =0;i<points.length;i+=1){
        
    const geometry = new THREE.BufferGeometry().setFromPoints( points[i] );
    const line = new THREE.Line( geometry,  new THREE.LineBasicMaterial( { color: hslToHex((i/points.length)*360,100,60) } ) );
    scene.add(line.clone())
    }
    
  
    



}


gui.add(debugObject, 'add')
debugObject.createSphere = () =>
{const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array( [
        -1.0, -1.0,  1.0,//a
         1.0, -1.0,  1.0,//b
         1.0,  1.0,  1.0,//c
    
         //1.0,  1.0,  1.0,//c
        -1.0,  1.0,  1.0//d
        //-1.0, -1.0,  1.0//a
    ] );
    
    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.setIndex(new THREE.BufferAttribute( new Float32Array( [
        0,0,0,0,0,0
    ] ), 1 ))
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
    const mesh = new THREE.Mesh( geometry, material );
    scene.add(mesh)
    console.log(mesh)
}

gui.add(debugObject, 'createSphere')

debugObject.createBox = () =>
{
    createBox(
        Math.random(),
        Math.random(),
        Math.random(),
        {
            x:0,
            y: 1,
            z: 0
        }
    )
}

gui.add(debugObject, 'createBox')

var index=0
debugObject.addpoint=()=>{
    var intersectionpoint = new THREE.BufferGeometry();
    intersectionpoint.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array([positions[index],positions[index+1],positions[index+2]]), 3));

    var todraw = new THREE.Points(intersectionpoint, new THREE.PointsMaterial({
        size: 0.1,
        color: 0xffff00
    }));
    objectsToUpdate[0].mesh.add(todraw);
    console.log(index,todraw.geometry.getAttribute("position"))
    index+=3
    console.log(intersectlines[index/3])
    const points = [];
    let linepoints=[intersectlines[index/3].start,intersectlines[index/3].end];
    let geometry = new THREE.BufferGeometry().setFromPoints( linepoints );
    let line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0x0000ff } ) );
    objectsToUpdate[0].mesh.add( line )
    console.log(positions.length)
    if(positions.length<index){
        index=0;
    }
}
gui.add(debugObject,"addpoint")
// Reset
debugObject.reset = () =>
{
    for(const object of objectsToUpdate)
    {
        // Remove body
        object.body.removeEventListener('collide', playHitSound)
        world.removeBody(object.body)

        // Remove mesh
        scene.remove(object.mesh)
    }
    
    objectsToUpdate.splice(0, objectsToUpdate.length)
}
gui.add(debugObject, 'reset')

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webga')


/**
 * Sounds
 */
const hitSound = new Audio('/sounds/hit.mp3')

const playHitSound = (collision) =>
{
    const impactStrength = collision.contact.getImpactVelocityAlongNormal()

    if(impactStrength > 1.5)
    {
        hitSound.volume = Math.random()
        hitSound.currentTime = 0
        hitSound.play()
    }
}

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const cubeTextureLoader = new THREE.CubeTextureLoader()

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png'
])

/**
 * Physics
 */
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, - 9.82, 0)

// Default material
const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 2,
        restitution: 0.7
    }
)
world.defaultContactMaterial = defaultContactMaterial

// Floor
const floorShape = new CANNON.Plane()
const floorBody = new CANNON.Body()
floorBody.mass = 0
floorBody.addShape(floorShape)
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(- 1, 0, 0), Math.PI * 0.5) 
world.addBody(floorBody)

/**
 * Utils
 */
const objectsToUpdate = []
// Create sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20)
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
})

const createSphere = (radius, position) =>
{
    // Three.js mesh
    const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial)
    mesh.castShadow = true
    mesh.scale.set(radius, radius, radius)
    mesh.position.copy(position)
    
    const center = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1),new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        wireframe: true,
    }))
    center.position.copy(new THREE.Vector3(0,0,0))
    mesh.add(center)
    scene.add(mesh)

    // Cannon.js body
    const shape = new CANNON.Sphere(radius)

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)

    // Save in objects
    objectsToUpdate.push({ mesh, body })
}

// Create box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5

})
const axesHelper = new THREE.AxesHelper( 5 );
scene.add( axesHelper );
const scenecenter = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1),new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    wireframe: true,
}))
scenecenter.position.copy(new THREE.Vector3(0,0,0))
scene.add(scenecenter)
const geometrya = new THREE.BufferGeometry();
const verticesa = [];
// itemSize = 3 because there are 3 values (components) per vertex
const createBox = (width, height, depth, position) =>
{
    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = 
    new THREE.MeshBasicMaterial({
        color: 0xff0000,
        wireframe: true,
    });
    const mesh = new THREE.Mesh( geometry, material );
    
    // Three.js mesh
    mesh.castShadow = true
    mesh.position.copy(position)
    
    
    const center = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1),new THREE.MeshStandardMaterial({
        color: 0x00ff00,
        wireframe: true,
    }))
    center.position.copy(new THREE.Vector3(0,0,0))
    mesh.add(center)
    scene.add(mesh)
        // Cannon.js body
    
    const shape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))

    const body = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 3, 0),
        shape: shape,
        material: defaultMaterial
    })
    
    body.position.copy(position)
    body.addEventListener('collide', playHitSound)
    world.addBody(body)
    console.log(mesh)
    // Save in objects
    objectsToUpdate.push({ mesh, body})
    /*
    mesh = new THREE.Mesh(boxGeometry, 
        new THREE.MeshBasicMaterial({
            color: 0x00ff00,
            wireframe: true,
        }))
    mesh.scale.set(0.01,0.01,0.01)
    mesh.castShadow = false
    mesh.position.copy(position)
    scene.add(mesh)
    objectsToUpdate2.push({ mesh, body})*/
}


/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
        envMapIntensity: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = - Math.PI * 0.5
scene.add(floor)
const material = new THREE.LineBasicMaterial({
	color: 0x0000ff
});

    


/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.0001,100000)
camera.position.set(- 3, 3, 3)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0
const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    // Update physics
    world.step(1 / 60, deltaTime, 3)
    
    for(const object of objectsToUpdate)
    {
        object.mesh.position.copy(object.body.position)
        object.mesh.quaternion.copy(object.body.quaternion)
    }
    //console.log(objectsToUpdate[0].body.position)

    // Update controls
    controls.update()
    // Render
    renderer.render(scene, camera)
  
    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()