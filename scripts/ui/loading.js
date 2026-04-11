export function hideLoadingScreen(element) {
    if (!element) {
        return;
    }

    window.setTimeout(() => {
        element.classList.add("hidden");

        window.setTimeout(() => {
            element.remove();
        }, 300);
    }, 1000);
}
