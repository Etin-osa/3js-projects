```typescript
import { BoxGeometry, Clock, Mesh, MeshBasicMaterial, PCFSoftShadowMap, PerspectiveCamera, Scene, WebGL1Renderer } from "three"
import * as dat from 'lil-gui';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

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
| Box
|--------------------------------------------------
*/
const cube = new Mesh(new BoxGeometry(1,1,1), new MeshBasicMaterial())
scene.add(cube)

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
const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)  
camera.position.x = 1
camera.position.y = .4
camera.position.z = 2.3

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

    // Update orbit controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
}

animate()
```