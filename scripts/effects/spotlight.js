export class Spotlight {
    constructor() {
        this.element = document.querySelector(".cursor-spotlight");
        this.boundMove = this.handleMove.bind(this);
        this.boundEnter = this.show.bind(this);
        this.boundLeave = this.hide.bind(this);
    }

    static canUse() {
        return (
            window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
            !window.matchMedia("(prefers-reduced-motion: reduce)").matches
        );
    }

    init() {
        if (!this.element) {
            return;
        }

        document.addEventListener("mousemove", this.boundMove);
        document.addEventListener("mouseenter", this.boundEnter);
        document.addEventListener("mouseleave", this.boundLeave);
    }

    handleMove(event) {
        this.element.style.setProperty("--spotlight-x", `${event.clientX}px`);
        this.element.style.setProperty("--spotlight-y", `${event.clientY}px`);
        if (!this.element.classList.contains("visible")) {
            this.element.classList.add("visible");
        }
    }

    show() {
        this.element.classList.add("visible");
    }

    hide() {
        this.element.classList.remove("visible");
    }

    destroy() {
        document.removeEventListener("mousemove", this.boundMove);
        document.removeEventListener("mouseenter", this.boundEnter);
        document.removeEventListener("mouseleave", this.boundLeave);
    }
}
