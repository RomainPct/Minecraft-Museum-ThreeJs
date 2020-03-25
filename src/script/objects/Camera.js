import * as THREE from 'three'

export default class Camera {

    constructor(_scene, _sizes) {
        this.elem = new THREE.PerspectiveCamera(75, _sizes.ratio(), 0.1, 100)
        this.elem.position.z = 7.5
        this.elem.position.y = 2.5
        this.elem.rotation.order = 'YXZ'
        _scene.add(this.elem)
    }

    update(_userData, _sizes, _cubesNumber) {
        this.elem.rotation.y = Math.PI * -((_userData.cursorX / _sizes.width) - 0.5) * 1
        this.elem.rotation.x = Math.PI * -((_userData.cursorY / _sizes.height) - 0.5) * 0.5
        let newPosZ = this.elem.position.z
        let newPosX = this.elem.position.x
        if (_userData.deltaY !== 0) {
            // Scroll Nav
            newPosZ += _userData.deltaY / 500
        } else {
            // Keyboard nav
            if (_userData.keyMoveY !== 0) {
                newPosX += Math.sin(this.elem.rotation.y) * _userData.keyMoveY
                newPosZ += Math.cos(this.elem.rotation.y) * _userData.keyMoveY
            }
            if (_userData.keyMoveX !== 0) {
                newPosX += Math.cos(this.elem.rotation.y) * _userData.keyMoveX
                newPosZ -= Math.sin(this.elem.rotation.y) * _userData.keyMoveX
            }
        }
        this.elem.position.z = Math.max(Math.min(newPosZ, 18), (_cubesNumber * -5) + 2)
        this.elem.position.x = Math.min(Math.max(newPosX, -3), 3)
    }

    resize(_sizes) {
        this.elem.aspect = _sizes.ratio()
        this.elem.updateProjectionMatrix()
    }

}