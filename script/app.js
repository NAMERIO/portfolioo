document.addEventListener("DOMContentLoaded", () => {
    const navLinks = document.querySelectorAll(".navbar a");
    const sections = document.querySelectorAll(".profile-content > div");
    const profileContainer = document.querySelector(".profile-container");
    let activeClone = null;

    navLinks.forEach((link) => {
        link.addEventListener("click", async (event) => {
            event.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                });
                await new Promise((resolve) => setTimeout(resolve, 300));
                if (activeClone) {
                    resetSection(activeClone);
                }
                
                profileContainer.classList.add("background-blur");
                const rect = targetSection.getBoundingClientRect();
                activeClone = targetSection.cloneNode(true);
                document.body.appendChild(activeClone);
                targetSection.classList.add("invisible");
                activeClone.style.position = "fixed";
                activeClone.style.top = `${rect.top}px`;
                activeClone.style.left = `${rect.left}px`;
                activeClone.style.width = `${rect.width}px`;
                activeClone.style.height = `${rect.height}px`;
                activeClone.style.margin = "0";
                activeClone.style.zIndex = "1000";
                activeClone.style.transform = "none";
                activeClone.style.transition = "transform 0.5s ease, top 0.5s ease, left 0.5s ease";
                requestAnimationFrame(() => {
                    const centerX = window.innerWidth / 2;
                    const centerY = window.innerHeight / 2;
                    activeClone.style.top = `${centerY - rect.height / 2}px`;
                    activeClone.style.left = `${centerX - rect.width / 2}px`;
                    activeClone.style.transform = "scale(1.2)";
                });
            }
        });
    });

    function resetSection(section) {
        const originalSectionId = section.getAttribute("id");
        const originalSection = document.getElementById(originalSectionId);
        if (originalSection) {
            originalSection.classList.remove("invisible");
        }
        section.remove();
    }

    profileContainer.addEventListener("click", (event) => {
        if (activeClone && !activeClone.contains(event.target)) {
            resetSection(activeClone);
            activeClone = null;
            profileContainer.classList.remove("background-blur");
        }
    });
});
