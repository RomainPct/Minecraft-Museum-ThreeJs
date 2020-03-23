import * as THREE from 'three'

export default class Floor {

    constructor(_scene) {
        this.floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(120,300),
            new THREE.MeshStandardMaterial()
        )
        this.floor.rotation.x = Math.PI * -0.5
        this.floor.position.z = -20
        _scene.add(this.floor)
    }

}