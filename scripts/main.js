import { PortfolioApp } from "./core/portfolio-app.js";

document.addEventListener("DOMContentLoaded", () => {
    const app = new PortfolioApp();
    app.init();

    window.addEventListener("beforeunload", () => {
        app.destroy();
    });
});
