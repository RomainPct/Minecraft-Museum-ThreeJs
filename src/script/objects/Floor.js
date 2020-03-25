import * as THREE from 'three'
import floorColorSource from '../../../static/blocks/19_inner.png'

export default class Floor {

    constructor(_scene, _textureLoader, _cubesNumber) {
        const depth = (_cubesNumber * 5) + 20

        const floorMaterial = this.getFloorMaterial(depth, _textureLoader, floorColorSource)

        this.floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(8, depth),
            floorMaterial
        )
        this.floor.rotation.x = Math.PI * -0.5
        this.floor.position.z = (depth * -0.5) + 20
        _scene.add(this.floor)

        this.lowFloor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(120, depth + 80),
            new THREE.MeshStandardMaterial({ color: new THREE.Color( 0xffffff ) })
        )
        this.lowFloor.rotation.x = Math.PI * -0.5
        this.lowFloor.position.y = -7
        _scene.add(this.lowFloor)

        const sideMaterial = this.getSideMaterial(depth, _textureLoader)
        const leftSide = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.99, 0.5, depth),
            sideMaterial
        )
        leftSide.position.z = (depth * -0.5) + 20
        leftSide.position.x = -4
        _scene.add(leftSide)

        const rightSide = leftSide.clone()
        rightSide.position.x = 4
        _scene.add(rightSide)

        const startSide = new THREE.Mesh(
            new THREE.BoxBufferGeometry(8, 0.5, 1),
            sideMaterial
        )
        startSide.position.z = 19.5
        _scene.add(startSide)

        const endSide = startSide.clone()
        endSide.position.z = -(depth - 20.5)
        _scene.add(endSide)
    }

    getFloorMaterial(_depth, _textureLoader, _source) {
        const texture = _textureLoader.load(_source)
        texture.repeat.x = 8
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