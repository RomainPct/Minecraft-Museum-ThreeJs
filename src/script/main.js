import '../style/main.styl'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/static/draco/')
// const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: function() {
        return this.width / this.height
    }
}

/** 
 * Scene
*/
const scene = new THREE.Scene()

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.ratio(), 0.1, 40)
camera.position.z = 5
camera.position.y = 1
scene.add(camera)

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50,50),
    new THREE.MeshNormalMaterial()
)
floor.rotation.x = Math.PI * -0.5
floor.position.z = -20
scene.add(floor)

/**
 * Cube presenter
 */
const presenterGroup = new THREE.Group()
presenterGroup.position.y = 0.6

const presenter = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.5,1.2,0.5),
    new THREE.MeshNormalMaterial()
)
presenterGroup.add(presenter)
const minecraftCube = new THREE.Mesh(
    new THREE.BoxBufferGeometry(0.7,0.7,0.7),
    new THREE.MeshNormalMaterial()
)
minecraftCube.rotation.x = Math.PI * 0.25
minecraftCube.rotation.y = Math.PI * 0.25
minecraftCube.position.y = 1.5
presenterGroup.add(minecraftCube)

for (let i = 0; i < 30; i++) {
    const rightPresenter = presenterGroup.clone()
    rightPresenter.position.x = 3
    rightPresenter.position.z = -i * 10
    scene.add(rightPresenter)
    const leftPresenter = presenterGroup.clone()
    leftPresenter.position.x = -3
    leftPresenter.position.z = -i * 10
    scene.add(leftPresenter)
}

/** 
 * Model import
*/
// gltfLoader.load(
//     '/static/duck/glTF-Draco/Duck.gltf',
//     (gltf) => {
//         while (gltf.scene.children.length) {
//             const child = gltf.scene.children[0]
//             child.position.y = -1
//             scene.add(child)
//         }
//     },
//     (progress) => {
//         console.log('progress', progress);
//     },
//     (error) => {
//         console.log('error', error);
//     }
// )

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.x = 5
directionalLight.position.y = 5
directionalLight.position.z = 5
scene.add(directionalLight)

/** 
 * Renderer
*/
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)) // Pour le limiter à 2 (perf)

document.querySelector('#app').appendChild(renderer.domElement)
renderer.render(scene,camera)

/** 
 * Camera controls
*/
const cameraControls = new OrbitControls(camera, renderer.domElement)
cameraControls.zoomSpeed = 0.3
cameraControls.enableDamping = true
cameraControls.dampingFactor = 0.1

/** 
 * Resize
*/
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    renderer.setSize(sizes.width,sizes.height)
    camera.aspect = sizes.ratio()
    camera.updateProjectionMatrix()
    renderer.render(scene,camera)
})

/** 
 * Cursor
*/
const cursor = {
    x: 0,
    y: 0
}
window.addEventListener('mousemove', (e) => {
    cursor.x = (e.clientX / sizes.width) - 0.5
    cursor.y = (e.clientY / sizes.height) - 0.5
})

/** 
 * Animation
*/
const animate = () => {
    requestAnimationFrame(animate)

    // camera.position.x = cursor.x
    // camera.position.y = 1 + cursor.y
    cameraControls.update()
    renderer.render(scene,camera)
}

animate()