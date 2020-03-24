import * as THREE from 'three'
import floorColorSource from '../../resources/minecraft_textures/block/obsidian.png'

export default class Floor {

    constructor(_scene, _textureLoader, _cubesNumber) {
        const depth = (_cubesNumber * 5) + 20

        this.floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(120, depth),
            this.getFloorMaterial(depth, _textureLoader)
        )
        this.floor.rotation.x = Math.PI * -0.5
        this.floor.position.z = (depth * -0.5) + 20
        _scene.add(this.floor)

        const leftSide = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.99, 0.5, depth),
            this.getSideMaterial(depth, _textureLoader)
        )
        leftSide.position.z = (depth * -0.5) + 20
        leftSide.position.x = -4
        _scene.add(leftSide)
        const rightSide = leftSide.clone()
        rightSide.position.x = 4
        _scene.add(rightSide)
    }

    getFloorMaterial(_depth, _textureLoader) {
        const texture = _textureLoader.load(floorColorSource)
        texture.repeat.x = 120
        texture.repeat.y = _depth
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.NearestFilter
        return new THREE.MeshStandardMaterial({ map: texture })
    }

    getSideMaterial(_depth, _textureLoader) {
        // const texture = _textureLoader.load(floorColorSource)
        // texture.repeat.x = 120
        // texture.repeat.y = _depth
        // texture.wrapS = THREE.RepeatWrapping
        // texture.wrapT = THREE.RepeatWrapping
        // texture.magFilter = THREE.NearestFilter
        // texture.minFilter = THREE.NearestFilte
        return new THREE.MeshStandardMaterial({ color: 0xffffff })
    }

}