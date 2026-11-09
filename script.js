
/* =========================================================
   YOUTH AWARE — PREMIUM INTERACTIVE JAVASCRIPT
   Developed by: Raeed Khan
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // 1. MOBILE NAVIGATION MENU
    const menuToggle = document.querySelector(
        ".menu-toggle, .hamburger"
    );

    const navLinks = document.querySelector(".nav-links");

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);
            menuToggle.setAttribute("aria-expanded", isOpen);
        });

        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                menuToggle.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
            });
        });
    }


    // 2. SMOOTH SCROLLING
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", event => {
            const targetId = anchor.getAttribute("href");

            if (!targetId || targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });


    // 3. HEADER SCROLL EFFECT
    const header = document.querySelector(
        ".site-header, header"
    );

    function updateHeader() {
        if (header) {
            header.classList.toggle(
                "scrolled",
                window.scrollY > 40
            );
        }
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();


    // 4. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll(
        ".pillar-card, .team-card, .impact-box, " +
        ".contact-wrapper, .program-card, .about-feature-card, " +
        ".process-grid, .impact-panel, .contact-form-card"
    );

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealElements.forEach(element => {
            element.classList.add("reveal");
            revealObserver.observe(element);
        });

    } else {
        revealElements.forEach(element => {
            element.classList.add("revealed");
        });
    }


    // 5. ANIMATED COUNTERS
    const counters = document.querySelectorAll(
        "[data-count], .counter"
    );

    function animateCounter(element) {
        const target = Number(
            element.dataset.count || element.textContent.replace(/\D/g, "")
        );

        if (!Number.isFinite(target) || target <= 0) return;

        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const progress = Math.min(
                (currentTime - startTime) / duration,
                1
            );

            const eased = 1 - Math.pow(1 - progress, 4);

            element.textContent = Math.floor(
                target * eased
            ).toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }

        requestAnimationFrame(updateCounter);
    }

    if ("IntersectionObserver" in window) {
        const counterObserver = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }


    // 6. CONTACT FORM
    const youthForm = document.getElementById("youthForm");

    if (youthForm) {
        youthForm.addEventListener("submit", event => {
            event.preventDefault();

            if (!youthForm.checkValidity()) {
                youthForm.reportValidity();
                return;
            }

            alert(
                "Thank you for contacting YouthAware! " +
                "Your form has been submitted successfully."
            );

            youthForm.reset();
        });
    }


    // 7. BUTTON RIPPLE EFFECT
    document.querySelectorAll(".button").forEach(button => {

        button.addEventListener("click", event => {

            const ripple = document.createElement("span");

            const rect = button.getBoundingClientRect();

            const size = Math.max(
                rect.width,
                rect.height
            );

            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${event.clientX - rect.left - size / 2}px;
                top: ${event.clientY - rect.top - size / 2}px;
                border-radius: 50%;
                background: rgba(255,255,255,0.25);
                transform: scale(0);
                animation: youthRipple 0.6s ease-out;
                pointer-events: none;
            `;

            button.style.position = "relative";
            button.style.overflow = "hidden";
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 650);
        });

    });


    // 8. CURRENT YEAR IN FOOTER
    const yearElements = document.querySelectorAll(
        "#currentYear, .current-year"
    );

    yearElements.forEach(element => {
        element.textContent = new Date().getFullYear();
    });


    // 9. 3D CANVAS DETECTION
    const threeCanvas = document.getElementById("three-canvas");

    if (threeCanvas) {
        console.log("YouthAware 3D canvas detected.");
    } else {
        console.warn(
            "3D canvas not found. Check the canvas ID in index.html."
        );
    }


    // 10. PAGE LOADED
    document.body.classList.add("page-loaded");

    console.log(
        "%c YOUTH AWARE ",
        "background:#00e5ff;color:#06111c;font-size:20px;font-weight:bold;padding:8px;"
    );

    console.log(
        "Developed by Raeed Khan | Digital Safety & Awareness"
    );

});


// 11. RIPPLE ANIMATION STYLES
const rippleStyle = document.createElement("style");

rippleStyle.textContent = `
@keyframes youthRipple {
    to {
        transform: scale(2);
        opacity: 0;
    }
}

.reveal {
    opacity: 0;
    transform: translateY(35px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

.reveal.revealed {
    opacity: 1;
    transform: translateY(0);
}
`;

document.head.appendChild(rippleStyle);
