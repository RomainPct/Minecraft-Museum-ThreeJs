import * as THREE from 'three'

export default class LightManager {

    constructor(_scene) {
        /**
         * Ambient
         */
        this.ambientLight = new THREE.AmbientLight(0xffffaa, 0.6)
        _scene.add(this.ambientLight)

        /**
         * Presenter light from bottom
         */
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        this.directionalLight.position.y = 2
        this.directionalLight.target.position.y = 20
        _scene.add(this.directionalLight)
        _scene.add(this.directionalLight.target);

        /**
         * First person light
         */
        this.userLight = new THREE.DirectionalLight(0xffff66, 0.5)
        this.userLight.position.y = 2.5
        this.userLight.position.z = 7.5
        _scene.add(this.userLight)

    }

}