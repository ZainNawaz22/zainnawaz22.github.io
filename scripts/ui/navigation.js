import { debounce, throttle } from "../core/utils.js";

export class NavigationController {
    constructor(elements) {
        this.elements = elements;
        this.isMenuOpen = false;
        this.boundScroll = throttle(this.handleScroll.bind(this), 16);
        this.boundResize = debounce(this.handleResize.bind(this), 250);
        this.boundKeydown = this.handleKeydown.bind(this);
        this.boundDocumentClick = this.handleDocumentClick.bind(this);
    }

    init() {
        window.addEventListener("scroll", this.boundScroll, { passive: true });
        window.addEventListener("resize", this.boundResize);
        document.addEventListener("keydown", this.boundKeydown);
        document.addEventListener("click", this.boundDocumentClick);

        this.elements.navMenuBtn?.addEventListener("click", () => this.toggleMobileMenu());
        this.elements.navLinks.forEach((link) => {
            link.addEventListener("click", (event) => this.handleNavClick(event));
        });

        this.handleScroll();
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = documentHeight > 0 ? (scrollTop / documentHeight) * 100 : 0;

        if (this.elements.scrollProgress) {
            this.elements.scrollProgress.style.width = `${scrollPercent}%`;
        }

        this.elements.nav?.classList.toggle("scrolled", scrollTop > 50);
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const scrollTop = window.pageYOffset + 120;

        this.elements.sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");

            if (scrollTop < sectionTop || scrollTop >= sectionTop + sectionHeight) {
                return;
            }

            this.elements.navLinks.forEach((link) => {
                const isActive = link.getAttribute("href") === `#${sectionId}`;
                link.classList.toggle("active-link", isActive);
                if (isActive) {
                    link.setAttribute("aria-current", "page");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
        });
    }

    handleResize() {
        if (window.innerWidth > 900 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
    }

    handleNavClick(event) {
        event.preventDefault();
        const targetId = event.currentTarget.getAttribute("href");
        const targetSection = document.querySelector(targetId);

        if (!targetSection) {
            return;
        }

        const headerHeight = this.elements.nav?.offsetHeight || 80;
        const targetPosition = targetSection.offsetTop - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });

        this.closeMobileMenu();
    }

    handleKeydown(event) {
        if (event.key === "Escape" && this.isMenuOpen) {
            this.closeMobileMenu();
        }

        if (event.key === "Tab") {
            document.body.classList.add("keyboard-navigation");
        }
    }

    handleDocumentClick(event) {
        if (!this.isMenuOpen) {
            return;
        }

        const clickedMenu = this.elements.navMenu?.contains(event.target);
        const clickedButton = this.elements.navMenuBtn?.contains(event.target);

        if (!clickedMenu && !clickedButton) {
            this.closeMobileMenu();
        }
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        this.elements.navMenu?.classList.toggle("responsive", this.isMenuOpen);
        this.elements.navMenuBtn?.setAttribute("aria-expanded", String(this.isMenuOpen));
        this.elements.navMenuBtn?.setAttribute("aria-label", this.isMenuOpen ? "Close navigation menu" : "Open navigation menu");
        document.body.classList.toggle("menu-open", this.isMenuOpen);
    }

    closeMobileMenu() {
        if (!this.isMenuOpen) {
            return;
        }

        this.isMenuOpen = false;
        this.elements.navMenu?.classList.remove("responsive");
        this.elements.navMenuBtn?.setAttribute("aria-expanded", "false");
        this.elements.navMenuBtn?.setAttribute("aria-label", "Open navigation menu");
        document.body.classList.remove("menu-open");
    }
}
