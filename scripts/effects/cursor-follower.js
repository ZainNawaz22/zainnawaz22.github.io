export class CursorFollower {
    constructor(element) {
        this.element = element;
        this.spotlight = document.querySelector('.cursor-spotlight');
        this.mouseX = 0;
        this.mouseY = 0;
        this.cursorX = 0;
        this.cursorY = 0;
        this.animationFrameId = null;
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.boundMouseEnter = this.show.bind(this);
        this.boundMouseLeave = this.hide.bind(this);
    }

    static canUse() {
        return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    }

    init() {
        if (!this.element || !CursorFollower.canUse()) {
            return;
        }

        document.addEventListener("mousemove", this.boundMouseMove);
        document.addEventListener("mouseenter", this.boundMouseEnter);
        document.addEventListener("mouseleave", this.boundMouseLeave);
        this.show();
        this.animate();
    }

    handleMouseMove(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
        if (this.spotlight) {
            this.spotlight.style.setProperty('--spotlight-x', `${event.clientX}px`);
            this.spotlight.style.setProperty('--spotlight-y', `${event.clientY}px`);
        }
    }

    show() {
        this.element.classList.add("visible");
        if (this.spotlight) this.spotlight.classList.add("visible");
    }

    hide() {
        this.element.classList.remove("visible");
        if (this.spotlight) this.spotlight.classList.remove("visible");
    }

    animate() {
        this.cursorX += (this.mouseX - this.cursorX) * 0.22;
        this.cursorY += (this.mouseY - this.cursorY) * 0.22;
        this.element.style.transform = `translate(${this.cursorX - 10}px, ${this.cursorY - 10}px)`;
        this.animationFrameId = window.requestAnimationFrame(() => this.animate());
    }

    destroy() {
        window.cancelAnimationFrame(this.animationFrameId);
        document.removeEventListener("mousemove", this.boundMouseMove);
        document.removeEventListener("mouseenter", this.boundMouseEnter);
        document.removeEventListener("mouseleave", this.boundMouseLeave);
    }
}
