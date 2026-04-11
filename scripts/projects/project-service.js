import { FILTERS, GITHUB_CONFIG } from "../config/constants.js";

export class ProjectService {
    async fetchProjects() {
        const response = await fetch(`${GITHUB_CONFIG.reposUrl}?per_page=100&sort=updated`, {
            headers: {
                Accept: "application/vnd.github.v3+json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const repos = await response.json();
        return repos
            .map((repo) => ({
                id: repo.id,
                name: repo.name,
                description: repo.description || "No description provided",
                url: repo.html_url,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                updated: new Date(repo.updated_at),
                category: this.categorizeProject(repo),
                tags: this.generateProjectTags(repo)
            }))
            .sort((a, b) => b.updated - a.updated);
    }

    categorizeProject(repo) {
        const name = repo.name.toLowerCase();
        const description = (repo.description || "").toLowerCase();
        const language = (repo.language || "").toLowerCase();

        if (language.includes("javascript") || language.includes("typescript") || name.includes("web") || description.includes("web")) {
            return FILTERS.web;
        }

        if (language.includes("python") || name.includes("ml") || name.includes("ai") || description.includes("machine learning") || description.includes("data")) {
            return FILTERS.ml;
        }

        if (language.includes("c#") || language.includes("unity") || name.includes("game") || description.includes("game")) {
            return FILTERS.game;
        }

        return "other";
    }

    generateProjectTags(repo) {
        const tags = [];
        const name = repo.name.toLowerCase();
        const description = (repo.description || "").toLowerCase();
        const category = this.categorizeProject(repo);

        if (repo.language) {
            tags.push(repo.language);
        }

        if (category === FILTERS.web) {
            tags.push("Web");
            if (description.includes("react") || name.includes("react")) tags.push("React");
            if (description.includes("vue") || name.includes("vue")) tags.push("Vue");
            if (description.includes("angular") || name.includes("angular")) tags.push("Angular");
            if (description.includes("node") || name.includes("node")) tags.push("Node.js");
            if (description.includes("javascript") || description.includes("js")) tags.push("JavaScript");
            if (description.includes("typescript") || description.includes("ts")) tags.push("TypeScript");
            if (description.includes("html") || description.includes("css")) tags.push("HTML/CSS");
        }

        if (category === FILTERS.ml) {
            tags.push("Machine Learning");
            if (description.includes("tensorflow") || name.includes("tensorflow")) tags.push("TensorFlow");
            if (description.includes("pytorch") || name.includes("pytorch")) tags.push("PyTorch");
            if (description.includes("scikit") || name.includes("scikit")) tags.push("Scikit-learn");
            if (description.includes("nlp") || description.includes("natural language")) tags.push("NLP");
            if (description.includes("vision") || description.includes("image")) tags.push("Computer Vision");
            if (description.includes("data") || description.includes("analysis")) tags.push("Data Analysis");
        }

        if (category === FILTERS.game) {
            tags.push("Game Development");
            if (description.includes("unity") || name.includes("unity")) tags.push("Unity");
            if (description.includes("unreal") || name.includes("unreal")) tags.push("Unreal Engine");
            if (description.includes("3d") || name.includes("3d")) tags.push("3D");
            if (description.includes("2d") || name.includes("2d")) tags.push("2D");
            if (description.includes("physics") || name.includes("physics")) tags.push("Physics");
            if (description.includes("ai") || description.includes("artificial intelligence")) tags.push("AI");
        }

        return [...new Set(tags)];
    }
}
