import * as THREE from 'three'

export default class CloudGenerator {

    constructor(_scene, _cubesNumber) {
        this.cloudiness = (Math.random() * 2.5)
        this.cloudShapes = [
            [[0, 0], [0, 3], [1, 3], [1, 4], [3, 4], [3, 3], [4, 3], [4, 1], [1, 1], [1, 0]],
            [[0, 0], [0, 1], [1, 1], [1, 2], [2, 2], [2, 1], [3, 1], [3, 0]],
            [[0, 0], [0, 1], [2, 1], [2, 0]],
            [[0, 0], [0, 1], [1, 1], [1, 2], [3, 2], [3, 1], [2, 1], [2, 0]],
            [[0, 0], [2, 0], [2, 2], [2, 1], [1, 1], [1, 0]],
            [[2, 0], [2, 4], [0, 4], [0, 6], [1, 6], [1, 5], [3, 5], [3, 0]],
            [[0, 0], [0, 3], [1, 3], [1, 2], [2, 2], [2, 0]],
            [[0, 1], [0, 4], [1, 4], [1, 5], [2, 5], [2, 3], [6, 3], [6, 4], [5, 4], [5, 6], [4, 6], [4, 7], [11, 7], [11, 3], [12, 3], [12, 2], [9, 2], [9, 0], [8, 0], [8, -1], [7, -1], [7, 0], [6, 0], [6, 1], [3, 1]],
        ]
        this.cloudGeometries = []
        this.generateCloudGeometries()
        this.cloudMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(0x999999)
        })
        this.cloudLevel1 = new THREE.Group()
        this.cloudLevel1.position.y = 20
        this.cloudLevel2 = new THREE.Group()
        this.cloudLevel2.position.y = 25
        for (let i = 0; i < _cubesNumber * 8 * this.cloudiness; i++) {
            const cloud = new THREE.Mesh(
                this.cloudGeometries[Math.floor(Math.random() * this.cloudGeometries.length)],
                this.cloudMaterial
            )
            cloud.position.x = (Math.random() - 0.5) * 160
            cloud.position.z = i * -(3 - this.cloudiness)
            cloud.rotation.z = Math.PI * Math.floor(Math.random() * 4) / 2
            cloud.rotation.x = Math.PI * 0.5
            cloud.matrixAutoUpdate = false
            cloud.updateMatrix()
            if (Math.random() < 0.5 ) {
                this.cloudLevel1.add(cloud)
            } else {
                this.cloudLevel2.add(cloud)
            }
        }
        _scene.add(this.cloudLevel1)
        _scene.add(this.cloudLevel2)
        const sky = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(160, _cubesNumber * 10 + 160),
            new THREE.MeshStandardMaterial({ color: 0x2d99fc })
        )
        sky.rotation.x = Math.PI * 0.5
        sky.position.y = 26
        _scene.add(sky)
    }

    generateCloudGeometries() {
        for (const i in this.cloudShapes) {
            const cloudShape = new THREE.Shape()
            cloudShape.moveTo(this.cloudShapes[i][0][0],this.cloudShapes[i][0][1])
            this.cloudShapes[i].forEach(point => {
                cloudShape.lineTo(point[0], point[1])
            })
            this.cloudGeometries.push(new THREE.ExtrudeBufferGeometry(
                cloudShape,
                {
                    depth: 0.5,
                    bevelEnabled: false
                }
            ))
        }
    }

}