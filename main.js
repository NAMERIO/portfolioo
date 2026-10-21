const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function currentTheme() {
    return root.dataset.theme || (darkQuery.matches ? "dark" : "light");
}

function syncThemeButton() {
    const isDark = currentTheme() === "dark";
    themeToggle.textContent = isDark ? "Lights on" : "Lights off";
    themeToggle.setAttribute("aria-pressed", String(isDark));
}

themeToggle.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
        localStorage.setItem("theme", next);
    } catch (e) {}
    syncThemeButton();
});

darkQuery.addEventListener("change", syncThemeButton);
syncThemeButton();

// Controls page: E / G / L / T open the matching link.
const keyLinks = new Map(
    [...document.querySelectorAll(".controls a[data-key]")].map(link => [link.dataset.key, link])
);

document.addEventListener("keydown", event => {
    if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
    if (event.target.closest("input, textarea, select, [contenteditable]")) return;

    const link = keyLinks.get(event.key.toLowerCase());
    if (!link) return;

    link.classList.add("is-pressed");
    setTimeout(() => link.classList.remove("is-pressed"), 160);
    link.click();
});
