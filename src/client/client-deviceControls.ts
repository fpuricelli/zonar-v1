import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'dat.gui'
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'


import { io } from 'socket.io-client'
// requiere instalar 
// npm install three-device-orientation
//import { DeviceOrientationControls } from 'three-device-orientation'; 

import { DeviceOrientationControls } from 'three/examples/jsm/controls/DeviceOrientationControls.js';


var camera: any, controls: any, scene: any, renderer: any, orbitControls: any
		

			var startButton = document.getElementById( 'startButton' );
			startButton.addEventListener( 'click', function () {

                

				init();
				animate();

			}, false );

			function init() {

				var overlay = document.getElementById( 'overlay' );
				overlay.remove();
                
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 100 );
				
				camera.position.set(-1.6,1.20,0.10)
				
                
                
                scene = new THREE.Scene();
				scene.add(new THREE.AxesHelper(5))

				//luces
				//const light = new THREE.SpotLight()
				//light.position.set(5, 5, 5)
				//const light = new THREE.AmbientLight()
				//scene.add(light)
				// const light = new THREE.DirectionalLight()
				// scene.add(light)

				// const helper = new THREE.DirectionalLightHelper(light)
				// scene.add(helper)

				

                renderer = new THREE.WebGLRenderer( { antialias: true } );

				// var geometry = new THREE.SphereBufferGeometry( 500, 60, 40 );
				// // // invert the geometry on the x-axis so that all of the faces point inward
				// geometry.scale( - 1, 1, 1 );

				// var material = new THREE.MeshBasicMaterial( {
				// 	map: new THREE.TextureLoader().load( 'img/2294472375_24a3b8ef46_o.jpg' )
				// } );

				// var mesh = new THREE.Mesh( geometry, material );
				// scene.add( mesh );

				const helperGeometry = new THREE.BoxGeometry()
				// //var helperGeometry = new THREE.BoxBufferGeometry( 100, 100, 100, 4, 4, 4 );
				var helperMaterial = new THREE.MeshBasicMaterial( { color: 0xff00ff, wireframe: true
				 } );
				var cube = new THREE.Mesh( helperGeometry, helperMaterial );
				scene.add( cube );
				
				// var model:any
				// const loader = new GLTFLoader()
				// loader.load(
				// 	'models/vanguard.glb',
				// 	function (gltf) {
				// 		// gltf.scene.traverse(function (child) {
				// 		// 	if ((child as THREE.Mesh).isMesh) {
				// 		// 		const m = child as THREE.Mesh
				// 		// 		m.receiveShadow = true
				// 		// 		m.castShadow = true
				// 		// 	}
				// 		// 	if ((child as THREE.Light).isLight) {
				// 		// 		const l = child as THREE.Light
				// 		// 		l.castShadow = true
				// 		// 		l.shadow.bias = -0.003
				// 		// 		l.shadow.mapSize.width = 2048
				// 		// 		l.shadow.mapSize.height = 2048
				// 		// 	}
				// 		// })
				// 		model = gltf.scene
				// 		scene.add(model)
				// 	},
				// 	(xhr) => {
				// 		console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
				// 	},
				// 	(error) => {
				// 		console.log(error)
				// 	}
				// )

				
				const stats = Stats()
				document.body.appendChild(stats.dom)

				// const data = {
				// 	color: light.color.getHex(),
				// 	mapsEnabled: true
				// }

				const gui = new GUI()
				// const lightFolder = gui.addFolder('Luces')
				// lightFolder.addColor(data, 'color').onChange(() => {
				// 	light.color.setHex(Number(data.color.toString().replace('#', '0x')))
				// })
				// lightFolder.add(light, 'intensity', 0, 1, 0.01)
				// const ambientLightFolder = gui.addFolder('Ambiente')
				// ambientLightFolder.open()
				// const directionalLightFolder = gui.addFolder('THREE.DirectionalLight')
				// directionalLightFolder.add(light.position, "x", -100, 100, 0.01)
				// directionalLightFolder.add(light.position, "y", -100, 100, 0.01)
				// directionalLightFolder.add(light.position, "z", -100, 100, 0.01)
				// directionalLightFolder.open()

				function updateCamera() {
					camera.updateProjectionMatrix();
				  }

				const cameraFolder = gui.addFolder('Cámara')
				cameraFolder.add(camera.position, 'x', -15 , 15, 0.01).onChange(updateCamera)
				cameraFolder.add(camera.position, 'y', -15, 15, 0.01).onChange(updateCamera)
				cameraFolder.add(camera.position, 'z', -15, 15 , 0.01).onChange(updateCamera)
				cameraFolder.add(camera, 'fov', 0, 75 , 0.01).onChange(updateCamera)
				

				// const cubeFolder = gui.addFolder('Cube')
				// const cubeRotationFolder = cubeFolder.addFolder('Rotation')
				// cubeRotationFolder.add(cube.rotation, 'x', 0, Math.PI * 2)
				// cubeRotationFolder.add(cube.rotation, 'y', 0, Math.PI * 2)
				// cubeRotationFolder.add(cube.rotation, 'z', 0, Math.PI * 2)
				// cubeFolder.open()
				// cubeRotationFolder.open()
				// const cubePositionFolder = cubeFolder.addFolder('Position')
				// cubePositionFolder.add(cube.position, 'x', -10, 10, 2)
				// cubePositionFolder.add(cube.position, 'y', -10, 10, 2)
				// cubePositionFolder.add(cube.position, 'z', -10, 10, 2)
				// cubeFolder.open()
				// cubePositionFolder.open()
				// const cubeScaleFolder = cubeFolder.addFolder('Scale')
				// cubeScaleFolder.add(cube.scale, 'x', -5, 5)
				// cubeScaleFolder.add(cube.scale, 'y', -5, 5)
				// cubeScaleFolder.add(cube.scale, 'z', -5, 5)
				// cubeFolder.add(cube, 'visible')
				// cubeFolder.open()
				// cubeScaleFolder.open()

				const sceneMeshes: THREE.Mesh[] = []
				let boxHelper: THREE.BoxHelper

				orbitControls = new OrbitControls( camera, renderer.domElement)

				controls = new DeviceOrientationControls( camera )
				//controls = new DeviceOrientationControls( cube );
				
				//orbitControls.enableDamping = true
				//orbitControls.target.set(0, 1, 0)

			

				//renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				//

				window.addEventListener( 'resize', onWindowResize, false );
				console.log(camera)
				// con esto se pueden controlar los movimientos
				if (window.DeviceMotionEvent) {
					window.addEventListener('devicemotion', function(DeviceMotionEvent) {
						const debug = document.getElementById('debug1') as HTMLDivElement
						debug.innerText =
							'Acelerómetro\n' +
							' X : ' +
							DeviceMotionEvent.acceleration.x +
							'\n' +
							' Y : ' +
							DeviceMotionEvent.acceleration.y +
							'\n'+
							' Z : ' +
							DeviceMotionEvent.acceleration.z +
							'\n'+
							'Ratio Rotación\n' +
							' alpha : ' +
							DeviceMotionEvent.rotationRate.alpha +
							'\n'+
							'Camera\n' +
							' x : ' +
							camera.position.x +
							'\n'+
							' y : ' +
							camera.position.y +
							'\n'+
							' z : ' +
							camera.position.z +
							'\n'
							
					});
					
				  }

			}

			function animate() {

				window.requestAnimationFrame( animate );

				controls.update();
				renderer.render( scene, camera );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}
