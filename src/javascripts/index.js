// index.js

let particlesData = []
let camera, scene, renderer, group, linesMesh, particles, pointCloud, particlePositions
let mouseX = 0, mouseY = 0

let particleCount = 200
let maxParticleCount = 600
let radius = 800

let effectController = {
  minDistance: 150,
  limitConnections: false,
  maxConnections: 1000
}

function init() {
  let container = document.getElementById('canvas')

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 )
  camera.position.z = 500
  
  scene = new THREE.Scene()
  group = new THREE.Group()
  scene.add( group )
  
  let segments = maxParticleCount * maxParticleCount;
  positions = new Float32Array( segments * 3 )
  colors = new Float32Array( segments * 3 )
  
  let particlesMaterial = new THREE.PointsMaterial()

  particles = new THREE.BufferGeometry()
  particlePositions = new Float32Array( maxParticleCount * 3 )

  for ( let i = 0; i < maxParticleCount; i ++ ) {
    let x = Math.random() * radius - radius / 2
    let y = Math.random() * radius - radius / 2
    let z = Math.random() * radius - radius / 2

    particlePositions[ i * 3 ] = x
    particlePositions[ i * 3 + 1 ] = y
    particlePositions[ i * 3 + 2 ] = z

    particlesData.push( {
      velocity: new THREE.Vector3( - 1 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2 ),
      numConnections: 0
    } )
  }
  
  particles.setDrawRange( 0, particleCount )
  particles.addAttribute( 'position', new THREE.BufferAttribute( particlePositions, 3 ).setDynamic( true ) )
  
  pointCloud = new THREE.Points( particles, particlesMaterial )
  group.add( pointCloud )
  
  let geometry = new THREE.BufferGeometry()
  
  geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ).setDynamic( true ) )
  geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ).setDynamic( true ) )
  geometry.computeBoundingSphere()
  geometry.setDrawRange( 0, 0 )
    
  let material = new THREE.LineBasicMaterial( {
    color: 0xdddddd,
    blending: THREE.AdditiveBlending,
    transparent: true
  } )

  linesMesh = new THREE.LineSegments( geometry, material )
  group.add( linesMesh )

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )

  container.appendChild( renderer.domElement )

  window.addEventListener( 'resize', onWindowResize, false )
  document.addEventListener( 'mousemove', onDocumentMouseMove, false )
  document.addEventListener( 'mouseover', onDocumentMouseMove, false )
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )
}

function onDocumentMouseMove( event ) {
  const windowHalfX = window.innerWidth / 2
  const windowHalfY = window.innerHeight / 2
  mouseX = ( event.clientX - windowHalfX ) / 2
  mouseY = ( event.clientY - windowHalfY ) / 2
}

function animate() {
  let vertexpos = 0;
  let colorpos = 0;
  let numConnected = 0;

  for ( let i = 0; i < particleCount; i ++ )
    particlesData[ i ].numConnections = 0
  
  for ( let i = 0; i < particleCount; i ++ ) {
    // get the particle
    let particleData = particlesData[ i ]
    particlePositions[ i * 3 ] += particleData.velocity.x
    particlePositions[ i * 3 + 1 ] += particleData.velocity.y
    particlePositions[ i * 3 + 2 ] += particleData.velocity.z
    
    if ( particlePositions[ i * 3 + 1 ] < - radius / 2 || particlePositions[ i * 3 + 1 ] > radius / 2 )
      particleData.velocity.y = - particleData.velocity.y
    
    if ( particlePositions[ i * 3 ] < - radius / 2 || particlePositions[ i * 3 ] > radius / 2 )
      particleData.velocity.x = - particleData.velocity.x
    
    if ( particlePositions[ i * 3 + 2 ] < - radius / 2 || particlePositions[ i * 3 + 2 ] > radius / 2 )
      particleData.velocity.z = - particleData.velocity.z

    if ( effectController.limitConnections && particleData.numConnections >= effectController.maxConnections )
      continue
    
    // Check collision
    for ( let j = i + 1; j < particleCount; j ++ ) {
      let particleDataB = particlesData[ j ]

      if ( effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections )
			  continue
      
      let dx = particlePositions[ i * 3 ] - particlePositions[ j * 3 ]
      let dy = particlePositions[ i * 3 + 1 ] - particlePositions[ j * 3 + 1 ]
      let dz = particlePositions[ i * 3 + 2 ] - particlePositions[ j * 3 + 2 ]
      let dist = Math.sqrt( dx * dx + dy * dy + dz * dz )

      if ( dist < effectController.minDistance ) {
        particleData.numConnections++;
        particleDataB.numConnections++;

        let alpha = 1.0 - dist / effectController.minDistance;
        positions[ vertexpos ++ ] = particlePositions[ i * 3 ]
        positions[ vertexpos ++ ] = particlePositions[ i * 3 + 1 ]
        positions[ vertexpos ++ ] = particlePositions[ i * 3 + 2 ]
        positions[ vertexpos ++ ] = particlePositions[ j * 3 ]
        positions[ vertexpos ++ ] = particlePositions[ j * 3 + 1 ]
        positions[ vertexpos ++ ] = particlePositions[ j * 3 + 2 ]
        colors[ colorpos ++ ] = alpha;
        colors[ colorpos ++ ] = alpha;
        colors[ colorpos ++ ] = alpha;
        colors[ colorpos ++ ] = alpha;
        colors[ colorpos ++ ] = alpha;
        colors[ colorpos ++ ] = alpha;
        numConnected ++;
      }
    }
  }

  linesMesh.geometry.setDrawRange( 0, numConnected * 2 )
  linesMesh.geometry.attributes.position.needsUpdate = true
  linesMesh.geometry.attributes.color.needsUpdate = true
  pointCloud.geometry.attributes.position.needsUpdate = true

  requestAnimationFrame( animate )

  camera.position.x += ( mouseX - camera.position.x ) * 0.05
  camera.position.y += ( - mouseY - camera.position.y ) * 0.05
  camera.lookAt( scene.position )

  renderer.render( scene, camera )
}

init()
animate()