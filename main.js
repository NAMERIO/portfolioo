const themeToggle = document.getElementById("theme-toggle");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const root = document.documentElement;

function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    themeToggle.innerHTML = theme === "light"
        ? '<i class="fas fa-moon"></i>'
        : '<i class="fas fa-sun"></i>';
}

const savedTheme = localStorage.getItem("theme") || "dark";
setTheme(savedTheme);

themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    setTheme(currentTheme === "dark" ? "light" : "dark");
});

const commands = [
    { cmd: "Natan Berhanu", output: "Frontend Developer building apps, games, and tools" },
    { cmd: "React / TypeScript / Canvas", output: "Building apps, browser games, and useful tools" },
    { cmd: "UI / Motion / Real-time logic", output: "Designing interfaces that feel fast and interactive" }
];

let currentCommandIndex = 0;
const typingText = document.getElementById("typing-text");
const commandOutput = document.getElementById("command-output");

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(text, element) {
    element.textContent = "";
    for (const char of text) {
        element.textContent += char;
        await sleep(44);
    }
}

async function runTerminalLoop() {
    if (!typingText || !commandOutput) return;

    const item = commands[currentCommandIndex];
    await typeText(item.cmd, typingText);
    commandOutput.textContent = item.output;
    await sleep(2200);
    commandOutput.textContent = "";
    currentCommandIndex = (currentCommandIndex + 1) % commands.length;
    runTerminalLoop();
}

runTerminalLoop();

document.querySelectorAll(".reveal").forEach((element, index) => {
    const delay = element.classList.contains("project-row")
        ? 0
        : element.dataset.delay || Math.min(index * 55, 220);
    element.style.setProperty("--reveal-delay", `${delay}ms`);
});

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.16,
    rootMargin: "0px 0px -8% 0px"
});

document.querySelectorAll(".reveal").forEach(element => revealObserver.observe(element));

const cards = document.querySelectorAll(".social-card, .skill-icon");

