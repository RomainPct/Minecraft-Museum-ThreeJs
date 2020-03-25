import * as THREE from 'three'

export default class Isldands {

    constructor(_scene, _textureLoader, _cubesNumber) {
        this.basePath = [
            [[-3,0], [-3, 2], [-2, 2], [-2, 4], [0, 4], [0, 2], [3, 2], [3, 1], [2, 1], [2, -1], [1, -1], [1, -3], [-1, -3], [-1, -2], [-2, -2], [-2, -1], [-3, -1]],
            [[0, 2], [0, 3], [1, 3], [1, 4], [2, 4], [2, 5], [3, 5], [3, 4], [4, 4], [4, 3], [5, 3], [5, 2], [4, 2], [4, 1], [3, 1], [3, 0], [2, 0], [2, 1], [1, 1], [1, 2]]
        ]
        // this.baseShapes = []
        // this.baseGeometries = []
        this.islandBaseLayers = []
        this.generateIslandBaseGeometries()

        this.islandGroups = []
        this.generateIslandGroups(_scene, _cubesNumber)
    }

    generateIslandGroups(_scene, _cubesNumber) {
        for (let i = 0; i < _cubesNumber / 2; i++) {
            const group = new THREE.Group()
            const height = Math.round(Math.random() * 4) + 2
            const islandType = Math.round(Math.random())
            for (let h = 0; h <= height; h++) {
                const s = Math.pow(1.4, h) - 0.5
                const layer = this.islandBaseLayers[islandType].clone()
                layer.scale.set(s,s,1)
                layer.position.z = -h
                group.add(layer)
            }
            if (i % 2 != 0) {
                group.position.x = -25 - Math.random() * 20
            } else {
                group.position.x = 25 + Math.random() * 20
            }
            group.position.z = (Math.random() * _cubesNumber * -6) + 40
            group.position.y = -height + (Math.random() - 0.8) * 4
            group.rotation.z = Math.PI * Math.floor(Math.random() * 4) / 2
            group.rotation.x = Math.PI * 0.5
            _scene.add(group)
        }
    }

    generateIslandBaseGeometries() {
        for (const i in this.basePath) {
            const baseShape = new THREE.Shape()
            baseShape.moveTo(this.basePath[i][0][0],this.basePath[i][0][1])
            this.basePath[i].forEach(point => {
                baseShape.lineTo(point[0], point[1])
            })
            // this.baseShapes.push(baseShape)
            const baseGeometry = new THREE.ExtrudeBufferGeometry(
                baseShape,
                {
                    depth: 1,
                    bevelEnabled: false
                }
            )
            // this.baseGeometries.push(baseGeometry)
            this.islandBaseLayers.push(new THREE.Mesh(
                baseGeometry,
                new THREE.MeshStandardMaterial({ color: 0x555555 })
            ))
        }
    }

}