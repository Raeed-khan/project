
/* =========================================================
   YOUTH AWARE — 3D CYBERSECURITY EXPERIENCE
   Developed by: Raeed Khan
   Three.js Interactive Shield
   ========================================================= */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js";

const canvas = document.getElementById("three-canvas");
const container = document.getElementById("three-container");

if (!canvas || !container) {
    console.error("YouthAware: 3D canvas or container not found.");
} else {

    // SCENE SETUP
    const scene = new THREE.Scene();

    scene.fog = new THREE.FogExp2(0x050816, 0.035);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
        40,
        1,
        0.1,
        100
    );

    camera.position.set(0, 0, 8);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );

    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(
        0x8abfff,
        1.5
    );

    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(
        0x00e5ff,
        35,
        15
    );

    cyanLight.position.set(3, 3, 4);
    scene.add(cyanLight);

    const blueLight = new THREE.PointLight(
        0x2455ff,
        30,
        15
    );

    blueLight.position.set(-3, -2, 3);
    scene.add(blueLight);


    // MAIN 3D GROUP
    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);


    // SHIELD SHAPE
    const shieldShape = new THREE.Shape();

    shieldShape.moveTo(0, 1.65);
    shieldShape.lineTo(1.15, 1.15);
    shieldShape.lineTo(0.95, 0.05);

    shieldShape.quadraticCurveTo(
        0.75, -1.0,
        0, -1.55
    );

    shieldShape.quadraticCurveTo(
        -0.75, -1.0,
        -0.95, 0.05
    );

    shieldShape.lineTo(-1.15, 1.15);
    shieldShape.lineTo(0, 1.65);


    // SHIELD GEOMETRY
    const shieldGeometry = new THREE.ExtrudeGeometry(
        shieldShape,
        {
            depth: 0.25,
            bevelEnabled: true,
            bevelSegments: 5,
            steps: 1,
            bevelSize: 0.08,
            bevelThickness: 0.08
        }
    );

    shieldGeometry.center();


    // SHIELD MATERIAL
    const shieldMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x071c3c,
        metalness: 0.8,
        roughness: 0.2,
        transparent: true,
        opacity: 0.92,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        emissive: 0x003d66,
        emissiveIntensity: 0.8
    });

    const shield = new THREE.Mesh(
        shieldGeometry,
        shieldMaterial
    );

    shieldGroup.add(shield);


    // SHIELD OUTLINE
    const outlineGeometry = new THREE.EdgesGeometry(
        shieldGeometry
    );

    const outlineMaterial = new THREE.LineBasicMaterial({
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.9
    });

    const shieldOutline = new THREE.LineSegments(
        outlineGeometry,
        outlineMaterial
    );

    shieldGroup.add(shieldOutline);


    // INNER SHIELD SYMBOL
    const coreGeometry = new THREE.IcosahedronGeometry(
        0.48,
        1
    );

    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x00cfff,
        metalness: 0.6,
        roughness: 0.15,
        emissive: 0x0077ff,
        emissiveIntensity: 1.8,
        wireframe: false
    });

    const core = new THREE.Mesh(
        coreGeometry,
        coreMaterial
    );

    core.position.z = 0.35;
    shieldGroup.add(core);


    // INNER WIRE STRUCTURE
    const wireGeometry = new THREE.IcosahedronGeometry(
        0.57,
        1
    );

    const wireMaterial = new THREE.MeshBasicMaterial({
        color: 0x00eaff,
        wireframe: true,
        transparent: true,
        opacity: 0.55
    });

    const wireCore = new THREE.Mesh(
        wireGeometry,
        wireMaterial
    );

    wireCore.position.z = 0.38;
    shieldGroup.add(wireCore);


    // ROTATING ORBIT RINGS
    const rings = [];

    function createRing(radius, tube, color, rotation) {

        const geometry = new THREE.TorusGeometry(
            radius,
            tube,
            16,
            120
        );

        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.7
        });

        const ring = new THREE.Mesh(
            geometry,
            material
        );

        ring.rotation.set(
            rotation.x,
            rotation.y,
            rotation.z
        );

        shieldGroup.add(ring);
        rings.push(ring);

        return ring;
    }

    createRing(
        1.75,
        0.018,
        0x00e5ff,
        { x: 1.1, y: 0.3, z: 0.2 }
    );

    createRing(
        2.0,
        0.012,
        0x2455ff,
        { x: 0.5, y: 1.0, z: 0.7 }
    );

    createRing(
        2.25,
        0.009,
        0x00aaff,
        { x: 1.5, y: 0.2, z: 0.4 }
    );


    // FLOATING PARTICLES
    const particleCount = 900;

    const particlePositions = new Float32Array(
        particleCount * 3
    );

    for (let i = 0; i < particleCount; i++) {

        const i3 = i * 3;

        particlePositions[i3] =
            (Math.random() - 0.5) * 12;

        particlePositions[i3 + 1] =
            (Math.random() - 0.5) * 12;

        particlePositions[i3 + 2] =
            (Math.random() - 0.5) * 8;
    }

    const particleGeometry = new THREE.BufferGeometry();

    particleGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(
            particlePositions,
            3
        )
    );

    const particleMaterial = new THREE.PointsMaterial({
        color: 0x00d9ff,
        size: 0.025,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(
        particleGeometry,
        particleMaterial
    );

    scene.add(particles);


    // BACKGROUND ENERGY SPHERE
    const glowGeometry = new THREE.SphereGeometry(
        2.7,
        32,
        32
    );

    const glowMaterial = new THREE.MeshBasicMaterial({
        color: 0x0055ff,
        transparent: true,
        opacity: 0.045,
        side: THREE.BackSide
    });

    const glowSphere = new THREE.Mesh(
        glowGeometry,
        glowMaterial
    );

    shieldGroup.add(glowSphere);


    // MOUSE INTERACTION
    let mouseX = 0;
    let mouseY = 0;

    container.addEventListener("pointermove", event => {

        const rect = container.getBoundingClientRect();

        mouseX = (
            (event.clientX - rect.left) /
            rect.width - 0.5
        ) * 2;

        mouseY = (
            (event.clientY - rect.top) /
            rect.height - 0.5
        ) * 2;

    });

    container.addEventListener("pointerleave", () => {
        mouseX = 0;
        mouseY = 0;
    });


    // RESPONSIVE RESIZE
    function resizeScene() {

        const width = container.clientWidth;
        const height = container.clientHeight;

        if (!width || !height) return;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize(width, height, false);
    }

    const resizeObserver = new ResizeObserver(resizeScene);

    resizeObserver.observe(container);

    resizeScene();


    // ANIMATION LOOP
    const clock = new THREE.Clock();

    let animationFrame;

    function animate() {

        animationFrame = requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Shield floating movement
        shieldGroup.position.y =
            Math.sin(elapsed * 0.8) * 0.12;

        // Main shield rotation
        shieldGroup.rotation.y +=
            (mouseX * 0.25 - shieldGroup.rotation.y) * 0.025;

        shieldGroup.rotation.x +=
            (-mouseY * 0.18 - shieldGroup.rotation.x) * 0.025;

        // Core rotation
        core.rotation.x = elapsed * 0.45;
        core.rotation.y = elapsed * 0.65;

        wireCore.rotation.x = -elapsed * 0.3;
        wireCore.rotation.y = elapsed * 0.4;

        // Orbit rotation
        rings.forEach((ring, index) => {

            ring.rotation.z +=
                0.0015 * (index + 1);

        });

        // Energy pulse
        const pulse =
            0.75 + Math.sin(elapsed * 2.5) * 0.25;

        shieldMaterial.emissiveIntensity = pulse;
        coreMaterial.emissiveIntensity = pulse * 2;

        // Particle movement
        particles.rotation.y = elapsed * 0.018;
        particles.rotation.x = Math.sin(elapsed * 0.15) * 0.08;

        // Render
        renderer.render(scene, camera);
    }

    animate();


    // CLEANUP
    window.addEventListener("beforeunload", () => {

        cancelAnimationFrame(animationFrame);

        resizeObserver.disconnect();

        renderer.dispose();

        shieldGeometry.dispose();
        shieldMaterial.dispose();

        coreGeometry.dispose();
        coreMaterial.dispose();

        wireGeometry.dispose();
        wireMaterial.dispose();

        particleGeometry.dispose();
        particleMaterial.dispose();

        outlineGeometry.dispose();
        outlineMaterial.dispose();

        rings.forEach(ring => {
            ring.geometry.dispose();
            ring.material.dispose();
        });
    });

    console.log(
        "YouthAware 3D Cybersecurity Experience Initialized."
    );
}
