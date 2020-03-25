import * as THREE from 'three'
import ImprovedNoise from './ImprovedNoise.js'

export default class Map {

    constructor(_scene, _textureLoader, _cubesNumber) {
        this.worldWidth = 160
        this.worldDepth = _cubesNumber * 10 + 160
        this.data = this.generateHeight(this.worldWidth, this.worldDepth)

        const matrix = new THREE.Matrix4()

        const pxGeometry = new THREE.PlaneBufferGeometry(1, 1)
        pxGeometry.attributes.uv.array[1] = 0.5
        pxGeometry.attributes.uv.array[3] = 0.5
        pxGeometry.rotateY(Math.PI / 2)
        pxGeometry.translate(0.5, 0, 0)

        const nxGeometry = new THREE.PlaneBufferGeometry(1, 1)
        nxGeometry.attributes.uv.array[1] = 0.5
        nxGeometry.attributes.uv.array[3] = 0.5
        nxGeometry.rotateY(-Math.PI / 2)
        nxGeometry.translate(-0.5, 0, 0)

        const pyGeometry = new THREE.PlaneBufferGeometry(1, 1)
        pyGeometry.attributes.uv.array[5] = 0.5
        pyGeometry.attributes.uv.array[7] = 0.5
        pyGeometry.rotateX(-Math.PI / 2)
        pyGeometry.translate(0, 0.5, 0)

        const pzGeometry = new THREE.PlaneBufferGeometry(1, 1)
        pzGeometry.attributes.uv.array[1] = 0.5
        pzGeometry.attributes.uv.array[3] = 0.5
        pzGeometry.translate(0, 0, 0.5)

        const nzGeometry = new THREE.PlaneBufferGeometry(1, 1)
        nzGeometry.attributes.uv.array[1] = 0.5
        nzGeometry.attributes.uv.array[3] = 0.5
        nzGeometry.rotateY(Math.PI)
        nzGeometry.translate(0, 0, -0.5)

        // BufferGeometry cannot be merged yet.
        const tmpGeometry = new THREE.Geometry()
        const pxTmpGeometry = new THREE.Geometry().fromBufferGeometry(pxGeometry)
        const nxTmpGeometry = new THREE.Geometry().fromBufferGeometry(nxGeometry)
        const pyTmpGeometry = new THREE.Geometry().fromBufferGeometry(pyGeometry)
        const pzTmpGeometry = new THREE.Geometry().fromBufferGeometry(pzGeometry)
        const nzTmpGeometry = new THREE.Geometry().fromBufferGeometry(nzGeometry)
        for (let z = 0; z < this.worldDepth; z++) {
            for (let x = 0; x < this.worldWidth; x++) {
                const h = this.getY(x, z)
                matrix.makeTranslation(
                    x * 1 - (this.worldWidth / 2),
                    h * 1,
                    z * 1 - (this.worldDepth / 2)
                )
                const px = this.getY(x + 1, z)
                const nx = this.getY(x - 1, z)
                const pz = this.getY(x, z + 1)
                const nz = this.getY(x, z - 1)
                tmpGeometry.merge(pyTmpGeometry, matrix)
                if ((px !== h && px !== h + 1) || x === 0) {
                    tmpGeometry.merge(pxTmpGeometry, matrix)
                }
                if ((nx !== h && nx !== h + 1) || x === this.worldWidth - 1) {
                    tmpGeometry.merge(nxTmpGeometry, matrix)
                }
                if ((pz !== h && pz !== h + 1) || z === this.worldDepth - 1) {
                    tmpGeometry.merge(pzTmpGeometry, matrix)
                }
                if ((nz !== h && nz !== h + 1) || z === 0) {
                    tmpGeometry.merge(nzTmpGeometry, matrix)
                }
            }
        }

        const worldGeometry = new THREE.BufferGeometry().fromGeometry(tmpGeometry)
        worldGeometry.computeBoundingSphere()

        const worldtexture = _textureLoader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/minecraft/atlas.png')
        worldtexture.magFilter = THREE.NearestFilter
        worldtexture.minFilter = THREE.LinearMipMapLinearFilter

        const worldMesh = new THREE.Mesh(worldGeometry, new THREE.MeshLambertMaterial({
            map: worldtexture
        }))
        worldMesh.position.y = -12
        _scene.add(worldMesh)
    }

    generateHeight( width, height ) {
        let data = []
        const perlin = new ImprovedNoise()
        const size = width * height
        let quality = 2
        const z = Math.random() * 1
        for ( var j = 0; j < 4; j ++ ) {
            if ( j === 0 ) for ( var i = 0; i < size; i ++ ) data[ i ] = 0
            for ( var i = 0; i < size; i ++ ) {
                var x = i % width, y = ( i / width ) | 0
                data[i] += perlin.noise( x / quality, y / quality, z ) * quality
            }
            quality *= 4
        }
        return data
    }
    
    getY( x, z ) {
        return ( this.data[ x + z * this.worldWidth ] * 0.2 ) | 0
    }

}