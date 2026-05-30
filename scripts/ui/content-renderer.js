import { socialLinks, experience, featuredProjects } from "../data/content.js";

function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (value === undefined || value === null || value === false) continue;
        if (key === "class") node.className = value;
        else if (key === "text") node.textContent = value;
        else node.setAttribute(key, value === true ? "" : value);
    }
    for (const child of [].concat(children)) {
        if (child == null) continue;
        node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    }
    return node;
}

function svgIcon(pathData, label) {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("xmlns", ns);
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    if (label) svg.setAttribute("role", "img");
    const path = document.createElementNS(ns, "path");
    path.setAttribute("d", pathData);
    svg.appendChild(path);
    return svg;
}

function renderSocial(container) {
    if (!container) return;
    container.replaceChildren(
        ...socialLinks.map((link) =>
            el(
                "a",
                {
                    href: link.url,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "rail-social-link",
                    "aria-label": `${link.label} (opens in new tab)`
                },
                [svgIcon(link.path, link.label)]
            )
        )
    );
}

function renderExperience(container) {
    if (!container) return;
    container.replaceChildren(
        ...experience.map((entry) => {
            const orgLink = el(
                "a",
                {
                    href: entry.organizationUrl,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    class: "org-link"
                },
                [
                    entry.organization,
                    el("span", { class: "org-link-arrow", "aria-hidden": "true", text: " \u2197" })
                ]
            );

            const title = el("h3", { class: "experience-title" }, [
                `${entry.title} \u00B7 `,
                orgLink
            ]);

            const tags = el(
                "div",
                { class: "experience-tags" },
                entry.tags.map((tag) => el("span", { class: "experience-tag", text: tag }))
            );

            const body = el("div", { class: "experience-body" }, [
                title,
                el("p", { class: "experience-summary", text: entry.summary }),
                tags
            ]);

            return el("article", { class: "experience-entry" }, [
                el("div", { class: "experience-period", text: entry.period }),
                body
            ]);
        })
    );
}

function renderProjects(container) {
    if (!container) return;
    container.replaceChildren(
        ...featuredProjects.map((project) => {
            const titleLink = el(
                "a",
                { href: project.url, target: "_blank", rel: "noopener noreferrer" },
                [
                    project.name,
                    el("span", { class: "project-link-arrow", "aria-hidden": "true", text: " \u2197" })
                ]
            );

            const imageInner = project.image
                ? el("img", { src: project.image, alt: project.imageAlt || `${project.name} screenshot`, loading: "lazy" })
                : el("div", { class: "project-image-placeholder", text: project.thumbnail || project.name.charAt(0) });

            return el("article", { class: "project-entry" }, [
                el("div", { class: "project-image-wrapper" }, [imageInner]),
                el("div", { class: "project-body" }, [
                    el("h3", { class: "project-name" }, [titleLink]),
                    el("p", { class: "project-description", text: project.description }),
                    el(
                        "div",
                        { class: "project-tags" },
                        project.tags.map((tag) => el("span", { class: "project-tag", text: tag }))
                    )
                ])
            ]);
        })
    );
}

export function renderContent() {
    renderSocial(document.querySelector("[data-social-links]"));
    renderExperience(document.querySelector("[data-experience-list]"));
    renderProjects(document.querySelector("[data-project-list]"));
}
