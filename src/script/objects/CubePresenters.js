import * as THREE from 'three'
import presenterColorSource from '../../../static/blocks/presenter.png'

export default class CubePresenters {

    constructor(_scene, _textureLoader, _cubesNumber, _detailPopup) {
        this.popup = _detailPopup
        this.popupBlockName = this.popup.querySelector('#js-blockName')
        this.popupBlockDescription = this.popup.querySelector('#js-blockDescription')
        this.raycaster = new THREE.Raycaster()
        this.raycasterCenter = new THREE.Vector2(0, 0)

        this.presenterGroups = []
        this.minecraftCubes = []

        const basePresenter = this.getBasePresenter(_textureLoader)
        const baseCube = this.getBaseCube()

        for (let i = 0; i < Math.ceil(_cubesNumber / 2); i++) {
            _scene.add(this.getNewPresenter(basePresenter, baseCube, _textureLoader, i, 0))
            _scene.add(this.getNewPresenter(basePresenter, baseCube, _textureLoader, i, 1))
        }
    }

    update() {
        const now = Date.now() * 0.0015
        this.minecraftCubes.forEach(cube => {
            cube.position.y = 2.5 + Math.sin(now + cube.parent.position.z) * 0.2
        })
    }

    click(_camera, _socket) {
        this.raycaster.setFromCamera(this.raycasterCenter, _camera)
        const start = Math.max((Math.ceil(Math.max(_camera.position.z * -0.1, 0)) * 2) - 4, 0)
        for (let i = start; i < Math.min(start + 8, this.presenterGroups.length); i++) {
            const intersections = this.raycaster.intersectObjects(this.presenterGroups[i].children)
            if (intersections.length > 0) {
                if (intersections[0].object.name === 'cube') {
                    this.animBlockClick(i, _socket)
                } else {
                    this.openPopupForBlock(i)
                }
                break
            }
        }
    }

    animBlockClick(_i, _socket = null) {
        const cube = this.presenterGroups[_i].getObjectByName('cube')
        for (let i = 0; i <= 180; i++) {
            const t = i / 180
            setTimeout(() => {
                cube.rotation.y = Math.PI * 8 * t * ( 2 - t )
            }, i * 1000 / 60)
        }
        if (_socket != null) {
            _socket.emit('block_click', _i)
        }
    }

    openPopupForBlock(_i) {
        this.presenterGroups[_i].children[1].position.x += 0.1
        setTimeout(() => {
            this.presenterGroups[_i].children[1].position.x -= 0.1
        },200)
        fetch(`/static/blocks_data/${_i}.json`)
            .then(response => {
                return response.json()
            })
            .then(json => {
                this.popupBlockName.innerText = json.name
                this.popupBlockDescription.innerText = json.description
            })
        this.popup.classList.toggle('open')
    }

    generateCubeMaterial(_i, _textureLoader) {
        const sideTexture = _textureLoader.load(`/static/blocks/${_i}_side.png`)
        sideTexture.magFilter = THREE.NearestFilter
        sideTexture.minFilter = THREE.NearestFilter
        const topTextureUrl = this.fileExists(`/static/blocks/${_i}_top.png`) ? `/static/blocks/${_i}_top.png` : `/static/blocks/${_i}_side.png`
        const topTexture = _textureLoader.load(topTextureUrl)
        topTexture.magFilter = THREE.NearestFilter
        topTexture.minFilter = THREE.NearestFilter
        const bottomTextureUrl = this.fileExists(`/static/blocks/${_i}_bottom.png`) ? `/static/blocks/${_i}_bottom.png` : `/static/blocks/${_i}_side.png`
        const bottomTexture = _textureLoader.load(bottomTextureUrl)
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

    fileExists(url) {
        if(url){
            var req = new XMLHttpRequest();
            req.open('GET', url, false);
            req.send();
            return req.status==200;
        } else {
            return false
        }
    }

    getBaseCube() {
        const baseCube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1,1,1),
            new THREE.MeshNormalMaterial()
        )
        baseCube.name = "cube"
        baseCube.rotation.x = Math.PI * 0.25
        baseCube.rotation.z = Math.PI * 0.25
        baseCube.position.y = 2.5
        return baseCube
    }

    getPresenterMaterial(_textureLoader) {
        const presenterTexture = _textureLoader.load(presenterColorSource)
        presenterTexture.repeat.x = 1
        presenterTexture.repeat.y = 2
        presenterTexture.wrapS = THREE.RepeatWrapping
        presenterTexture.wrapT = THREE.RepeatWrapping
        presenterTexture.magFilter = THREE.NearestFilter
        presenterTexture.minFilter = THREE.NearestFilter
        return new THREE.MeshStandardMaterial({ map: presenterTexture })
    }

    getBasePresenter(_textureLoader) {
        const basePresenter = new THREE.Group()
        basePresenter.position.y = 1

        const presenter = new THREE.Mesh(
            new THREE.BoxBufferGeometry(1,2,1),
            this.getPresenterMaterial(_textureLoader)
        )
        presenter.matrixAutoUpdate = false
        presenter.updateMatrix()
        basePresenter.add(presenter)

        const presenterButton = new THREE.Mesh(
            new THREE.BoxBufferGeometry(0.25, 0.5, 0.5),
            new THREE.MeshStandardMaterial({
                map: _textureLoader.load(`/static/blocks/63_side.png`)
            })
        )
        presenterButton.position.y = 0.25
        presenterButton.position.x = -0.5
        basePresenter.add(presenterButton)
        return basePresenter
    }

    getNewPresenter(_basePresenter, _baseCube, _textureLoader, _i, _offset) {
        const index = _i * 2 + _offset
        this.minecraftCubes.push(_baseCube.clone())
        this.minecraftCubes[index].material = this.generateCubeMaterial(index, _textureLoader)
        this.minecraftCubes[index].rotation.x = Math.PI * (0.75 - 0.5 * _offset)
        this.minecraftCubes[index].rotation.z = Math.PI * (0.75 - 0.5 * _offset)

        this.presenterGroups.push(_basePresenter.clone())
        this.presenterGroups[index].userData = { cubeId: index }
        this.presenterGroups[index].position.x = -4 + (8 * _offset)
        this.presenterGroups[index].position.z = _i * -10
        this.presenterGroups[index].rotation.y = Math.PI * (1 - _offset)

        this.presenterGroups[index].add(this.minecraftCubes[index])
        return this.presenterGroups[index]
    }

}