/* global THREE */
(function () {
    'use strict';

    if (typeof THREE === 'undefined') {
        document.getElementById('loader').innerHTML =
            '<p style="padding:2rem;text-align:center">Could not load 3D graphics.<br>Check your internet connection and refresh.</p>';
        return;
    }

// ——— Personalize these ———
const CONFIG = {
    herName: 'Beautiful', // Change to her name
    whatsappNumber: '254796092703', // Your number for love notes (optional)
};

const REASONS = [
    'You are the calm in my chaos and the light in every ordinary day. I built this little world so you could feel, even for a moment, how deeply and completely you are loved.',
    'The way you laugh turns ordinary moments into memories I never want to forget.',
    'Your kindness reminds me to be softer with the world—and with myself.',
    'You make "home" a feeling, not a place. Wherever you are, my heart rests.',
    'I fall in love with you again in small ways: your voice, your patience, the way you care.',
];

// ——— Three.js scene ———
const canvas = document.getElementById('scene-canvas');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x1a0a12, 0.035);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
camera.position.set(0, 0, 12);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x1a0a12, 1);

const mouse = new THREE.Vector2(0, 0);
const targetRotation = new THREE.Vector2(0, 0);

// Starfield
function createStars(count) {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const palette = [new THREE.Color(0xffd6e8), new THREE.Color(0xffffff), new THREE.Color(0xffb3c6)];

    for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 80;
        positions[i3 + 1] = (Math.random() - 0.5) * 80;
        positions[i3 + 2] = (Math.random() - 0.5) * 60 - 10;
        const c = palette[Math.floor(Math.random() * palette.length)];
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.12,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    return new THREE.Points(geo, mat);
}

const stars = createStars(2500);
scene.add(stars);

// Heart curve for 3D ribbon
function heartPoint(t, scale = 0.12) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t);
    return new THREE.Vector3(x * scale, y * scale, 0);
}

function createHeartRibbon(color, scale = 0.12) {
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
        points.push(heartPoint((i / segments) * Math.PI * 2, scale));
    }

    const curve = new THREE.CatmullRomCurve3(points, true);
    const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.08, 16, true);
    const mat = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.6,
        metalness: 0.3,
        roughness: 0.4,
    });
    const mesh = new THREE.Mesh(tubeGeo, mat);
    return mesh;
}

const mainHeart = createHeartRibbon(0xff4d8d, 0.14);
scene.add(mainHeart);

const innerHeart = createHeartRibbon(0xff8fab, 0.1);
innerHeart.scale.set(0.85, 0.85, 0.85);
scene.add(innerHeart);

// Floating mini hearts
const floatingHearts = [];
const heartGeo = new THREE.SphereGeometry(0.15, 8, 8);

function spawnFloatingHeart(x = 0, y = 0, z = 0) {
    const mat = new THREE.MeshStandardMaterial({
        color: 0xff6b9d,
        emissive: 0xff4d6d,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });
    const mesh = new THREE.Mesh(heartGeo, mat);
    mesh.position.set(
        x || (Math.random() - 0.5) * 14,
        y || (Math.random() - 0.5) * 10,
        z || (Math.random() - 0.5) * 8
    );
    mesh.userData = {
        speed: 0.01 + Math.random() * 0.02,
        drift: (Math.random() - 0.5) * 0.02,
        life: 1,
    };
    scene.add(mesh);
    floatingHearts.push(mesh);
    if (floatingHearts.length > 80) {
        const old = floatingHearts.shift();
        scene.remove(old);
        old.geometry.dispose();
        old.material.dispose();
    }
}

for (let i = 0; i < 25; i++) spawnFloatingHeart();

// Lights
const ambient = new THREE.AmbientLight(0xffc2d4, 0.4);
scene.add(ambient);

const pointLight = new THREE.PointLight(0xff6b9d, 2, 50);
pointLight.position.set(5, 5, 8);
scene.add(pointLight);

const pointLight2 = new THREE.PointLight(0xffd6a5, 1.2, 40);
pointLight2.position.set(-6, -3, 6);
scene.add(pointLight2);

