export function throttle(fn, delay = 16) {
    let lastCall = 0;

    return (...args) => {
        const now = Date.now();
        if (now - lastCall < delay) {
            return;
        }

        lastCall = now;
        fn(...args);
    };
}

export function debounce(fn, delay = 250) {
    let timeoutId;

    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => fn(...args), delay);
    };
}

export function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

export function formatRelativeDate(date) {
    const days = Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24));
    return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(days, "day");
}
