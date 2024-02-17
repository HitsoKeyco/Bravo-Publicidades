import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Preload, useGLTF, useHelper } from '@react-three/drei';
import CanvasLoader from '../Loader';
import { DirectionalLightHelper, PointLightHelper } from 'three';

const Computers = (isMobile) => {
  const computer = useGLTF('./desktop_pc/plotter.gltf');
  const dirLight = useRef();
  const pointLight = useRef();
  const pointLight_2 = useRef();
  const pointLight_3 = useRef();
  const groupRef = useRef();

  const [rotationAngle, setRotationAngle] = useState(0);

  useHelper(dirLight, DirectionalLightHelper, 1, 'red');
  useHelper(pointLight, PointLightHelper, 1, 'white');
  useHelper(pointLight_2, PointLightHelper, 1, 'white');
  useHelper(pointLight_3, PointLightHelper, 1, 'white');

  // Define la función para actualizar la rotación en cada cuadro de animación
  useFrame(() => {
    setRotationAngle((prevAngle) => prevAngle + 0.003);
  });

  return (
    
    <group ref={groupRef} position={[0, -1, 0]} rotation={[0, rotationAngle, 0]}>
      <mesh position={isMobile ? [0, 0, 0] : [0, 0, 0]} receiveShadow>
        <directionalLight position={[0, 2, 0]} intensity={2} color="white" />
        <pointLight position={[2, 1, -1.5]} intensity={50} color="#A7FF83" distance={15} />
        <pointLight position={[-3, 1, -1.5]} intensity={100} color="#00FFC2" distance={15} />
        <pointLight position={[1.8, 0.4, -1]} intensity={10} color="yellow" distance={15} />

        <primitive
          object={computer.scene}
          scale={isMobile ? 0.2 : 0.5}

        />
      </mesh>
    </group>
  );
};

const ComputersCanvas = () => {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 500px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for changes to the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas frameloop="demand" shadows camera={{ position: [10, 5, 0], fov: 25 }} gl={{ preserveDrawingBuffer: true }}  >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          enableRotate={true}
          maxPolarAngle={Math.PI - 0.05}
          minPolarAngle={Math.PI - 45}
        />
        <Computers isMobile={isMobile} />
        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default ComputersCanvas;