// Particle burst
const burstParticles = [];
function burstHearts() {
    for (let i = 0; i < 40; i++) {
        spawnFloatingHeart(
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 4,
            (Math.random() - 0.5) * 3
        );
    }
    mainHeart.scale.set(1.15, 1.15, 1.15);
    setTimeout(() => mainHeart.scale.set(1, 1, 1), 400);
}

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    mainHeart.rotation.y = t * 0.35;
    mainHeart.rotation.z = Math.sin(t * 0.5) * 0.1;
    innerHeart.rotation.y = -t * 0.45 + 0.5;
    innerHeart.rotation.x = Math.sin(t * 0.3) * 0.08;

    stars.rotation.y = t * 0.02;
    stars.rotation.x = Math.sin(t * 0.1) * 0.05;

    targetRotation.x += (mouse.y * 0.15 - targetRotation.x) * 0.05;
    targetRotation.y += (mouse.x * 0.2 - targetRotation.y) * 0.05;
    camera.position.x = targetRotation.y * 2;
    camera.position.y = targetRotation.x * 1.5;
    camera.lookAt(0, 0, 0);

    pointLight.position.x = Math.sin(t) * 6;
    pointLight.position.y = Math.cos(t * 0.7) * 4;

    floatingHearts.forEach((h, i) => {
        h.position.y += h.userData.speed;
        h.position.x += h.userData.drift;
        h.rotation.x += 0.02;
        h.rotation.z += 0.02;
        h.userData.life -= 0.003;
        h.material.opacity = h.userData.life;
        if (h.userData.life <= 0) {
            scene.remove(h);
            floatingHearts.splice(i, 1);
        }
    });

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    if (t) {
        mouse.x = (t.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(t.clientY / window.innerHeight) * 2 + 1;
    }
    burstHearts();
});

canvas.addEventListener('click', burstHearts);

// ——— UI ———
document.getElementById('her-name').textContent = CONFIG.herName;

const loader = document.getElementById('loader');
const panels = document.querySelectorAll('.panel');
let currentReason = 0;

function showPanel(name) {
    panels.forEach((p) => {
        p.classList.toggle('hidden', p.dataset.panel !== name);
        p.classList.toggle('active', p.dataset.panel === name);
    });
}

setTimeout(() => loader.classList.add('hidden'), 1800);

document.getElementById('enter-btn').addEventListener('click', () => {
    burstHearts();
    showPanel('letter');
});

document.getElementById('next-reason').addEventListener('click', () => {
    currentReason = (currentReason + 1) % REASONS.length;
    if (currentReason === 0) {
        showPanel('wishes');
        return;
    }
    updateReason();
});

document.querySelectorAll('.dot').forEach((dot) => {
    dot.addEventListener('click', () => {
        currentReason = Number(dot.dataset.reason);
        updateReason();
    });
});

function updateReason() {
    document.getElementById('letter-text').textContent = REASONS[currentReason];
    document.querySelectorAll('.dot').forEach((d) => {
        d.classList.toggle('active', Number(d.dataset.reason) === currentReason);
    });
}

document.getElementById('surprise-btn').addEventListener('click', () => {
    for (let i = 0; i < 5; i++) setTimeout(burstHearts, i * 200);
    showPanel('finale');
});

document.getElementById('send-love').addEventListener('click', () => {
    const note = document.getElementById('love-note').value.trim();
    const message = note
        ? `A note from the stars for you: "${note}"`
        : 'I just opened your love universe—and my heart is full. I love you.';

    if (CONFIG.whatsappNumber) {
        const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    burstHearts();
    document.getElementById('finale-heart').textContent = '♥♥♥';
});

const ambientAudio = document.getElementById('ambient');
const musicToggle = document.getElementById('music-toggle');

musicToggle.addEventListener('click', async () => {
    try {
        if (ambientAudio.paused) {
            await ambientAudio.play();
            musicToggle.classList.add('playing');
        } else {
            ambientAudio.pause();
            musicToggle.classList.remove('playing');
        }
    } catch {
        musicToggle.title = 'Tap again after interacting with the page';
    }
});

updateReason();

})();
