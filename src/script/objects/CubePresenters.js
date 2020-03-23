import * as THREE from 'three'
import presenterColorSource from '../../resources/minecraft_textures/block/oak_log.png'

export default class CubePresenters {

    constructor(_scene, _textureLoader) {
        const presenterGroup = new THREE.Group()
        presenterGroup.position.y = 1

        const presenterTexture = _textureLoader.load(presenterColorSource)
        presenterTexture.repeat.x = 1
        presenterTexture.repeat.y = 2
        presenterTexture.wrapS = THREE.RepeatWrapping
        presenterTexture.wrapT = THREE.RepeatWrapping
        presenterTexture.magFilter = THREE.NearestFilter
        presenterTexture.minFilter = THREE.NearestFilter
        const presenter = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1,2,1),
            new THREE.MeshStandardMaterial({
                map: presenterTexture
            })
        )

        presenterGroup.add(presenter)
        this.minecraftCubes = [
            new THREE.Mesh(
                new THREE.BoxBufferGeometry(1,1,1),
                new THREE.MeshNormalMaterial()
            )   
        ]
        this.minecraftCubes[0].rotation.x = Math.PI * 0.25
        this.minecraftCubes[0].rotation.z = Math.PI * 0.25
        this.minecraftCubes[0].position.y = 2

        for (let i = 0; i < 30; i++) {

            /**
             * Right column
             */
            this.minecraftCubes.push(this.minecraftCubes[0].clone())
            const rightPresenter = presenterGroup.clone()
            const rightCubeSideMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff})
            const rightCubeTopMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00})
            const rightCubeBottomMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000})
            const rightCubeMaterials = [
                rightCubeSideMaterial,
                rightCubeSideMaterial,
                rightCubeTopMaterial,
                rightCubeBottomMaterial,
                rightCubeSideMaterial,
                rightCubeSideMaterial,
            ]
            this.minecraftCubes[i*2].material = rightCubeMaterials
            rightPresenter.add(this.minecraftCubes[i*2])

            rightPresenter.position.x = 3
            rightPresenter.position.z = -i * 10
            _scene.add(rightPresenter)

            /**
             * Left column
             */
            this.minecraftCubes.push(this.minecraftCubes[0].clone())
            const leftPresenter = presenterGroup.clone()
            const leftCubeSideMaterial = new THREE.MeshBasicMaterial({ color: 0x00ffff})
            const leftCubeTopMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00})
            const leftCubeBottomMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff})
            const leftCubeMaterials = [
                leftCubeSideMaterial,
                leftCubeSideMaterial,
                leftCubeTopMaterial,
                leftCubeBottomMaterial,
                leftCubeSideMaterial,
                leftCubeSideMaterial,
            ]
            this.minecraftCubes[i*2 + 1].material = leftCubeMaterials
            this.minecraftCubes[i*2 + 1].rotation.z = Math.PI * -0.25
            leftPresenter.add(this.minecraftCubes[i*2 + 1])
            leftPresenter.position.x = -3
            leftPresenter.position.z = -i * 10
            _scene.add(leftPresenter)
        }
        this.minecraftCubes.pop()
    }

    update() {
        const now = Date.now() * 0.0015
        this.minecraftCubes.forEach(cube => {
            cube.position.y = 2 + Math.sin(now + cube.parent.position.z) * 0.05
        })
    }

}