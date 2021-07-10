import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'


//#region  DEBUG
    const gui = new dat.GUI()

//#endregion

const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

//#region TEXTURES
    const textureLoader = new THREE.TextureLoader()

    const matcapTexture = textureLoader.load('textures/matcaps/1.png')

    const doorTexture = textureLoader.load('/textures/door/Metal_Pattern_001_basecolor.jpg')
    const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
    const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/Metal_Pattern_001_ambientOcclusion.jpg')
    const doorHeightTexture = textureLoader.load('/textures/door/Metal_Pattern_001_height.jpg')
    const doorNormalTexture = textureLoader.load('/textures/door/Metal_Pattern_001_normal.jpg')
    const doorMetalnessTexture = textureLoader.load('/textures/door/Metal_Pattern_001_metallic.jpg')
    const doorRoughnessTexture = textureLoader.load('/textures/door/Metal_Pattern_001_roughness.jpg')

    const wallColorTexture = textureLoader.load('/textures/wall/Tiles_Modern_002_basecolor.jpg')
    const wallAmbientOcclusionTexture = textureLoader.load('/textures/wall/Tiles_Modern_002_ambientOcclusion.jpg')
    const wallNormalTexture = textureLoader.load('/textures/wall/Tiles_Modern_002_normal.jpg')
    const wallRoughnessTexture = textureLoader.load('/textures/wall/Tiles_Modern_002_roughness.jpg')
    const wallHeightTexture = textureLoader.load('/textures/door/Tiles_Modern_002_height.jpg')
    const wallMetalnessTexture = textureLoader.load('/textures/door/Tiles_Modern_002_metallic.jpg')

    const grassColorTexture = textureLoader.load('/textures/grass/Fabric_033_basecolor.jpg')
    const grassAmbientOcclusionTexture = textureLoader.load('/textures/grass/Fabric_033_ambientOcclusion.jpg')
    const grassNormalTexture = textureLoader.load('/textures/grass/Fabric_033_normal.jpg')
    const grassRoughnessTexture = textureLoader.load('/textures/grass/Fabric_033_roughness.jpg')

    grassColorTexture.repeat.set(8,8)
    grassAmbientOcclusionTexture.repeat.set(8,8)
    grassNormalTexture.repeat.set(8,8)
    grassRoughnessTexture.repeat.set(8,8)

    grassColorTexture.wrapS = THREE.RepeatWrapping
    grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping
    grassNormalTexture.wrapS = THREE.RepeatWrapping
    grassRoughnessTexture.wrapS = THREE.RepeatWrapping

    grassColorTexture.wrapT = THREE.RepeatWrapping
    grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping
    grassNormalTexture.wrapT = THREE.RepeatWrapping
    grassRoughnessTexture.wrapT = THREE.RepeatWrapping
//#endregion

