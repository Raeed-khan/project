
/* =========================================================
   YOUTH AWARE — PREMIUM ANIMATION ENGINE
   Developed by: Raeed Khan
   GSAP + ScrollTrigger + Lenis
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // CHECK ANIMATION LIBRARIES
    if (typeof gsap === "undefined") {
        console.warn("GSAP library not found.");
        return;
    }

    gsap.registerPlugin(ScrollTrigger);


    // 1. REDUCED MOTION ACCESSIBILITY
    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
        gsap.set("*", {
            clearProps: "transform,opacity"
        });

        const preloader = document.getElementById("preloader");

        if (preloader) preloader.style.display = "none";

        return;
    }


    // 2. LENIS SMOOTH SCROLL
    let lenis = null;

    if (typeof Lenis !== "undefined") {

        lenis = new Lenis({
            duration: 1.15,
            smoothWheel: true,
            wheelMultiplier: 0.9,
            touchMultiplier: 1.5,
            easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });

        lenis.on("scroll", ScrollTrigger.update);

        gsap.ticker.add(time => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        console.log("YouthAware: Smooth scrolling activated.");

    } else {
        console.warn("Lenis library not found.");
    }


    // 3. PRELOADER ANIMATION
    const preloader = document.getElementById("preloader");

    function hidePreloader() {

        if (!preloader) return;

        gsap.to(preloader, {
            opacity: 0,
            duration: 0.8,
            ease: "power3.inOut",
            onComplete: () => {
                preloader.style.display = "none";
                document.body.classList.add("page-loaded");
                startHeroAnimation();
            }
        });
    }

    window.addEventListener("load", hidePreloader, {
        once: true
    });

    // Fallback if page load event has already fired
    if (document.readyState === "complete") {
        hidePreloader();
    }


    // 4. HERO ENTRANCE ANIMATION
    function startHeroAnimation() {

        const heroTimeline = gsap.timeline({
            defaults: {
                ease: "power4.out"
            }
        });

        heroTimeline
            .from(".hero-eyebrow", {
                y: 25,
                opacity: 0,
                duration: 0.8
            })

            .from(".hero-heading", {
                y: 55,
                opacity: 0,
                duration: 1.1
            }, "-=0.45")

            .from(".hero-description", {
                y: 25,
                opacity: 0,
                duration: 0.8
            }, "-=0.65")

            .from(".hero-actions .button", {
                y: 25,
                opacity: 0,
                stagger: 0.15,
                duration: 0.7
            }, "-=0.5")

            .from(".hero-metric", {
                y: 20,
                opacity: 0,
                stagger: 0.12,
                duration: 0.7
            }, "-=0.4")

            .from(".hero-visual", {
                x: 60,
                opacity: 0,
                scale: 0.9,
                duration: 1.2
            }, "-=1.1");

    }


    // 5. NAVBAR ENTRANCE
    gsap.from(".site-header", {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
    });


    // 6. FLOATING INFORMATION CARDS
    const floatingCards = document.querySelectorAll(
        ".floating-card"
    );

    floatingCards.forEach((card, index) => {

        gsap.to(card, {
            y: index === 0 ? -12 : 12,
            duration: 2.5 + index * 0.5,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    });


    // 7. SECTION REVEAL ANIMATIONS
    const revealSections = document.querySelectorAll(
        ".section-heading, .about-main-card, " +
        ".about-feature-card, .program-card, " +
        ".impact-panel, .process-item, .team-card, " +
        ".contact-content, .contact-form-card"
    );

    revealSections.forEach((element, index) => {

        gsap.fromTo(
            element,
            {
                y: 45,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: element,
                    start: "top 88%",
                    once: true
                }
            }
        );

    });


    // 8. PROGRAM CARD HOVER EFFECT
    document.querySelectorAll(".program-card").forEach(card => {

        card.addEventListener("mouseenter", () => {

            gsap.to(card, {
                y: -12,
                duration: 0.35,
                ease: "power2.out"
            });

        });

        card.addEventListener("mouseleave", () => {

            gsap.to(card, {
                y: 0,
                duration: 0.45,
                ease: "power2.out"
            });

        });

    });


    // 9. TEAM CARD HOVER EFFECT
    document.querySelectorAll(".team-card").forEach(card => {

        card.addEventListener("mouseenter", () => {

            gsap.to(card, {
                y: -10,
                duration: 0.35,
                ease: "power2.out"
            });

        });

        card.addEventListener("mouseleave", () => {

            gsap.to(card, {
                y: 0,
                duration: 0.4,
                ease: "power2.out"
            });

        });

    });


    // 10. IMPACT NUMBERS ANIMATION
    const impactCounters = document.querySelectorAll(
        ".impact-stat .counter"
    );

    impactCounters.forEach(counter => {

        const target = Number(counter.dataset.target);
        const suffix = counter.dataset.suffix || "";

        if (!Number.isFinite(target)) return;

        const counterObject = {
            value: 0
        };

        ScrollTrigger.create({
            trigger: counter,
            start: "top 90%",
            once: true,

            onEnter: () => {

                gsap.to(counterObject, {
                    value: target,
                    duration: 2,
                    ease: "power2.out",

                    onUpdate: () => {

                        counter.textContent =
                            Math.floor(counterObject.value).toLocaleString()
                            + suffix;

                    }
                });

            }
        });

    });


    // 11. SCROLL PROGRESS INDICATOR
    const progressBar = document.createElement("div");

    progressBar.className = "scroll-progress";

    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00e5ff, #4169ff);
        z-index: 99999;
        pointer-events: none;
        box-shadow: 0 0 12px rgba(0,229,255,0.7);
    `;

    document.body.appendChild(progressBar);

    gsap.to(progressBar, {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.2
        }
    });


    // 12. SCROLL INDICATOR
    const scrollIndicator = document.querySelector(
        ".scroll-indicator"
    );

    if (scrollIndicator) {

        gsap.to(scrollIndicator, {
            y: 10,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

    }


    // 13. REFRESH SCROLL TRIGGER
    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

    console.log(
        "%c YOUTH AWARE ANIMATION ENGINE ",
        "background:#00e5ff;color:#050816;padding:8px;font-weight:bold;"
    );

});
