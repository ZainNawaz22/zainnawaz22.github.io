import { SectionTracker } from "../ui/section-tracker.js";
import { Spotlight } from "../effects/spotlight.js";

export class PortfolioApp {
    constructor() {
        this.sectionTracker = null;
        this.spotlight = null;
    }

    init() {
        this.sectionTracker = new SectionTracker();
        this.sectionTracker.init();
        this.setupSpotlight();
        this.setupKeyboardNav();
    }

    setupSpotlight() {
        if (Spotlight.canUse()) {
            this.spotlight = new Spotlight();
            this.spotlight.init();
        }
    }

    setupKeyboardNav() {
        document.addEventListener("keydown", (event) => {
            if (event.key === "Tab") {
                document.body.classList.add("keyboard-nav");
            }
        });

        document.addEventListener("mousedown", () => {
            document.body.classList.remove("keyboard-nav");
        });
    }

    destroy() {
        this.sectionTracker?.destroy();
        this.spotlight?.destroy();
    }
}
