import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xff0000)

const scene1 = new THREE.Scene()
scene1.background = new THREE.Color(0x00000)

// el 2do atributo de la cámara es el ASPECT RATIO que está en relación con el tamaño 
// de la ventana de la escena
const camera1 = new THREE.PerspectiveCamera(
    75,
    1,
    0.1,
    1000
)

const camera2 = new THREE.OrthographicCamera(
    -2,
    2,
    2,
    -2
)

camera1.position.z = 2
camera2.position.z = 2

const canvas1 = document.getElementById("c1") as HTMLCanvasElement
const canvas2 = document.getElementById("c2") as HTMLCanvasElement
const canvas3 = document.getElementById("c3") as HTMLCanvasElement
const canvas4 = document.getElementById("c4") as HTMLCanvasElement

// la siguiente línea comentada es si va directo sin referenciar a un canvas específico
//const renderer = new THREE.WebGLRenderer()

// esta línea es para hacer el render en un canvas específico
const renderer1 = new THREE.WebGLRenderer({canvas:canvas1})
renderer1.setSize(200, 200)

const renderer2 = new THREE.WebGLRenderer({canvas:canvas2})
renderer2.setSize(200, 200)

const renderer3 = new THREE.WebGLRenderer({canvas:canvas3})
renderer3.setSize(200, 200)

const renderer4 = new THREE.WebGLRenderer({canvas:canvas4})
renderer4.setSize(200, 200)

// esta línea agrega el render al HTML (canvas)
// si no está esta línea el render igualmente se ejecuta en background
// se lo comento se puede trabajar con los objetos CANVAS directamente 

// document.body.appendChild(renderer.domElement)

new OrbitControls(camera1, renderer1.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true,
})

const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const cube1 = new THREE.Mesh(geometry, material)
scene1.add(cube1)

console.dir(scene)

// este evento permite que al cambiar el tamaño de la pantalla se modifique la escena
//window.addEventListener('resize', onWindowResize, false)
//function onWindowResize() {
//    camera.aspect = window.innerWidth / window.innerHeight
//    camera.updateProjectionMatrix()
//    renderer.setSize(window.innerWidth, window.innerHeight)
//    render()
//}

function animate() {
    requestAnimationFrame(animate)

    cube.rotation.x += 0.01
    cube.rotation.y += 0.01

    cube1.rotation.x += 0.01
    cube1.rotation.y += 0.01

    render()
}

function render() {
    renderer1.render(scene, camera1)
    renderer2.render(scene, camera1)
    renderer3.render(scene1, camera2)
    renderer4.render(scene, camera1)
}

animate()