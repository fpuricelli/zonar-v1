import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { io } from 'socket.io-client'
import { count } from 'console'
import { AnaglyphEffect } from 'three/examples/jsm/effects/AnaglyphEffect'
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';



const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial() //{
//     color: 0x00ff00,
//     wireframe: true,
// })

const texture = new THREE.TextureLoader().load('img/grid.png')
material.map = texture
const envTexture = new THREE.CubeTextureLoader().load([
    'img/px_50.png',
    'img/nx_50.png',
    'img/py_50.png',
    'img/ny_50.png',
    'img/pz_50.png',
    'img/nz_50.png',
])
envTexture.mapping = THREE.CubeReflectionMapping
//envTexture.mapping = THREE.CubeRefractionMapping
//material.envMap = envTexture

const myObject3D = new THREE.Object3D()
myObject3D.position.x = Math.random() * 4 - 2
myObject3D.position.z = Math.random() * 4 - 2

//const gridHelper = new THREE.GridHelper(10, 10)
//gridHelper.position.y = -0.5
//scene.add(gridHelper)

// LIGHT
var light = new THREE.PointLight(0xffffff);
light.position.set(-100,200,100);
scene.add(light);

// FLOOR
var floorTexture = new THREE.TextureLoader().load( 'img/checkerboard.jpg' );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
floorTexture.repeat.set( 10, 10 );
var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var floorGeometry = new THREE.PlaneGeometry(50, 50, 20, 20);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.y = -0.5;
floor.rotation.x = Math.PI / 2;
scene.add(floor)

camera.position.z = 4

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

const view = {
    tipo: 'Opera'
}
let viewType=0
let myId = ''
let timestamp = 0
const clientCubes: { [id: string]: THREE.Mesh } = {}
const socket = io()

socket.on('connect', function () {
    console.log('connect')
    
})
socket.on('disconnect', function (message: any) {
    console.log('disconnect ' + message)
})
socket.on('id', (id: any) => {
    myId = id

    setInterval(() => {
        socket.emit('update', {
            t: Date.now(),
            p: myObject3D.position,
            r: myObject3D.rotation,
            v: view.tipo,
        })
    }, 50)
})

socket.on('orden', (connNumber: any) => {
    if (connNumber == 1) {
        console.log('main conex......')
        controlGui()
        viewType = 1
        view.tipo='Opera'
    }
    if (connNumber == 2) {
        console.log('3D conex......')
        viewType = 2
        view.tipo='3D'
    }
    if (connNumber == 3) {
        console.log('modo VR......')
        viewType = 3
        document.body.appendChild( VRButton.createButton( renderer ) );
        renderer.xr.enabled = true;
        view.tipo='XR';
    }
    // guarda el tipo de vista asociado a la conexión
    setInterval(() => {
        socket.emit('update', {
            v: view.tipo,
        })
    }, 50)
})

socket.on('clients', (clients: any) => {
    
    let pingStatsHtml = 'Socket Ping Stats<br/><br/>'
    // obtener la cantidad de conexiones
    //console.log(Object.keys(clients).length)
    Object.keys(clients).forEach((p) => {


        timestamp = Date.now()
        pingStatsHtml += p + ' ' + (timestamp - clients[p].t) + 'ms - modo:'+clients[p].v+' nroConn: ' + clients[p].c +' <br/>'
        if (!clientCubes[p] && clients[p].c == 1) {
            clientCubes[p] = new THREE.Mesh(geometry, material)
            clientCubes[p].name = p
            

            scene.add(clientCubes[p])
           
            console.log('conex:'+clients[p].c)            

            
        } 
        else {
            if (clients[p].p && clients[p].c == 1) {
                new TWEEN.Tween(clientCubes[p].position)
                    .to(
                        {
                            x: clients[p].p.x,
                            y: clients[p].p.y,
                            z: clients[p].p.z,
                        },
                        50
                    )
                    .start()
            }
            if (clients[p].r && clients[p].c == 1) {
                new TWEEN.Tween(clientCubes[p].rotation)
                    .to(
                        {
                            x: clients[p].r._x,
                            y: clients[p].r._y,
                            z: clients[p].r._z,
                        },
                        50
                    )
                    .start()
            }
        }
    })
    ;(document.getElementById('pingStats') as HTMLDivElement).innerHTML =
        pingStatsHtml
    
    
})
socket.on('removeClient', (id: string) => {
    scene.remove(scene.getObjectByName(id) as THREE.Object3D)
})





function updateMaterial() {
    material.side = Number(material.side)
    material.combine = Number(material.combine)
    material.needsUpdate = true
}

function updateView() {
    console.log("la nueva vista es "+view.tipo)
};
const stats = Stats()
document.body.appendChild(stats.dom)



// la interfaz es solamente para el cliente operador principal
function controlGui() {
    
    const gui = new GUI()
    const cubeFolder = gui.addFolder('Cube')
    const cubePositionFolder = cubeFolder.addFolder('Position')
    cubePositionFolder.add(myObject3D.position, 'x', -5, 5)
    cubePositionFolder.add(myObject3D.position, 'z', -5, 5)
    cubePositionFolder.open()
    const cubeRotationFolder = cubeFolder.addFolder('Rotation')
    cubeRotationFolder.add(myObject3D.rotation, 'x', 0, Math.PI * 2, 0.01)
    cubeRotationFolder.add(myObject3D.rotation, 'y', 0, Math.PI * 2, 0.01)
    cubeRotationFolder.add(myObject3D.rotation, 'z', 0, Math.PI * 2, 0.01)
    cubeRotationFolder.open()
    cubeFolder.open()

    const options = {
        side: {
            FrontSide: THREE.FrontSide,
            BackSide: THREE.BackSide,
            DoubleSide: THREE.DoubleSide,
        },
        combine: {
            MultiplyOperation: THREE.MultiplyOperation,
            MixOperation: THREE.MixOperation,
            AddOperation: THREE.AddOperation,
        },
    }

    const materialFolder = gui.addFolder('THREE.Material')
    materialFolder.add(material, 'transparent')
    materialFolder.add(material, 'opacity', 0, 1, 0.01)
    materialFolder.add(material, 'depthTest')
    materialFolder.add(material, 'depthWrite')
    materialFolder
        .add(material, 'alphaTest', 0, 1, 0.01)
        .onChange(() => updateMaterial())
    materialFolder.add(material, 'visible')
    materialFolder
        .add(material, 'side', options.side)
        .onChange(() => updateMaterial())
    materialFolder.open()

    

    const viewType = gui.addFolder('Vista')
    viewType.add(view,'tipo',
                    ['Opera', '3D', 'XR'])
            .onChange(()=>updateView())

    const data = {
        color: material.color.getHex(),
    
}
}

//function effect3d() {

    var width = window.innerWidth || 2;
	var height = window.innerHeight || 2;

	const effect = new AnaglyphEffect(renderer)
	effect.setSize( width, height );
//}


const animate = function () {

    if (view.tipo=='XR') {
        renderer.setAnimationLoop(render)
    } else {
        requestAnimationFrame(animate)

        controls.update()
    }
    

    if (clientCubes[myId]) {
        camera.lookAt(clientCubes[myId].position)
    }

    render()

    stats.update()
    
    

}

const render = function () {
    TWEEN.update()
    if (view.tipo == 'Opera' || view.tipo=='XR') {
     renderer.render(scene, camera)
    } else {
     effect.render(scene, camera)
    }
}

animate()
