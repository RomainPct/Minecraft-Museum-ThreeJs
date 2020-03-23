import * as THREE from 'three'

export default class Camera {

    constructor(_scene, _sizes) {
        this.elem = new THREE.PerspectiveCamera(75, _sizes.ratio(), 0.1, 60)
        this.elem.position.z = 7.5
        this.elem.position.y = 2.5
        _scene.add(this.elem)
    }

    update(_cursor) {
        this.elem.position.z += _cursor.deltaY / 500
        this.elem.position.z = Math.min(this.elem.position.z, 10)
        this.elem.rotation.y = Math.PI * -_cursor.x * 0.6
        this.elem.rotation.x = Math.PI * -_cursor.y * 0.2
    }

    resize(_sizes) {
        this.elem.aspect = _sizes.ratio()
        this.elem.updateProjectionMatrix()
    }

}