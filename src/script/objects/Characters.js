import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export default class Characters {

    constructor(_scene, _gltfLoader, _textureLoader) {
        this.characters = []

        this.characterTexture = _textureLoader.load('/static/character/texture_1.png')
        this.characterTexture.magFilter = THREE.NearestFilter
        this.characterTexture.minFilter = THREE.NearestFilter

        this.characterMaterial = new THREE.MeshStandardMaterial({ map: this.characterTexture })

        _gltfLoader.load(
            '/static/character/steve.glb',
            (gltf) => {
                let character = new THREE.Group()
                const characterObject = {
                    object: character
                }
                character.scale.set(1.4,1.4,1.4)
                while (gltf.scene.children.length) {
                    const child = gltf.scene.children[0]
                    child.material = this.characterMaterial
                    const pivot = new THREE.Object3D()
                    console.log(child)
                    pivot.add(child)
                    pivot.name = `pivot${child.name}`
                    if (child.name == 'leftArm' || child.name == 'rightArm') {
                        const height = new THREE.Box3().setFromObject(child).getSize().y - 0.05
                        pivot.position.y = height * 2
                        child.position.y = height * -2
                    } else if (child.name == 'leftLeg' || child.name == 'rightLeg') {
                        const height = new THREE.Box3().setFromObject(child).getSize().y + 0.05
                        pivot.position.y = height * 1
                        child.position.y = height * -1
                    } else if (child.name == 'Head') {
                        const height = new THREE.Box3().setFromObject(child).getSize().y + 0.05
                        pivot.position.y = height * 1
                        child.position.y = height * -1
                    }
                    characterObject[pivot.name] = pivot
                    character.add(pivot)
                }
                _scene.add(character)
                this.characters.push(characterObject)
                console.log(this.characters)
            },
            (progress) => {
                console.log('progress', progress);
            },
            (error) => {
                console.log('error', error);
            }
        )
    }

    update() {
        // console.log(this.characters)
        this.characters.forEach(character => {
            // character.pivotleftArm.rotation.x += Math.PI * 0.01
            // character.pivotrightArm.rotation.x -= Math.PI * 0.01
            // character.pivotleftLeg.rotation.x += Math.PI * 0.01
            // character.pivotrightLeg.rotation.x -= Math.PI * 0.01
            // character.pivotHead.rotation.y += Math.PI * 0.01
        })
    }

}