cards.forEach(card => {
    card.addEventListener("pointermove", event => {
        const rect = card.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
        const lightX = ((event.clientX - rect.left) / rect.width) * 100;
        const lightY = ((event.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty("--card-x", `${lightX}%`);
        card.style.setProperty("--card-y", `${lightY}%`);
        card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-4px)`;
    });

    card.addEventListener("pointerleave", () => {
        card.style.transform = "";
    });
});

const canvas = document.getElementById("ambient-canvas");
const ctx = canvas.getContext("2d");
const mainContent = document.querySelector("main");
const journeyLine = document.querySelector(".journey-line");
const journeySvg = document.getElementById("journey-svg");
const journeyPath = document.getElementById("journey-path");
const journeyGlow = document.getElementById("journey-glow");
const journeyPointsGroup = document.getElementById("journey-points");
const projectPreview = document.querySelector(".project-preview");
const projectPreviewLabel = document.getElementById("project-preview-label");
const projectRows = [...document.querySelectorAll(".project-row")];
const journeyTargets = [
    { id: "home", label: "Home", x: 34, y: 0.48 },
    { id: "about", label: "About / Skills", x: 76, y: 0.42 },
    { id: "projects", label: "Projects", x: 22, y: 0.18 },
    { id: "contact", label: "Contact", x: 68, y: 0.42 }
];
let width = 0;
let height = 0;
let particles = [];
let scrollY = window.scrollY;
let journeyStops = [];
let journeyPathLength = 0;

function buildJourneyPath(points) {
    if (!points.length) return "";

    return points.reduce((path, point, index) => {
        if (index === 0) return `M ${point.x} ${point.y}`;

        const previous = points[index - 1];
        const midY = (previous.y + point.y) / 2;
        return `${path} C ${previous.x} ${midY}, ${point.x} ${midY}, ${point.x} ${point.y}`;
    }, "");
}

function updateJourneyPath() {
    if (!mainContent || !journeyLine || !journeySvg || !journeyPath || !journeyPointsGroup) return;

    const mainRect = mainContent.getBoundingClientRect();
    const mainTop = mainRect.top + window.scrollY;
    const mainWidth = mainContent.clientWidth;
    const mainHeight = mainContent.scrollHeight;

    journeyLine.style.height = `${mainHeight}px`;
    journeySvg.setAttribute("viewBox", `0 0 ${mainWidth} ${mainHeight}`);
    journeySvg.style.height = `${mainHeight}px`;

    journeyStops = journeyTargets
        .map(item => {
            const target = document.getElementById(item.id);
            if (!target) return null;

            const rect = target.getBoundingClientRect();
            const targetTop = rect.top + window.scrollY;
            const targetHeight = rect.height;
            const x = Math.min(Math.max(mainWidth * (item.x / 100), 82), mainWidth - 82);
            const y = targetTop - mainTop + Math.min(Math.max(targetHeight * item.y, 90), 340);

            return { ...item, x, y, targetTop: mainTop + y };
        })
        .filter(Boolean);

    journeyPath.setAttribute("d", buildJourneyPath(journeyStops));
    journeyGlow?.setAttribute("d", buildJourneyPath(journeyStops));
    journeyPathLength = journeyPath.getTotalLength();

    journeyPointsGroup.innerHTML = "";
    journeyStops.forEach(stop => {
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.classList.add("journey-stop");
        group.dataset.id = stop.id;

        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.classList.add("journey-point");
        circle.setAttribute("cx", stop.x);
        circle.setAttribute("cy", stop.y);
        circle.setAttribute("r", "7");

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.classList.add("journey-label");
        label.setAttribute("x", stop.x + (stop.x > mainWidth * 0.55 ? -16 : 16));
        label.setAttribute("y", stop.y - 16);
        label.setAttribute("text-anchor", stop.x > mainWidth * 0.55 ? "end" : "start");
        label.textContent = stop.label;

        group.append(circle, label);
        journeyPointsGroup.appendChild(group);
    });

    updateScrollEffects();
}

function updateScrollEffects() {
    if (!journeyPath || !journeyGlow || !journeyPathLength || !journeyStops.length) return;

    const viewportFocus = window.scrollY + window.innerHeight * 0.42;
    const activeStop = journeyStops.reduce((current, stop) => {
        const currentDistance = Math.abs(current.targetTop - viewportFocus);
        const nextDistance = Math.abs(stop.targetTop - viewportFocus);
        return nextDistance < currentDistance ? stop : current;
    }, journeyStops[0]);
    const firstTop = journeyStops[0].targetTop;
    const lastTop = journeyStops[journeyStops.length - 1].targetTop;
    const localProgress = Math.min(Math.max((viewportFocus - firstTop) / Math.max(lastTop - firstTop, 1), 0), 1);
    const segmentLength = Math.min(Math.max(journeyPathLength * 0.12, 110), 210);
    const segmentCenter = journeyPathLength * localProgress;

    const dashOffset = -(segmentCenter - segmentLength / 2);
    journeyGlow.style.strokeDasharray = `${segmentLength} ${journeyPathLength}`;
    journeyGlow.style.strokeDashoffset = `${dashOffset}`;

    document.querySelectorAll(".journey-stop").forEach(group => {
        const isActive = group.dataset.id === activeStop.id;
        group.querySelector(".journey-point")?.classList.toggle("is-active", isActive);
        group.querySelector(".journey-label")?.classList.toggle("is-active", isActive);
    });
}

function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

    particles = Array.from({ length: Math.min(62, Math.floor(width / 18)) }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        speed: Math.random() * 0.35 + 0.12,
        alpha: Math.random() * 0.35 + 0.12
    }));

    updateJourneyPath();
    updateScrollEffects();
}

function drawAmbient() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(point => {
        point.y -= point.speed;
        point.x += Math.sin((point.y + scrollY) * 0.006) * 0.18;

        if (point.y < -10) {
            point.y = height + 10;
            point.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(point.x, point.y + scrollY * 0.02, point.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(88, 242, 194, ${point.alpha})`;
        ctx.fill();
    });

    requestAnimationFrame(drawAmbient);
}

function setActiveProject(row) {
    if (!projectPreview || !row) return;

    projectRows.forEach(item => item.classList.toggle("is-active", item === row));
    projectPreview.style.backgroundImage = `url('${row.dataset.image}')`;
    if (projectPreviewLabel) {
        projectPreviewLabel.textContent = row.dataset.title || "";
    }
}

projectRows.forEach(row => {
    row.addEventListener("mouseenter", () => setActiveProject(row));
    row.addEventListener("focusin", () => setActiveProject(row));
});

if (!prefersReducedMotion) {
    resizeCanvas();
    drawAmbient();
}

updateJourneyPath();
updateScrollEffects();

if (!prefersReducedMotion) {
    window.addEventListener("pointermove", event => {
        root.style.setProperty("--mouse-x", `${event.clientX}px`);
        root.style.setProperty("--mouse-y", `${event.clientY}px`);
    }, { passive: true });
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", () => {
    updateJourneyPath();
    updateScrollEffects();
});
window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    updateScrollEffects();
}, { passive: true });
