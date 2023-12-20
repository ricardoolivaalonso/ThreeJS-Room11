// He visto los tutoriales de Bruno Simon y estoy usando su repositorio: https://github.com/brunosimon/my-room-in-3d

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()
const textureLoader = new THREE.TextureLoader()
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Base camera
const camera = new THREE.PerspectiveCamera(43, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 2.5
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = true
controls.enablePan = true
controls.minDistance = 0
controls.maxDistance = 1.5
controls.minPolarAngle = Math.PI / 3
controls.maxPolarAngle = Math.PI / 1.85
controls.minAzimuthAngle = Math.PI / 8
controls.maxAzimuthAngle = Math.PI / 4
controls.panSpeed = .5
controls.rotateSpeed = .1


// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputEncoding = THREE.sRGBEncoding

// Materials
const bakedTexture = textureLoader.load('/baked.jpg')
bakedTexture.flipY = false
bakedTexture.encoding = THREE.sRGBEncoding

const bakedMaterial = new THREE.MeshBasicMaterial({
    map: bakedTexture,
    side: THREE.DoubleSide,
})

const bakedMaterial2 = new THREE.MeshPhysicalMaterial({
    metalness: .9,
    roughness: .05,
    envMapIntensity: 0.9,
    clearcoat: 1,
    transparent: true,
    transmission: .95,
    opacity: .5,
    reflectivity: 0.2,
    refractionRatio: 0.985,
    ior: 0.9,
    side: THREE.BackSide,
})

//Loader
new GLTFLoader().load( '/model.glb',
    (gltf) => {
        const model = gltf.scene
        model.traverse( child => {
            child.material = bakedMaterial
            if(child.name == "Glass") {
                console.log(child)
                child.material = bakedMaterial2
            }
        })
        // scene.position.set(0,0,0)

        scene.add(model)
    },
    ( xhr ) => {
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
    }
)

var minPan = new THREE.Vector3( -.5, -.1, -.5 );
var maxPan = new THREE.Vector3( .5, .1, .5 );
window.addEventListener('resize', () =>
{
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// Animation
const tick = () => {
    controls.update()
    controls.target.clamp( minPan, maxPan );
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()





const slider = document.querySelector('.slider')

canvas.addEventListener('dblclick', () => {
    slider.classList.toggle('anim')
    setTimeout(() => canvas.classList.toggle('full'), 400)
    setTimeout(() => slider.classList.toggle('anim'), 2001)  
})