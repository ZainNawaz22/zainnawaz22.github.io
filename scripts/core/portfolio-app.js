import { FILTERS } from "../config/constants.js";
import { AnimationController } from "../ui/animations.js";
import { hideLoadingScreen } from "../ui/loading.js";
import { NavigationController } from "../ui/navigation.js";
import { CursorFollower } from "../effects/cursor-follower.js";
import { ParticleSystem } from "../effects/particle-system.js";
import { ProjectRenderer } from "../projects/project-renderer.js";
import { ProjectService } from "../projects/project-service.js";

export class PortfolioApp {
    constructor() {
        this.projects = [];
        this.currentFilter = FILTERS.all;
        this.elements = this.getElements();
        this.navigation = new NavigationController(this.elements);
        this.animations = new AnimationController();
        this.projectService = new ProjectService();
        this.projectRenderer = new ProjectRenderer(this.elements.projectContainer);
        this.cursorFollower = null;
        this.particleSystem = null;
    }

    getElements() {
        return {
            loadingScreen: document.getElementById("loadingScreen"),
            scrollProgress: document.getElementById("scrollProgress"),
            cursorFollower: document.getElementById("cursorFollower"),
            nav: document.getElementById("header"),
            navMenuBtn: document.getElementById("navMenuBtn"),
            navMenu: document.getElementById("myNavMenu"),
            projectContainer: document.getElementById("project-container"),
            filterBtns: [...document.querySelectorAll(".filter-btn")],
            navLinks: [...document.querySelectorAll(".nav-link")],
            sections: [...document.querySelectorAll("section[id]")]
        };
    }

    init() {
        this.navigation.init();
        this.animations.init();
        this.setupEffects();
        this.setupFilterHandlers();
        hideLoadingScreen(this.elements.loadingScreen);
        this.loadProjects();
    }

    setupEffects() {
        this.particleSystem = new ParticleSystem();

        if (CursorFollower.canUse()) {
            this.cursorFollower = new CursorFollower(this.elements.cursorFollower);
            this.cursorFollower.init();
        }
    }

    setupFilterHandlers() {
        this.elements.filterBtns.forEach((button) => {
            button.addEventListener("click", () => {
                const filter = button.dataset.filter || FILTERS.all;
                this.currentFilter = filter;
                this.updateFilterButtons(filter);
                this.renderCurrentProjects();
            });
        });
    }

    updateFilterButtons(activeFilter) {
        this.elements.filterBtns.forEach((button) => {
            const isActive = button.dataset.filter === activeFilter;
            button.classList.toggle("active", isActive);
            button.setAttribute("aria-selected", String(isActive));
        });
    }

    async loadProjects() {
        try {
            this.projects = await this.projectService.fetchProjects();
            this.renderCurrentProjects();
        } catch (error) {
            console.error("Error fetching projects:", error);
            this.projectRenderer.renderError();
        }
    }

    renderCurrentProjects() {
        const filteredProjects = this.currentFilter === FILTERS.all
            ? this.projects
            : this.projects.filter((project) => project.category === this.currentFilter);

        this.projectRenderer.renderProjects(filteredProjects);
        this.bindProjectInteractions();
        this.animations.observeProjects();
    }

    bindProjectInteractions() {
        const projectBoxes = [...document.querySelectorAll(".project-box")];

        projectBoxes.forEach((box) => {
            box.addEventListener("click", (event) => {
                if (event.target.closest(".project-link")) {
                    return;
                }

                const tag = event.target.closest(".project-tag");
                if (tag) {
                    this.filterProjectsByTag(tag.dataset.tag);
                    return;
                }

                box.querySelector(".project-link")?.click();
            });

            box.addEventListener("keydown", (event) => {
                if (event.key !== "Enter" && event.key !== " ") {
                    return;
                }

                event.preventDefault();
                box.click();
            });
        });
    }

    filterProjectsByTag(tag) {
        if (!tag) {
            return;
        }

        const filteredProjects = this.projects.filter((project) => project.tags.includes(tag));
        this.projectRenderer.renderTagResults(filteredProjects, () => this.renderCurrentProjects());
        this.bindProjectInteractions();
        this.animations.observeProjects();
    }

    destroy() {
        this.cursorFollower?.destroy();
        this.particleSystem?.destroy();
        this.animations.destroy();
    }
}
