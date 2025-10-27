const themeToggle = document.getElementById('theme-toggle');

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

setTheme('dark');

themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

const commands = [
    { cmd: 'Natan', output: 'Frontend Developer & Student' },
    { cmd: 'ls skills/', output: 'JavaScript Python React Node.js MongoDB Git AWS Docker' },
    { cmd: 'cat interests.txt', output: 'Coding 🖥️  Gaming 🎮  Coffee ☕' }
];

let currentCommandIndex = 0;
const typingText = document.getElementById('typing-text');
const commandOutput = document.getElementById('command-output');

async function typeCommand(text, element) {
    element.textContent = '';
    for (let char of text) {
        element.textContent += char;
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function simulateCommand() {
    const command = commands[currentCommandIndex];
    await typeCommand(command.cmd, typingText);
    await new Promise(resolve => setTimeout(resolve, 500));
    commandOutput.textContent = command.output;
    await new Promise(resolve => setTimeout(resolve, 2000));
    commandOutput.textContent = '';
    typingText.textContent = '';
    currentCommandIndex = (currentCommandIndex + 1) % commands.length;
}

setInterval(simulateCommand, 5000);
simulateCommand();
const starfield = document.getElementById('starfield');
const stars = [];
const numStars = 200;

class Star {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.z = Math.random() * 1000;
        this.element = document.createElement('div');
        this.element.className = 'star';
        starfield.appendChild(this.element);
    }
    move() {
        this.z -= 1;
        if (this.z <= 0) {
            this.z = 1000;
            this.x = Math.random() * window.innerWidth;
            this.y = Math.random() * window.innerHeight;
        }
        const scale = 1000 / this.z;
        const x = (this.x - window.innerWidth / 2) * scale + window.innerWidth / 2;
        const y = (this.y - window.innerHeight / 2) * scale + window.innerHeight / 2;
        const size = scale * 2;
        this.element.style.left = x + 'px';
        this.element.style.top = y + 'px';
        this.element.style.width = size + 'px';
        this.element.style.height = size + 'px';
        this.element.style.opacity = Math.min(scale / 2, 1);
    }
}

for (let i = 0; i < numStars; i++) {
    stars.push(new Star());
}

function animateStars() {
    stars.forEach(star => star.move());
    requestAnimationFrame(animateStars);
}
animateStars();

const canvas = document.getElementById('matrix-rain');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*';
const fontSize = 14;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';
    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 2 - 1;
        this.speedY = Math.random() * 2 - 1;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.x < 0) this.x = window.innerWidth;
        if (this.y > window.innerHeight) this.y = 0;
        if (this.y < 0) this.y = window.innerHeight;
    }
}

const particles = Array.from({ length: 50 }, () => new Particle());
const particlesContainer = document.getElementById('particles');

function updateParticles() {
    particlesContainer.innerHTML = '';
    particles.forEach(particle => {
        particle.update();
        const dot = document.createElement('div');
        dot.className = 'particle';
        dot.style.left = particle.x + 'px';
        dot.style.top = particle.y + 'px';
        dot.style.width = particle.size + 'px';
        dot.style.height = particle.size + 'px';
        particlesContainer.appendChild(dot);
    });
    requestAnimationFrame(updateParticles);
}


window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-out');
    observer.observe(section);
});

setInterval(drawMatrix, 50);
updateParticles();

const projectsGrid = document.querySelector('.projects-grid');
let isAutoScrolling = true;
let scrollSpeed = 1;
let animationId;

function autoScroll() {
    if (isAutoScrolling && projectsGrid) {
        projectsGrid.scrollLeft += scrollSpeed;

        if (projectsGrid.scrollLeft >= projectsGrid.scrollWidth - projectsGrid.clientWidth) {
            projectsGrid.scrollLeft = 0;
        }
    }
    animationId = requestAnimationFrame(autoScroll);
}

projectsGrid.addEventListener('mouseenter', () => {
    isAutoScrolling = false;
});

projectsGrid.addEventListener('mouseleave', () => {
    isAutoScrolling = true;
});

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        isAutoScrolling = false;
    });

    card.addEventListener('mouseleave', () => {
        isAutoScrolling = true;
    });
});

autoScroll();