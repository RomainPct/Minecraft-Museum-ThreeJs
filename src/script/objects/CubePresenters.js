import * as THREE from 'three'
import presenterColorSource from '../../resources/minecraft_textures/block/oak_log.png'
import cactusBottomSource from '../../resources/minecraft_textures/block/cactus_bottom.png'
import cactusSideSource from '../../resources/minecraft_textures/block/cactus_side.png'
import cactusTopSource from '../../resources/minecraft_textures/block/cactus_top.png'

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
        this.minecraftCubes[0].position.y = 2.5

        for (let i = 0; i < 30; i++) {

            /**
             * Right column
             */
            this.minecraftCubes.push(this.minecraftCubes[0].clone())
            this.minecraftCubes[i*2].material = this.generateCubeMaterial(i*2, _textureLoader)
            this.minecraftCubes[0].rotation.z = Math.PI * 0.25

            const rightPresenter = presenterGroup.clone()
            rightPresenter.add(this.minecraftCubes[i*2])

            rightPresenter.position.x = 4
            rightPresenter.position.z = -i * 10

            _scene.add(rightPresenter)

            /**
             * Left column
             */
            this.minecraftCubes.push(this.minecraftCubes[0].clone())
            this.minecraftCubes[i*2 + 1].material = this.generateCubeMaterial(i*2 + 1, _textureLoader)
            this.minecraftCubes[i*2 + 1].rotation.z = Math.PI * -0.25

            const leftPresenter = presenterGroup.clone()
            leftPresenter.add(this.minecraftCubes[i*2 + 1])

            leftPresenter.position.x = -4
            leftPresenter.position.z = -i * 10

            _scene.add(leftPresenter)
        }
        this.minecraftCubes.pop()
    }

    update() {
        const now = Date.now() * 0.0015
        this.minecraftCubes.forEach(cube => {
            cube.position.y = 2.5 + Math.sin(now + cube.parent.position.z) * 0.1
        })
    }

    generateCubeMaterial(_i, _textureLoader) {
        const sideTexture = _textureLoader.load(cactusSideSource)
        sideTexture.magFilter = THREE.NearestFilter
        sideTexture.minFilter = THREE.NearestFilter
        const topTexture = _textureLoader.load(cactusTopSource)
        topTexture.magFilter = THREE.NearestFilter
        topTexture.minFilter = THREE.NearestFilter
        const bottomTexture = _textureLoader.load(cactusBottomSource)
        bottomTexture.magFilter = THREE.NearestFilter
        bottomTexture.minFilter = THREE.NearestFilter
        const sideMaterial = new THREE.MeshStandardMaterial({ map: sideTexture })
        const cubeMaterials = [
            sideMaterial,
            sideMaterial,
            new THREE.MeshStandardMaterial({ map: topTexture }),
            new THREE.MeshStandardMaterial({ map: bottomTexture }),
            sideMaterial,
            sideMaterial,
        ]
        return cubeMaterials
    }

}