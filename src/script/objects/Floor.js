import * as THREE from 'three'
import floorColorSource from '../../../static/blocks/19_inner.png'
// import lowFloorColorSource from '../../../static/blocks/66_side.png'

export default class Floor {

    constructor(_scene, _textureLoader, _cubesNumber) {
        const depth = (_cubesNumber * 5) + 20

        this.addMainFloor(_scene, _textureLoader, depth)
        this.addSidesToScene(_scene, depth)
        // this.addLowFloor(_scene, _textureLoader, depth)
    }

    addLowFloor(_scene, _textureLoader, _depth) {
        const texture = _textureLoader.load(floorColorSource)
        texture.repeat.x = 120
        texture.repeat.y = _depth + 80
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
        texture.magFilter = THREE.NearestFilter
        texture.minFilter = THREE.NearestFilter
        this.lowFloor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(120, _depth + 80),
            new THREE.MeshStandardMaterial({ map: texture })
        )
        this.lowFloor.rotation.x = Math.PI * -0.5
        this.lowFloor.position.y = -7
        _scene.add(this.lowFloor)
    }

    addMainFloor(_scene, _textureLoader, _depth) {
        const floorMaterial = this.getFloorMaterial(_depth, _textureLoader, floorColorSource)

        this.floor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(8, _depth),
            floorMaterial
        )
        this.floor.rotation.x = Math.PI * -0.5
        this.floor.position.z = (_depth * -0.5) + 20
        _scene.add(this.floor)
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

    addSidesToScene(_scene, _depth) {
        const sideMaterial = new THREE.MeshBasicMaterial({ color: 0xffffaa })
        const leftSide = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.99, 0.5, _depth),
            sideMaterial
        )
        leftSide.position.z = (_depth * -0.5) + 20
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
        endSide.position.z = -(_depth - 20.5)
        _scene.add(endSide)
    }

}