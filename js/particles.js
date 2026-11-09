
/* =========================================================
   YOUTH AWARE — DIGITAL PARTICLE NETWORK
   Developed by: Raeed Khan
   Interactive Cybersecurity Background
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const container = document.getElementById("particle-background");

    if (!container) {
        console.warn("YouthAware: Particle container not found.");
        return;
    }

    // CANVAS SETUP
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.style.cssText = `
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    `;

    container.style.position = "absolute";
    container.style.inset = "0";
    container.style.overflow = "hidden";
    container.style.pointerEvents = "none";

    container.appendChild(canvas);


    // CONFIGURATION
    const CONFIG = {
        particleCount: window.innerWidth < 768 ? 45 : 90,
        connectionDistance: 145,
        mouseDistance: 180,
        speed: 0.35,
        particleSize: 1.6
    };


    // CANVAS SIZE
    let width = 0;
    let height = 0;

    function resizeCanvas() {

        const rect = container.getBoundingClientRect();

        width = rect.width;
        height = rect.height;

        const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;

        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );
    }

    resizeCanvas();


    // MOUSE POSITION
    const mouse = {
        x: null,
        y: null,
        active: false
    };

    container.addEventListener("pointermove", event => {

        const rect = container.getBoundingClientRect();

        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
        mouse.active = true;

    });

    container.addEventListener("pointerleave", () => {

        mouse.x = null;
        mouse.y = null;
        mouse.active = false;

    });


    // PARTICLE CLASS
    class Particle {

        constructor() {
            this.reset(true);
        }

        reset(randomPosition = false) {

            this.x = randomPosition
                ? Math.random() * width
                : Math.random() * width;

            this.y = randomPosition
                ? Math.random() * height
                : Math.random() * height;

            this.vx = (Math.random() - 0.5) * CONFIG.speed;
            this.vy = (Math.random() - 0.5) * CONFIG.speed;

            this.radius =
                Math.random() * CONFIG.particleSize + 0.5;

            this.alpha =
                Math.random() * 0.5 + 0.25;

            this.phase = Math.random() * Math.PI * 2;
        }


        update(time) {

            // NATURAL MOVEMENT
            this.x += this.vx;
            this.y += this.vy;

            // SOFT BOUNDARIES
            if (this.x < 0 || this.x > width) {
                this.vx *= -1;
            }

            if (this.y < 0 || this.y > height) {
                this.vy *= -1;
            }

            // MOUSE INTERACTION
            if (mouse.active) {

                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (
                    distance < CONFIG.mouseDistance &&
                    distance > 0
                ) {

                    const force =
                        (CONFIG.mouseDistance - distance) /
                        CONFIG.mouseDistance;

                    this.x +=
                        (dx / distance) * force * 0.7;

                    this.y +=
                        (dy / distance) * force * 0.7;
                }
            }

            // GENTLE TWINKLE
            this.currentAlpha =
                this.alpha *
                (0.75 + Math.sin(time * 0.002 + this.phase) * 0.25);
        }


        draw() {

            ctx.beginPath();

            ctx.arc(
                this.x,
                this.y,
                this.radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(0, 220, 255, ${this.currentAlpha})`;

            ctx.shadowBlur = 9;
            ctx.shadowColor = "#00dfff";

            ctx.fill();

            ctx.shadowBlur = 0;
        }

    }


    // CREATE PARTICLES
    let particles = [];

    function createParticles() {

        particles = [];

        for (
            let i = 0;
            i < CONFIG.particleCount;
            i++
        ) {
            particles.push(new Particle());
        }
    }

    createParticles();


    // CONNECT PARTICLES
    function drawConnections() {

        for (let i = 0; i < particles.length; i++) {

            for (
                let j = i + 1;
                j < particles.length;
                j++
            ) {

                const dx =
                    particles[i].x - particles[j].x;

                const dy =
                    particles[i].y - particles[j].y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < CONFIG.connectionDistance) {

                    const opacity =
                        (1 - distance / CONFIG.connectionDistance) *
                        0.24;

                    ctx.beginPath();

                    ctx.moveTo(
                        particles[i].x,
                        particles[i].y
                    );

                    ctx.lineTo(
                        particles[j].x,
                        particles[j].y
                    );

                    ctx.strokeStyle =
                        `rgba(0, 180, 255, ${opacity})`;

                    ctx.lineWidth = 0.7;

                    ctx.stroke();
                }

            }

        }

    }


    // MOUSE NETWORK CONNECTIONS
    function drawMouseConnections() {

        if (!mouse.active) return;

        particles.forEach(particle => {

            const dx = particle.x - mouse.x;
            const dy = particle.y - mouse.y;

            const distance = Math.sqrt(
                dx * dx + dy * dy
            );

            if (distance < CONFIG.mouseDistance) {

                const opacity =
                    (1 - distance / CONFIG.mouseDistance) * 0.4;

                ctx.beginPath();

                ctx.moveTo(mouse.x, mouse.y);

                ctx.lineTo(particle.x, particle.y);

                ctx.strokeStyle =
                    `rgba(0, 229, 255, ${opacity})`;

                ctx.lineWidth = 0.8;

                ctx.stroke();
            }

        });

    }


    // ANIMATION LOOP
    let animationFrame;
    let running = true;

    function animate(time) {

        if (!running) return;

        animationFrame = requestAnimationFrame(animate);

        ctx.clearRect(0, 0, width, height);

        // UPDATE PARTICLES
        particles.forEach(particle => {
            particle.update(time);
        });

        // DRAW NETWORK
        drawConnections();

        drawMouseConnections();

        // DRAW PARTICLES
        particles.forEach(particle => {
            particle.draw();
        });

    }


    // PERFORMANCE CONTROL
    const observer = new IntersectionObserver(entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting && !running) {

                running = true;
                animate(performance.now());

            } else if (!entry.isIntersecting && running) {

                running = false;
                cancelAnimationFrame(animationFrame);

            }

        });

    });

    observer.observe(container);

    animate(0);


    // RESIZE HANDLING
    let resizeTimer;

    window.addEventListener("resize", () => {

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(() => {

            resizeCanvas();

            CONFIG.particleCount =
                window.innerWidth < 768 ? 45 : 90;

            createParticles();

        }, 150);

    });


    // REDUCED MOTION SUPPORT
    const motionPreference = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );

    if (motionPreference.matches) {

        running = false;

        cancelAnimationFrame(animationFrame);

        ctx.clearRect(0, 0, width, height);

    }

    console.log(
        "YouthAware: Digital Particle Network Activated."
    );

});
