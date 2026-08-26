"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls, ContactShadows } from "@react-three/drei";
import { Suspense } from "react";

import { useTexture, useGLTF } from "@react-three/drei";

function TexturedProduct({ imageUrl }: { imageUrl: string }) {
    const texture = useTexture(imageUrl);

    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={1}
            floatingRange={[-0.1, 0.1]}
        >
            <mesh rotation={[0, 0, 0]}>
                {/* Box with image texture on front/back, white on sides */}
                <boxGeometry args={[3, 4, 0.2]} />
                <meshStandardMaterial attach="material-0" color="white" /> {/* Right */}
                <meshStandardMaterial attach="material-1" color="white" /> {/* Left */}
                <meshStandardMaterial attach="material-2" color="white" /> {/* Top */}
                <meshStandardMaterial attach="material-3" color="white" /> {/* Bottom */}
                <meshStandardMaterial attach="material-4" map={texture} /> {/* Front */}
                <meshStandardMaterial attach="material-5" map={texture} /> {/* Back */}
            </mesh>
        </Float>
    );
}

function ModelViewer({ modelPath }: { modelPath: string }) {
    const { scene } = useGLTF(modelPath);

    return (
        <Float
            speed={2}
            rotationIntensity={0.5}
            floatIntensity={1}
            floatingRange={[-0.1, 0.1]}
        >
            <primitive object={scene} scale={2} position={[0, -1, 0]} />
        </Float>
    );
}

export default function ProductScene({ imageUrl, modelPath }: { imageUrl: string; modelPath?: string }) {
    return (
        <div className="h-full w-full min-h-[500px] relative bg-secondary/20 rounded-xl overflow-hidden">
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                gl={{ alpha: true, antialias: true }}
                dpr={[1, 2]}
            >
                <Suspense fallback={null}>
                    <ambientLight intensity={1} />
                    <spotLight
                        position={[10, 10, 10]}
                        angle={0.15}
                        penumbra={1}
                        intensity={500}
                        castShadow
                    />
                    <pointLight position={[-10, -10, -10]} intensity={500} />

                    <Environment preset="studio" />

                    {modelPath ? (
                        <ModelViewer modelPath={modelPath} />
                    ) : (
                        <TexturedProduct imageUrl={imageUrl} />
                    )}

                    {/* Full 360 Interaction */}
                    <OrbitControls
                        enableZoom={true}
                        minDistance={4}
                        maxDistance={12}
                        autoRotate={false}
                    />

                    <ContactShadows position={[0, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4.5} />
                </Suspense>
            </Canvas>

            {/* Interaction Hint */}
            <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                <span className="text-xs text-muted-foreground bg-background/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    Drag to Rotate • 3D Preview
                </span>
            </div>
        </div>
    );
}
