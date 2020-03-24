import * as THREE from 'three'
import floorColorSource from '../../resources/minecraft_textures/block/obsidian.png'

export default class Floor {

    constructor(_scene, _textureLoader, _cubesNumber) {
        const depth = (_cubesNumber * 5) + 20
        const texture = _textureLoader.load(floorColorSource)
        texture.repeat.x = 120
        texture.repeat.y = depth
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.NearestFilter
        this.floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(120, depth),
            new THREE.MeshStandardMaterial({
                map: texture
            })
        )
        this.floor.rotation.x = Math.PI * -0.5
        this.floor.position.z = (depth * -0.5) + 20
        _scene.add(this.floor)
    }

}