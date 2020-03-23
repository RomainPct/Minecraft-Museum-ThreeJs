import * as THREE from 'three'

export default class CloudGenerator {

    constructor(_scene) {
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
            color: new THREE.Color(0x333333)
        })

        for (let i = 0; i < 100; i++) {
            const cloud = new THREE.Mesh(
                this.cloudGeometries[Math.floor(Math.random() * this.cloudGeometries.length)],
                this.cloudMaterial
            )
            cloud.position.x = (Math.random() - 0.5) * 60
            cloud.position.z = i * -2
            cloud.rotation.z = Math.PI * Math.floor(Math.random() * 4) / 2
            cloud.position.y = 20 + Math.floor(Math.random() * 2) * 10
            cloud.rotation.x = Math.PI * 0.5
            _scene.add(cloud)
        }
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
                    amount: 0.5,
                    bevelEnabled: false
                }
            ))
        }
    }

}