import '../style/main.styl'
import * as THREE from 'three'
import CubePresenters from './objects/CubePresenters.js'
import LightManager from './objects/LightManager.js'
import Floor from './objects/Floor.js'
import Camera from './objects/Camera.js'
import CloudGenerator from './objects/CloudGenerator'

const textureLoader = new THREE.TextureLoader()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: function() { return this.width / this.height }
}

/** 
 * Scene
*/
const cubesNumber = 20

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x0E050F )
scene.fog = new THREE.FogExp2(0x0E0E0E, 0.05)
const camera = new Camera(scene, sizes)

const floor = new Floor(scene, textureLoader, cubesNumber)
const cubePresenters = new CubePresenters(scene, textureLoader, cubesNumber)
const clouds = new CloudGenerator(scene, cubesNumber)
const lightManager = new LightManager(scene)

/** 
 * Renderer
*/
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)) // Pour le limiter à 2 (perf)
document.querySelector('#app').appendChild(renderer.domElement)
renderer.render(scene,camera.elem)

/** 
 * Resize
*/
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    renderer.setSize(sizes.width,sizes.height)
    camera.resize(sizes)
    renderer.render(scene,camera.elem)
})

/** 
 * Cursor
*/
const userData = {
    cursorX: 0,
    cursorY: 0,
    deltaY: 0,
    keyMoveX: 0,
    keyMoveY: 0
}
window.addEventListener('mousemove', (e) => {
    userData.cursorX = (e.clientX / sizes.width) - 0.5
    userData.cursorY = (e.clientY / sizes.height) - 0.5
})

window.addEventListener('wheel', e => userData.deltaY += e.deltaY )

window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'KeyS':
            userData.keyMoveY = 0.1
            break;
        case 'KeyW':
            userData.keyMoveY = -0.1
            break;
        case 'KeyA':
            userData.keyMoveX = -0.1
            break;
        case 'KeyD':
            userData.keyMoveX = 0.1
            break;
        case 'ArrowDown':
            userData.keyMoveY = 0.1
            break;
        case 'ArrowUp':
            userData.keyMoveY = -0.1
            break;
        case 'ArrowLeft':
            userData.keyMoveX = -0.1
            break;
        case 'ArrowRight':
            userData.keyMoveX = 0.1
            break;
        default:
            break;
    }
})
window.addEventListener('keyup', (e) => {
    if (e.code == 'ArrowDown' || e.code == 'ArrowUp' || e.code == 'KeyW' || e.code == 'KeyS') {
        userData.keyMoveY = 0
    } else if (e.code == 'ArrowLeft' || e.code == 'ArrowRight' || e.code == 'KeyA' || e.code == 'KeyD') {
        userData.keyMoveX = 0
    }
})

window.addEventListener('click', () => cubePresenters.click(camera.elem))

/** 
 * Animation
*/
const animate = () => {
    requestAnimationFrame(animate)

    cubePresenters.update()

    camera.update(userData)
    userData.deltaY = 0
    renderer.render(scene,camera.elem)
}

animate()


// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/static/draco/')
// const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)

// /** 
//  * Model import
// */
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