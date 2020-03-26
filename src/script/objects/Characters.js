import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import font from 'three/examples/fonts/helvetiker_regular.typeface.json'

export default class Characters {

    constructor(_scene, _textureLoader) {
        this.characters = {}
        this.scene = _scene

        this.textMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })

        this.characterMaterials = []
        for (let i = 0; i < 8; i++) {
            const characterTexture = _textureLoader.load(`/static/character/texture_${i}.png`)
            characterTexture.magFilter = THREE.NearestFilter
            characterTexture.minFilter = THREE.NearestFilter
            this.characterMaterials.push(new THREE.MeshStandardMaterial({ map: characterTexture }))
        }

        const dracoLoader = new DRACOLoader()
        dracoLoader.setDecoderPath('/static/draco/')
        const gltfLoader = new GLTFLoader()
        gltfLoader.setDRACOLoader(dracoLoader)

        gltfLoader.load(
            '/static/character/steve.glb',
            (gltf) => {
                let character = new THREE.Group()
                character.scale.set(1.4,1.4,1.4)
                while (gltf.scene.children.length) {
                    const child = gltf.scene.children[0]
                    child.material = this.characterMaterials[0]
                    const pivot = new THREE.Object3D()
                    // console.log(child)
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
                        pivot.position.y = height * 3
                        child.position.y = height * -3
                    }
                    character.add(pivot)
                }
                this.baseCharacter = character
            },
            (progress) => {
                console.log('progress', progress);
            },
            (error) => {
                console.log('error', error);
            }
        )
    }

    newCharacter(_data) {
        this.characters[_data.id] = new THREE.Group()
        this.characters[_data.id].scale.set(1.4,1.4,1.4)
        this.baseCharacter.children.forEach(element => {
            element.children[0].material = this.characterMaterials[_data.skin || 0]
            this.characters[_data.id].add(element.clone())
        })
        this.characters[_data.id].userData = {
            movementPosition: 0,
            movementDirection: true,
            lastUpdate: Date.now()
        }
        const textGeometry = new THREE.TextGeometry(_data.name, {
            font: new THREE.Font(font),
            size: 0.1,
            height: 0.03,
            curveSegments: 0,
            bevelEnabled: false
        })
        const text = new THREE.Mesh(
            textGeometry,
            this.textMaterial
        )
        text.rotation.y = Math.PI
        text.position.y = 2.1
        text.position.x = new THREE.Box3().setFromObject(text).getSize().x / 2
        this.characters[_data.id].add(text)
        this.scene.add(this.characters[_data.id])
    }

    updatePlayer(_data) {
        if (this.characters[_data.id] === undefined) {
            this.newCharacter(_data)
        }
        this.characters[_data.id].position.x = _data.x
        this.characters[_data.id].position.z = _data.z
        this.characters[_data.id].rotation.y = _data.rotY
        this.characters[_data.id].getObjectByName('pivotHead').rotation.x = _data.rotX
        this.characters[_data.id].userData.lastUpdate = Date.now()
        this.characters[_data.id].userData.movementPosition += this.characters[_data.id].userData.movementDirection ? 1 : -1
        if (this.characters[_data.id].userData.movementPosition > 10 || this.characters[_data.id].userData.movementPosition < -10) {
            this.characters[_data.id].userData.movementDirection = !this.characters[_data.id].userData.movementDirection
        }
        if(this.characters[_data.id].userData.movementDirection) {
            this.characters[_data.id].getObjectByName('pivotleftArm').rotation.x -= Math.PI * 0.05
            this.characters[_data.id].getObjectByName('pivotrightArm').rotation.x += Math.PI * 0.05
            this.characters[_data.id].getObjectByName('pivotleftLeg').rotation.x += Math.PI * 0.05
            this.characters[_data.id].getObjectByName('pivotrightLeg').rotation.x -= Math.PI * 0.05
        } else {
            this.characters[_data.id].getObjectByName('pivotleftArm').rotation.x += Math.PI * 0.05
            this.characters[_data.id].getObjectByName('pivotrightArm').rotation.x -= Math.PI * 0.05
            this.characters[_data.id].getObjectByName('pivotleftLeg').rotation.x -= Math.PI * 0.05
            this.characters[_data.id].getObjectByName('pivotrightLeg').rotation.x += Math.PI * 0.05
        }
        setTimeout(() => {
            if (this.characters[_data.id].userData.lastUpdate < Date.now() - 990) {
                this.characters[_data.id].userData.movementPosition = 0
                this.characters[_data.id].userData.movementDirection = true
                this.characters[_data.id].getObjectByName('pivotleftArm').rotation.x = 0
                this.characters[_data.id].getObjectByName('pivotrightArm').rotation.x = 0
                this.characters[_data.id].getObjectByName('pivotleftLeg').rotation.x = 0
                this.characters[_data.id].getObjectByName('pivotrightLeg').rotation.x = 0
            }
        }, 1000)
    }

    removePlayerWithId(id) {
        console.log('remove player with id', id)
        this.scene.remove(this.characters[id])
        delete this.characters[id]
    }

}