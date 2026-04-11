import { SELECTORS, TYPED_STRINGS } from "../config/constants.js";

export class AnimationController {
    constructor() {
        this.observers = [];
        this.projectObserver = null;
    }

    init() {
        this.setupTypingEffect();
        this.setupScrollReveal();
        this.setupSkillBars();
    }

    setupTypingEffect() {
        const typedElement = document.querySelector(".typedText");

        if (!typedElement || typeof window.Typed === "undefined") {
            return;
        }

        if (window.typingInstance) {
            window.typingInstance.destroy();
        }

        window.typingInstance = new window.Typed(".typedText", {
            strings: TYPED_STRINGS,
            typeSpeed: 70,
            backSpeed: 35,
            backDelay: 1500,
            loop: true,
            showCursor: true,
            cursorChar: "|",
            smartBackspace: false,
            startDelay: 300,
            contentType: "html",
            fadeOut: false,
            fadeOutDelay: 500
        });
    }

    setupScrollReveal() {
        if (typeof window.ScrollReveal === "undefined") {
            return;
        }

        const isMobile = window.innerWidth < 768;
        const sr = window.ScrollReveal({
            origin: "bottom",
            distance: isMobile ? "30px" : "60px",
            duration: isMobile ? 800 : 1000,
            delay: isMobile ? 100 : 200,
            easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            reset: false,
            mobile: true,
            useDelay: isMobile ? "once" : "always"
        });

        sr.reveal(".featured-text", { delay: 100 });
        sr.reveal(".featured-image", { delay: 250, origin: "right" });
        sr.reveal(".about-info", { delay: 100, origin: "left" });
        sr.reveal(".skills-section", { delay: 200, origin: "right" });
        sr.reveal(".top-header", { delay: 100, origin: "top", distance: "30px", interval: 150 });
        sr.reveal(".contact-info", { delay: 100, origin: "left" });
        sr.reveal(".top-footer", { delay: 100, origin: "bottom", distance: "20px" });
        sr.reveal(".middle-footer", { delay: 200, origin: "bottom", distance: "20px" });
        sr.reveal(".footer-social-icons", { delay: 300, origin: "bottom", distance: "20px" });
        sr.reveal(".bottom-footer", { delay: 400, origin: "bottom", distance: "20px" });
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll(".progress");

        if (!skillBars.length) {
            return;
        }

        const observer = new IntersectionObserver((entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const progressBar = entry.target;
                const targetWidth = progressBar.dataset.targetWidth || progressBar.style.width;
                progressBar.style.width = "0%";

                window.setTimeout(() => {
                    progressBar.style.width = targetWidth;
                }, 150);

                currentObserver.unobserve(progressBar);
            });
        }, { threshold: 0.5 });

        skillBars.forEach((bar) => {
            bar.dataset.targetWidth = bar.style.width;
            observer.observe(bar);
        });

        this.observers.push(observer);
    }

    observeProjects() {
        const projectCards = document.querySelectorAll(SELECTORS.projectsReveal);

        if (!projectCards.length) {
            return;
        }

        if (typeof window.ScrollReveal !== "undefined") {
            window.ScrollReveal().reveal(SELECTORS.projectsReveal, {
                delay: 100,
                interval: 100,
                origin: "bottom",
                distance: "30px",
                duration: 600
            });
            return;
        }

        this.projectObserver?.disconnect();
        this.projectObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

        projectCards.forEach((card) => this.projectObserver.observe(card));
    }

    destroy() {
        this.observers.forEach((observer) => observer.disconnect());
        this.projectObserver?.disconnect();

        if (window.typingInstance) {
            window.typingInstance.destroy();
            window.typingInstance = null;
        }
    }
}
