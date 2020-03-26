import '../style/main.styl'
import * as THREE from 'three'
import io from 'socket.io-client'

import Map from './mapGeneration/Map.js'
import CubePresenters from './objects/CubePresenters.js'
import LightManager from './objects/LightManager.js'
import Floor from './objects/Floor.js'
import Camera from './objects/Camera.js'
import CloudGenerator from './objects/CloudGenerator.js'
import Characters from './objects/Characters.js'

const cubesNumber = 73

const textureLoader = new THREE.TextureLoader()
const container = document.querySelector('#app')

/**
 * Popup info
 */
const detailPopup = document.querySelector('#js-blockDetailPopup')

detailPopup.addEventListener('click', () => {
    detailPopup.classList.remove('open')
    // renderer.domElement.requestPointerLock()
})

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
    ratio: function() { return this.width / this.height }
}

/**
 * Welcome screen and pointer lock
 */
const welcomeScreen = document.querySelector('#js-welcomeScreen')
const playForm = welcomeScreen.querySelector('#js-playForm')
const nameInput = playForm.querySelector('#js-nameInput')
let canvasIsFocused = false

document.exitPointerLock()
playForm.addEventListener('submit', (e) => {
    e.preventDefault()
    socket.emit('new_player', {
        name: encodeURIComponent(nameInput.value),
        x: camera.elem.position.x,
        z: camera.elem.position.z,
        rotY: camera.elem.rotation.y,
        rotX: camera.elem.rotation.x
    })
    canvasIsFocused = true
    renderer.domElement.requestPointerLock = renderer.domElement.requestPointerLock || renderer.domElement.mozRequestPointerLock || renderer.domElement.webkitPointerLockElement
    renderer.domElement.requestPointerLock()
    welcomeScreen.classList.add('hidden')
    nameInput.setAttribute('disabled','true')
})

// document.pointerLockElement = document.pointerLockElement || document.mozPointerLockElement || document.webkitPointerLockElement
function pointerLockChange() {
    if (!!document.pointerLockElement) {
        canvasIsFocused = true
    } else {
        canvasIsFocused = false
        welcomeScreen.classList.remove('hidden')
    }
}
document.addEventListener('pointerlockchange', pointerLockChange, false)
document.addEventListener('mozpointerlockchange', pointerLockChange, false)
document.addEventListener('webkitpointerlockchange', pointerLockChange, false)

/** 
 * Scene
*/
const skyColor = 0x2d99fc
const scene = new THREE.Scene()
scene.background = new THREE.Color(skyColor)
scene.fog = new THREE.FogExp2(0x9FD0FD, 0.03)
const camera = new Camera(scene, sizes)

const floor = new Floor(scene, textureLoader, cubesNumber)
const cubePresenters = new CubePresenters(scene, textureLoader, cubesNumber, detailPopup)
const clouds = new CloudGenerator(scene, cubesNumber)
// const islands = new Islands(scene, textureLoader, cubesNumber)
const lightManager = new LightManager(scene)
const characters = new Characters(scene, textureLoader)
const map = new Map(scene, textureLoader, cubesNumber)

/** 
 * Renderer
*/
const renderer = new THREE.WebGLRenderer()
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)) // Pour le limiter à 2 (perf)
container.appendChild(renderer.domElement)
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
    cursorX: sizes.width / 2,
    cursorY: sizes.height / 2,
    deltaY: 0,
    keyMoveX: 0,
    keyMoveY: 0
}
document.addEventListener('mousemove', (e) => {
    if (canvasIsFocused) {
        userData.cursorX += e.movementX
        userData.cursorY += e.movementY
    }
})

window.addEventListener('wheel', (e) => {
    if (canvasIsFocused) {
        userData.deltaY += e.deltaY
    }
})

window.addEventListener('keydown', (e) => {
    if (!canvasIsFocused) { return }
    detailPopup.classList.remove('open')
    switch (e.code) {
        case 'KeyS':
            userData.keyMoveY = 0.2
            break;
        case 'KeyW':
            userData.keyMoveY = -0.2
            break;
        case 'KeyA':
            userData.keyMoveX = -0.2
            break;
        case 'KeyD':
            userData.keyMoveX = 0.2
            break;
        case 'ArrowDown':
            userData.keyMoveY = 0.2
            break;
        case 'ArrowUp':
            userData.keyMoveY = -0.2
            break;
        case 'ArrowLeft':
            userData.keyMoveX = -0.2
            break;
        case 'ArrowRight':
            userData.keyMoveX = 0.2
            break;
        default:
            break;
    }
})
window.addEventListener('keyup', (e) => {
    if (!canvasIsFocused) { return }
    if (e.code == 'ArrowDown' || e.code == 'ArrowUp' || e.code == 'KeyW' || e.code == 'KeyS') {
        userData.keyMoveY = 0
    } else if (e.code == 'ArrowLeft' || e.code == 'ArrowRight' || e.code == 'KeyA' || e.code == 'KeyD') {
        userData.keyMoveX = 0
    }
})

window.addEventListener('click', () => {
    if (canvasIsFocused) {
        cubePresenters.click(camera.elem, socket)
    }
})

/** 
 * Animation
*/
const animate = () => {
    requestAnimationFrame(animate)

    cubePresenters.update()

    if (canvasIsFocused) {
        const oldPos = {
            x: camera.elem.position.x,
            z: camera.elem.position.z,
            rotY: camera.elem.rotation.y,
            rotX: camera.elem.rotation.x
        }
        camera.update(userData, sizes, cubesNumber)
        const newPos = {
            x: camera.elem.position.x,
            z: camera.elem.position.z,
            rotY: camera.elem.rotation.y,
            rotX: camera.elem.rotation.x
        }
        if (oldPos.x != newPos.x || oldPos.y != newPos.y || oldPos.rotY != newPos.rotY || oldPos.rotX != newPos.rotX ) {
            socket.emit('update_my_position', newPos)
        }
    }
    userData.deltaY = 0
    renderer.render(scene,camera.elem)
}

animate()

// const socket = io.connect('http://localhost:8081')
const socket = io.connect('http://37.187.0.208:8081')
// console.log(socket)

socket.on('init', (players) => {
    Object.keys(players).forEach(key => {
        if (typeof players[key] === 'object' && players[key].id != socket.id) {
            characters.updatePlayer(players[key])
        }
    })
})
socket.on('positions_update', (player) => {
    characters.updatePlayer(player)
})
socket.on('player_disconnected', (player_id) => {
    // console.log('Remove player with id', player_id)
    characters.removePlayerWithId(player_id)
})
socket.on('block_click', (block_id) => {
    // console.log('Block click', block_id)
    cubePresenters.animBlockClick(block_id)
})