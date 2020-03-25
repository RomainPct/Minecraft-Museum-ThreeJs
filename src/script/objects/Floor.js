import * as THREE from 'three'
import floorColorSource from '../../../static/blocks/19_inner.png'
// import floorLightColorSource from '../../../static/blocks/127_on.png'

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

        // this.floorLeft = new THREE.Mesh(
        //     new THREE.PlaneBufferGeometry(8/3, depth),
        //     floorMaterial
        // )
        // this.floorLeft.rotation.x = Math.PI * -0.5
        // this.floorLeft.position.z = (depth * -0.5) + 20
        // this.floorLeft.position.x = 4 * -2/3
        // _scene.add(this.floorLeft)

        // this.floorCenter = new THREE.Mesh(
        //     new THREE.PlaneBufferGeometry(8/3, depth),
        //     this.getFloorMaterial(depth, _textureLoader, floorLightColorSource)
        // )
        // this.floorCenter.rotation.x = Math.PI * -0.5
        // this.floorCenter.position.z = (depth * -0.5) + 20
        // _scene.add(this.floorCenter)

        // this.floorRight = this.floorLeft.clone()
        // this.floorRight.position.x = 4 * 2/3
        // _scene.add(this.floorRight)

        this.lowFloor = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(120, depth),
            new THREE.MeshStandardMaterial({ color: new THREE.Color( 0xffffff ) })
        )
        this.lowFloor.rotation.x = Math.PI * -0.5
        this.lowFloor.position.y = -10
        _scene.add(this.lowFloor)

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