import { escapeHtml, formatRelativeDate } from "../core/utils.js";

export class ProjectRenderer {
    constructor(container) {
        this.container = container;
    }

    renderProjects(projects) {
        if (!this.container) {
            return;
        }

        this.container.innerHTML = projects.length
            ? projects.map((project) => this.createProjectHTML(project)).join("")
            : '<div class="no-projects"><p>No projects found for this category.</p></div>';
    }

    renderTagResults(projects, onReset) {
        if (!this.container) {
            return;
        }

        if (!projects.length) {
            this.container.innerHTML = `
                <div class="no-projects">
                    <i class="uil uil-filter-slash" aria-hidden="true"></i>
                    <p>No projects found matching this tag.</p>
                    <button class="reset-search" type="button">Clear Filter</button>
                </div>
            `;

            this.container.querySelector(".reset-search")?.addEventListener("click", onReset);
            return;
        }

        this.renderProjects(projects);
    }

    renderError() {
        if (!this.container) {
            return;
        }

        this.container.innerHTML = `
            <div class="error-message">
                <h3>Unable to load projects</h3>
                <p>Please try again later or visit my <a href="https://github.com/zainnawaz22" target="_blank" rel="noopener noreferrer">GitHub profile</a> directly.</p>
            </div>
        `;
    }

    createProjectHTML(project) {
        const title = escapeHtml(project.name.replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()));
        const description = escapeHtml(project.description);
        const tagsHtml = project.tags.length
            ? `
                <div class="project-tags">
                    ${project.tags.map((tag) => `<span class="project-tag" data-tag="${escapeHtml(tag)}">${escapeHtml(tag)}</span>`).join("")}
                </div>
            `
            : "";

        return `
            <article class="project-box" data-category="${project.category}" tabindex="0">
                <div class="project-header">
                    <h3>${title}</h3>
                    <div class="project-meta">
                        <span class="project-language">${escapeHtml(project.language || "Unknown")}</span>
                        <span class="project-updated">Updated ${formatRelativeDate(project.updated)}</span>
                    </div>
                </div>
                <p class="project-description">${description}</p>
                ${tagsHtml}
                <div class="project-stats">
                    <span class="stat">
                        <i class="uil uil-star" aria-hidden="true"></i>
                        ${project.stars}
                    </span>
                    <span class="stat">
                        <i class="uil uil-code-branch" aria-hidden="true"></i>
                        ${project.forks}
                    </span>
                </div>
                <div class="project-actions">
                    <a
                        href="${project.url}"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="project-link"
                        aria-label="View ${escapeHtml(project.name)} on GitHub"
                    >
                        View Project
                        <i class="uil uil-external-link-alt" aria-hidden="true"></i>
                    </a>
                </div>
            </article>
        `;
    }
}