//#region  HOUSE
    const group = new THREE.Group()

    //#region BOX
        const geometry = new THREE.BoxBufferGeometry(5, 10, 6)
        const material = new THREE.MeshStandardMaterial({
            map: wallColorTexture,
            aoMap: wallAmbientOcclusionTexture,
            normalMap: wallNormalTexture,
            roughness: wallRoughnessTexture
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.y = 5
        group.add(mesh)
    //#endregion
    
    //#region 3D Text
        const textd = new THREE.FontLoader()
        textd.load(
            '/fonts/helvetiker_regular.typeface.json',
            (text) =>{
                const textGeometry = new THREE.TextBufferGeometry(
                    'starlight',
                    {
                        font: text,
                        size: 1,
                        height: 0.2,
                        curveSegments: 5,
                        bevelEnabled: true,
                        bevelThickness: 0.03,
                        bevelSize: 0.02,
                        bevelOffset: 0,
                        bevelSegments: 4
                    }
                )
                textGeometry.computeBoundingBox()
                // textGeometry.center()
                
                const material = new THREE.MeshMatcapMaterial({matcap: matcapTexture})
                const threetext = new THREE.Mesh(textGeometry, material)
                threetext.position.x = 2.5
                threetext.position.y = 7
                threetext.position.z = 2.5
                threetext.rotation.y = Math.PI * 0.5

                group.add(threetext)

            }
        )
    //#endregion
    
    //#region DOOR
        const door = new THREE.Mesh(
            new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
            new THREE.MeshStandardMaterial({
                color: '#cf6620', 
                map: doorTexture, 
                transparent: true, 
                // alphaMap: doorAlphaTexture,
                aoMap: doorAmbientOcclusionTexture,
                displacementMap: doorHeightTexture,
                displacementScale: 0.1,
                normalMap: doorNormalTexture,
                metalnessMap: doorMetalnessTexture,
                roughnessMap: doorRoughnessTexture //shiny/light reflect
            })
        )
        door.geometry.setAttribute(
            'uv2', 
            new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
            )//belajar lagi
        door.rotation.y = Math.PI * 0.5
        door.position.z = 0
        door.position.y = 1
        door.position.x = 2.51
        group.add(door)


    //#endregion
    
    //#region GALAXY1
        const paramenters = {
            count: 30000,
            size: 0.01,
            radius: 10,
            branches: 3,
            spin: 1,
            randomness: 0.2,
            randomnessPower: 3,
            insideColor: '#ff6030',
            outsideColor: '#ff6030'
        }
        let geometrys = null
        let materials = null
        let points = null
        const generateGalaxy = () => {

            if(points !== null){
                geometrys.dispose()
                materials.dispose()
                scene.remove(points)
            }

            geometrys = new THREE.BufferGeometry()
            const positions = new Float32Array(paramenters.count * 3)
            const colors = new Float32Array(paramenters.count * 3)
            const colorInside = new THREE.Color(paramenters.insideColor)
            const colorOutside = new THREE.Color(paramenters.outsideColor)
            

            for(let i = 0; i < paramenters.count * 3; i++){
                const i3 = i * 3

                //Position
                const radius = Math.random() * paramenters.radius
                const branchAngle = (i % paramenters.branches) / paramenters.branches * Math.PI * 0.5
                const spinAngle = radius * paramenters.spin

                const randomY = Math.pow(Math.random(), paramenters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * paramenters.randomness * radius
                const randomZ = Math.pow(Math.random(), paramenters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * paramenters.randomness * radius
                const randomX = Math.pow(Math.random(), paramenters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * paramenters.randomness * radius

                positions[i3] = randomY -5
                positions[i3 + 1] = Math.sin(branchAngle + spinAngle) * radius + randomX + 8
                positions[i3 + 2] = Math.tan(branchAngle + spinAngle) * radius + randomZ - 0
            
                //Color
                const mixedColor = colorInside.clone()
                mixedColor.lerp(colorOutside, radius/paramenters.radius)

                colors[i3] = mixedColor.r
                colors[i3 + 1] = mixedColor.g
                colors[i3 + 2] = mixedColor.b

                
            }
            geometrys.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            )
            geometrys.setAttribute(
                'color',
                new THREE.BufferAttribute(colors, 3)
            )
            materials = new THREE.PointsMaterial({
                size: paramenters.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true
            })

            points = new THREE.Points(geometrys, materials)
            scene.add(points)
            // console.log('hi')
        }
        generateGalaxy()
    //#endregion

    //#region GALAXY 2
        let geometrys2 = null
        let materials2 = null
        let points2 = null
        const generateGalaxy2 = () => {

            if(points2 !== null){
                geometrys.dispose()
                materials.dispose()
                scene.remove(points)
            }

            geometrys2 = new THREE.BufferGeometry()
            const positions = new Float32Array(paramenters.count * 3)
            const colors = new Float32Array(paramenters.count * 3)
            const colorInside = new THREE.Color(paramenters.insideColor)
            const colorOutside = new THREE.Color(paramenters.outsideColor)
            

            for(let i = 0; i < paramenters.count * 3; i++){
                const i3 = i * 3

                //Position
                const radius = Math.random() * paramenters.radius
                const branchAngle = (i % paramenters.branches) / paramenters.branches * Math.PI * 0.5
                const spinAngle = radius * paramenters.spin

                const randomY = Math.pow(Math.random(), paramenters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * paramenters.randomness * radius
                const randomZ = Math.pow(Math.random(), paramenters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * paramenters.randomness * radius
                const randomX = Math.pow(Math.random(), paramenters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * paramenters.randomness * radius

                positions[i3] = randomY - 5
                positions[i3 + 1] = Math.sin(branchAngle + spinAngle) * radius + randomZ + 12
                positions[i3 + 2] = Math.tan(branchAngle + spinAngle) * radius + randomX + 0
            
                //Color
                const mixedColor = colorInside.clone()
                mixedColor.lerp(colorOutside, radius/paramenters.radius)

                colors[i3] = mixedColor.r
                colors[i3 + 1] = mixedColor.g
                colors[i3 + 2] = mixedColor.b

                
            }
            geometrys2.setAttribute(
                'position',
                new THREE.BufferAttribute(positions, 3)
            )
            geometrys2.setAttribute(
                'color',
                new THREE.BufferAttribute(colors, 3)
            )
            materials2 = new THREE.PointsMaterial({
                size: paramenters.size,
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true
            })

            points2 = new THREE.Points(geometrys2, materials2)
            scene.add(points2)
            // console.log('hi')
        }
        generateGalaxy2()
    //#endregion
    scene.add(group)

    // Floor
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 20),
        new THREE.MeshStandardMaterial({ 
            color: '#deec5b',
            map: grassColorTexture,
            normalMap: grassNormalTexture,
            roughness: grassRoughnessTexture
         })
    )
    floor.rotation.x = - Math.PI * 0.5
    floor.position.y = 0
    scene.add(floor)

//#endregion

//#region LIGHTING
// Ambient light
    const ambientLight = new THREE.AmbientLight('#ffffff', 0.6)
    gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
    scene.add(ambientLight)

    // Directional light
    const moonLight = new THREE.DirectionalLight('#ffffff', 0.9)
    moonLight.position.set(5, 5, 5)
    gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
    gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
    gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
    gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
    scene.add(moonLight)

//#endregion
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
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
 * Camera
 */
// Base camera

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 25
camera.position.y = 5
camera.position.z = 0
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()