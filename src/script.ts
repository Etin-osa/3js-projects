import * as dat from 'lil-gui';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Clock, PCFSoftShadowMap, PerspectiveCamera, Points, Scene, ShaderMaterial, WebGL1Renderer } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// @ts-ignore
import fragmentShader from './shaders/fragmentShader.glsl';
// @ts-ignore
import vertexShader from './shaders/vertexShader.glsl';

/**
|--------------------------------------------------
| Gui, Canvas, Scene and Fog
|--------------------------------------------------
*/
const gui = new dat.GUI()
const canvas = document.querySelector('canvas.webgl')
const scene = new Scene()

/**
|--------------------------------------------------
| points
|--------------------------------------------------
*/
const numberOfPoints = 10000
const pointsArray = new Float32Array(numberOfPoints * 3)
const randomMovementSpeed = new Float32Array(numberOfPoints)

for (let i = 0; i < numberOfPoints; i++) {
    const radius = Math.random() * 8 + 0.5
    const branchAngle = Math.random() * Math.PI * 2
    const i3 = i * 3

    randomMovementSpeed[i] = Math.random() * 8.0

    pointsArray[i3] = Math.cos(branchAngle) * radius
    pointsArray[i3 + 1] = 0
    pointsArray[i3 + 2] = Math.sin(branchAngle) * radius
}

const pointsGeometry = new BufferGeometry()
pointsGeometry.setAttribute("position", new BufferAttribute(pointsArray, 3))
pointsGeometry.setAttribute("aSpeed", new BufferAttribute(randomMovementSpeed, 1))

const points = new Points(
    pointsGeometry, new ShaderMaterial({ 
        vertexShader, 
        fragmentShader,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
            uTime: { value: 0 }
        }
    })
)
scene.add(points)

/**
|--------------------------------------------------
| Sizes And Resize Event Listener
|--------------------------------------------------
*/
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes 
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
 
    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


/**
|--------------------------------------------------
| Camera
|--------------------------------------------------
*/
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.x = 1.1
camera.position.y = 3   
camera.position.z = 4

const controls = new OrbitControls(camera, canvas as HTMLCanvasElement)
controls.enableDamping = true

/**
|--------------------------------------------------
| Renderer
|--------------------------------------------------
*/
const renderer = new WebGL1Renderer({
    canvas: canvas as HTMLCanvasElement,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = PCFSoftShadowMap

/**
|--------------------------------------------------
| Animatie Function
|--------------------------------------------------
*/
const clock = new Clock()

const animate = () => {
    const elapsedTime = clock.getElapsedTime()
    points.material.uniforms.uTime.value = elapsedTime

    // Update orbit controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
}

animate()