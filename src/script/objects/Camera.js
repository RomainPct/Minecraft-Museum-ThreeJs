import * as THREE from 'three'

export default class Camera {

    constructor(_scene, _sizes) {
        this.elem = new THREE.PerspectiveCamera(75, _sizes.ratio(), 0.1, 60)
        this.elem.position.z = 7.5
        this.elem.position.y = 2.5
        _scene.add(this.elem)
    }

    update(_userData) {
        this.elem.position.x = Math.min(Math.max(this.elem.position.x + _userData.keyMoveX, -3), 3)
        this.elem.position.z = Math.min(this.elem.position.z + (_userData.deltaY / 500) + _userData.keyMoveY, 10)
        this.elem.rotation.y = Math.PI * -_userData.cursorX * 1
        this.elem.rotation.x = Math.PI * -_userData.cursorY * 0.5
    }

    resize(_sizes) {
        this.elem.aspect = _sizes.ratio()
        this.elem.updateProjectionMatrix()
    }

}