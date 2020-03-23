import * as THREE from 'three'
import floorColorSource from '../../resources/minecraft_textures/block/obsidian.png'

export default class Floor {

    constructor(_scene, _textureLoader) {
        const texture = _textureLoader.load(floorColorSource)
        texture.repeat.x = 120
        texture.repeat.y = 300
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.NearestFilter
        this.floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(120,300),
            new THREE.MeshStandardMaterial({
                map: texture
            })
        )
        this.floor.rotation.x = Math.PI * -0.5
        this.floor.position.z = -20
        _scene.add(this.floor)
    }

}