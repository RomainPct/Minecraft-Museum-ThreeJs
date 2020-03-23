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
const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x0E050F )
scene.fog = new THREE.FogExp2(0x0E0E0E, 0.05)
const camera = new Camera(scene, sizes)

const clouds = new CloudGenerator(scene)
const floor = new Floor(scene, textureLoader)
const cubePresenters = new CubePresenters(scene, textureLoader)
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
const cursor = {
    x: 0,
    y: 0,
    deltaY: 0
}
window.addEventListener('mousemove', (e) => {
    cursor.x = (e.clientX / sizes.width) - 0.5
    cursor.y = (e.clientY / sizes.height) - 0.5
})

window.addEventListener('wheel', (e) => {
    cursor.deltaY += e.deltaY
})

/** 
 * Animation
*/
const animate = () => {
    requestAnimationFrame(animate)

    cubePresenters.update()

    camera.update(cursor)
    cursor.deltaY = 0
    renderer.render(scene,camera.elem)
}

animate()


// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

// const dracoLoader = new DRACOLoader()
// dracoLoader.setDecoderPath('/static/draco/')
// const gltfLoader = new GLTFLoader()
// gltfLoader.setDRACOLoader(dracoLoader)

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