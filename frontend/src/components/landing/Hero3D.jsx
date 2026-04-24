import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshTransmissionMaterial, PerspectiveCamera, Environment, RoundedBox, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function Scene() {
  const cubeRef = useRef()

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    if (cubeRef.current) {
      cubeRef.current.rotation.x += delta * 0.5
      cubeRef.current.rotation.y += delta * 0.7
    }
  })

  return (
    <>
      <ambientLight intensity={0.2} />
      {/* Softened front highlight light */}
      <spotLight position={[0, 5, 10]} angle={0.2} penumbra={1} intensity={1.5} color="#ffffff" />
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#ffffff" />
      
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={cubeRef}>
          {/* The Glass Shell (Size increased to 6) */}
          <RoundedBox args={[6, 6, 6]} radius={1.2} smoothness={10}>
            <MeshTransmissionMaterial
              backside
              samples={16}
              thickness={4}
              roughness={0.02}
              chromaticAberration={0.4}
              anisotropy={0.5}
              distortion={0.5}
              distortionScale={0.5}
              temporalDistortion={0.1}
              clearcoat={1}
              clearcoatRoughness={0}
              transmission={1}
              ior={1.4}
              color="#ffffff"
            />
          </RoundedBox>
          
          {/* Internal Blobs (Scaled up for the massive cube) */}
          <mesh position={[0.6, 0.6, 0.4]}>
            <sphereGeometry args={[2.0, 32, 32]} />
            <meshBasicMaterial color="#ccff00" transparent opacity={0.4} />
          </mesh>
          <mesh position={[-0.6, -0.6, 0.6]}>
            <sphereGeometry args={[1.8, 32, 32]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.3} />
          </mesh>
          <mesh position={[0.6, -0.7, -0.5]}>
            <sphereGeometry args={[2.0, 32, 32]} />
            <meshBasicMaterial color="#ff00ff" transparent opacity={0.4} />
          </mesh>
          <mesh position={[-0.6, 0.7, -0.6]}>
            <sphereGeometry args={[2.1, 32, 32]} />
            <meshBasicMaterial color="#fbbf24" transparent opacity={0.3} />
          </mesh>
        </group>
      </Float>

      <ContactShadows 
        position={[0, -7, 0]} 
        opacity={0.3} 
        scale={25} 
        blur={3} 
        far={7} 
        color="#000000"
      />
    </>
  )
}

export default function Hero3D() {
  return (
    <div className="w-full h-full min-h-[600px] flex items-center justify-center">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 18]} fov={40} />
        <Scene />
        <Environment preset="studio" />
      </Canvas>
    </div>
  )
}
