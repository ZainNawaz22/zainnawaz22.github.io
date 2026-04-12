export class SectionTracker {
    constructor() {
        this.navLinks = [...document.querySelectorAll(".rail-nav-link")];
        this.sections = this.navLinks
            .map((link) => document.getElementById(link.dataset.section))
            .filter(Boolean);
        this.observer = null;
    }

    init() {
        if (!this.sections.length) {
            return;
        }

        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    const id = entry.target.getAttribute("id");
                    this.setActive(id);
                });
            },
            {
                rootMargin: "-20% 0px -60% 0px",
                threshold: 0
            }
        );

        this.sections.forEach((section) => this.observer.observe(section));

        this.navLinks.forEach((link) => {
            link.addEventListener("click", (event) => this.handleClick(event));
        });
    }

    setActive(sectionId) {
        this.navLinks.forEach((link) => {
            const isActive = link.dataset.section === sectionId;
            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "true");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    handleClick(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute("href");
        const target = document.querySelector(targetId);

        if (target) {
            target.scrollIntoView({ behavior: "smooth" });
        }
    }

    destroy() {
        this.observer?.disconnect();
    }
}
