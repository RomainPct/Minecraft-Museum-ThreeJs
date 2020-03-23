import * as THREE from 'three'

export default class CubePresenters {

    constructor(_scene) {
        const presenterGroup = new THREE.Group()
        presenterGroup.position.y = 0.6

        const presenter = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.5,1.2,0.5),
            new THREE.MeshNormalMaterial()
        )
        presenterGroup.add(presenter)

        this.minecraftCubes = [
            new THREE.Mesh(
                new THREE.BoxBufferGeometry(0.7,0.7,0.7),
                new THREE.MeshNormalMaterial()
            )   
        ]
        this.minecraftCubes[0].rotation.x = Math.PI * 0.25
        this.minecraftCubes[0].rotation.y = Math.PI * 0.25
        this.minecraftCubes[0].position.y = 1.5

        for (let i = 0; i < 30; i++) {

            /**
             * Right column
             */
            this.minecraftCubes.push(this.minecraftCubes[0].clone())

            const rightPresenter = presenterGroup.clone()
            rightPresenter.add(this.minecraftCubes[i*2])
            rightPresenter.position.x = 3
            rightPresenter.position.z = -i * 10
            _scene.add(rightPresenter)

            /**
             * Left column
             */
            this.minecraftCubes.push(this.minecraftCubes[0].clone())
            const leftPresenter = presenterGroup.clone()
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
            cube.position.y = 1.5 + Math.sin(now + cube.parent.position.z) * 0.05
        })
    }

}