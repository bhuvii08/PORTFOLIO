document.addEventListener("DOMContentLoaded", () => {
    const nav = document.querySelector(".navbar");
    const menuToggle = document.querySelector(".menu-toggle");
    const navLinks = document.querySelector(".nav-links");
    const navAnchors = document.querySelectorAll(".nav-links a");
    const typingElement = document.getElementById("typing");
    const progressBar = document.getElementById("progress-bar");
    const yearElement = document.getElementById("year");
    const tiltTargets = document.querySelectorAll(
        ".hero-visual, .hero-metrics article, .panel, .skill-card, .project-card, .contact-card, .achievement-card, .timeline-item"
    );

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", () => {
            const isOpen = navLinks.classList.toggle("open");
            menuToggle.setAttribute("aria-expanded", String(isOpen));
            document.body.classList.toggle("nav-open", isOpen);
        });
    }

    navAnchors.forEach((anchor) => {
        anchor.addEventListener("click", () => {
            navLinks?.classList.remove("open");
            menuToggle?.setAttribute("aria-expanded", "false");
            document.body.classList.remove("nav-open");
        });
    });

    const typingPhrases = [
        "frontend experiences.",
        "AI-powered ideas.",
        "full stack systems.",
        "responsive interfaces."
    ];

    if (typingElement) {
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        const tick = () => {
            const currentPhrase = typingPhrases[phraseIndex];
            typingElement.textContent = currentPhrase.slice(0, charIndex);

            let delay = isDeleting ? 55 : 95;

            if (!isDeleting && charIndex === currentPhrase.length) {
                delay = 1300;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % typingPhrases.length;
                delay = 250;
            }

            charIndex += isDeleting ? -1 : 1;
            window.setTimeout(tick, delay);
        };

        tick();
    }

    const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (supportsHover) {
        tiltTargets.forEach((target) => {
            let animationFrameId = 0;

            const resetTilt = () => {
                target.style.setProperty("--tilt-x", "0px");
                target.style.setProperty("--tilt-y", "0px");
                target.style.setProperty("--tilt-rotate-x", "0deg");
                target.style.setProperty("--tilt-rotate-y", "0deg");
            };
            target.addEventListener("pointermove", (event) => {
                const bounds = target.getBoundingClientRect();
                const offsetX = event.clientX - bounds.left;
                const offsetY = event.clientY - bounds.top;
                const centerX = bounds.width / 2;
                const centerY = bounds.height / 2;
                const rotateY = ((offsetX - centerX) / centerX) * 9;
                const rotateX = ((centerY - offsetY) / centerY) * 9;

                window.cancelAnimationFrame(animationFrameId);
                animationFrameId = window.requestAnimationFrame(() => {
                    target.style.setProperty("--tilt-x", "0px");
                    target.style.setProperty("--tilt-y", "0px");
                    target.style.setProperty("--tilt-rotate-x", `${rotateX.toFixed(2)}deg`);
                    target.style.setProperty("--tilt-rotate-y", `${rotateY.toFixed(2)}deg`);
                });
            });

            target.addEventListener("pointerleave", () => {
                window.cancelAnimationFrame(animationFrameId);
                resetTilt();
            });
        });
    }

    const revealItems = document.querySelectorAll("[data-reveal]");
    revealItems.forEach((item) => item.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.18 }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const sections = document.querySelectorAll("main section[id]");
    const updateActiveLink = () => {
        const scrollPosition = window.scrollY + window.innerHeight * 0.35;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                navAnchors.forEach((anchor) => {
                    const isActive = anchor.getAttribute("href") === `#${section.id}`;
                    anchor.classList.toggle("active", isActive);
                });
            }
        });
    };

    const updateScrollState = () => {
        const scrollTop = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        nav?.classList.toggle("scrolled", scrollTop > 24);
        updateActiveLink();
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });

    navAnchors.forEach((anchor) => {
        anchor.addEventListener("click", (event) => {
            const href = anchor.getAttribute("href");

            if (!href || !href.startsWith("#")) {
                return;
            }

            const target = document.querySelector(href);
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });
});