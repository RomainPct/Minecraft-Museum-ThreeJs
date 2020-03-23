import * as THREE from 'three'

export default class LightManager {

    constructor(_scene) {
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
        _scene.add(this.ambientLight)

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        this.directionalLight.position.x = 5
        this.directionalLight.position.y = 5
        this.directionalLight.position.z = 5
        _scene.add(this.directionalLight)
    }

}