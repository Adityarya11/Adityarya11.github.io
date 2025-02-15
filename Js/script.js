document.addEventListener("DOMContentLoaded", () => {
    /* ========== NAVIGATION MENU ========== */
    const navMenu = document.getElementById("nav-menu");
    const navToggle = document.getElementById("nav-toggle");
    const navClose = document.getElementById("nav-close");
    const navLinks = document.querySelectorAll(".nav__link");

    if (navToggle) {
        navToggle.addEventListener("click", () => navMenu.classList.add("show-menu"));
    }

    if (navClose) {
        navClose.addEventListener("click", () => navMenu.classList.remove("show-menu"));
    }

    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navMenu.classList.remove("show-menu");

            const targetId = link.getAttribute("href").substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({ top: targetSection.offsetTop - 50, behavior: "smooth" });
            }
        });
    });

    /* ========== DARK MODE TOGGLE ========== */
    const themeButton = document.getElementById("theme-button");
    const body = document.body;
    const darkMode = localStorage.getItem("darkMode");

    const updateCssVarRgb = () => {
        const bgColor = getComputedStyle(document.documentElement).getPropertyValue("--bg-color").trim();
        if (bgColor.startsWith("#")) {
            const [r, g, b] = [1, 3, 5].map(start => parseInt(bgColor.slice(start, start + 2), 16));
            document.documentElement.style.setProperty("--bg-color-rgb", `${r}, ${g}, ${b}`);
        }
    };

    const enableDarkMode = () => {
        body.classList.add("dark-theme");
        themeButton.classList.replace("uil-moon", "uil-sun");
        localStorage.setItem("darkMode", "enabled");
        updateCssVarRgb();
    };

    const disableDarkMode = () => {
        body.classList.remove("dark-theme");
        themeButton.classList.replace("uil-sun", "uil-moon");
        localStorage.setItem("darkMode", "disabled");
        updateCssVarRgb();
    };

    if (darkMode === "enabled") enableDarkMode();
    else updateCssVarRgb();

    themeButton.addEventListener("click", () => {
        body.classList.contains("dark-theme") ? disableDarkMode() : enableDarkMode();
    });

    /* ========== INTERSECTION OBSERVER FOR SECTIONS ========== */
    const sections = document.querySelectorAll("section[id]");
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const navLink = document.querySelector(`.nav__link[href*="${entry.target.id}"]`);
            if (entry.isIntersecting) {
                document.querySelectorAll(".nav__link").forEach(link => link.classList.remove("active-link"));
                if (navLink) navLink.classList.add("active-link");
            }
        });
    }, { threshold: 0.15, rootMargin: "-50px 0px -50px 0px" });

    sections.forEach(section => sectionObserver.observe(section));

    /* ========== CONTACT FORM SUBMISSION ========== */
    const contactForm = document.getElementById("contact-form");

    if (contactForm) {
        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const message = document.getElementById("message").value.trim();
            const submitBtn = document.getElementById("submitBtn");

            let statusMessage = contactForm.querySelector(".form-status-message") || document.createElement("p");
            statusMessage.classList.add("form-status-message");
            contactForm.appendChild(statusMessage);

            if (!name || !email || !message) {
                statusMessage.textContent = "Please fill out all fields.";
                statusMessage.style.color = "red";
                return;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                statusMessage.textContent = "Please enter a valid email address.";
                statusMessage.style.color = "red";
                return;
            }

            try {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
                await new Promise(resolve => setTimeout(resolve, 1500));

                statusMessage.textContent = "Message sent successfully!";
                statusMessage.style.color = "green";
                contactForm.reset();
                setTimeout(() => statusMessage.textContent = "", 3000);
            } catch (error) {
                statusMessage.textContent = "Failed to send message. Please try again.";
                statusMessage.style.color = "red";
            } finally {
                submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
                submitBtn.disabled = false;
            }
        });
    }

    /* ========== SCROLL-UP BUTTON ========== */
    const scrollUpButton = document.getElementById("scroll-up");
    const scrollObserver = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) scrollUpButton.classList.add("show-scroll");
        else scrollUpButton.classList.remove("show-scroll");
    }, { root: null, threshold: 0, rootMargin: "-500px 0px 0px 0px" });

    scrollObserver.observe(document.querySelector("section"));
    scrollUpButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    /* ========== SKILLS ANIMATION ========== */
    const skillsObserver = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll(".skills__percentage").forEach(skill => {

                        skill.style.width = skill.dataset.width || skill.style.width;
                    });
                }
            });
        },
        { threshold: 0.1 }
    );
    document.querySelectorAll(".skills__content").forEach(section => skillsObserver.observe(section));


    /* ========== PROJECT FILTER ========== */
    const projectFilters = document.querySelectorAll(".projects__filter");
    const projectItems = document.querySelectorAll(".project__content");

    if (projectFilters.length && projectItems.length) {
        projectFilters.forEach(filter => {
            filter.addEventListener("click", () => {
                projectFilters.forEach(f => f.classList.remove("active-filter"));
                filter.classList.add("active-filter");

                const filterValue = filter.getAttribute("data-filter");
                projectItems.forEach(item => {
                    const itemCategory = item.getAttribute("data-category") || "all";
                    if (filterValue === "all" || filterValue === itemCategory) {
                        item.style.display = "block";
                        setTimeout(() => {
                            item.style.transform = "scale(1)";
                            item.style.opacity = "1";
                        }, 100);
                    } else {
                        item.style.transform = "scale(0.8)";
                        item.style.opacity = "0";
                        setTimeout(() => item.style.display = "none", 500);
                    }
                });
            });
        });
    }

    /* ========== MODAL FUNCTIONALITY FOR QUALIFICATIONS ========== */
    document.querySelectorAll(".services__button").forEach(btn => {
        btn.addEventListener("click", () => {
            const modal = btn.nextElementSibling;
            if (modal) modal.classList.add("active-modal");
        });
    });

    document.querySelectorAll(".services__modal-close").forEach(closeBtn => {
        closeBtn.addEventListener("click", () => {
            closeBtn.closest(".services__modal").classList.remove("active-modal");
        });
    });

    document.querySelectorAll(".services__modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.remove("active-modal");
        });
    });

    // ========== RANDOM QUOTE GENERATOR ==========
    const quotes = [
        "The only limit to our realization of tomorrow is our doubts of today. – Franklin D. Roosevelt",
        "Do not wait to strike till the iron is hot; but make it hot by striking. – William Butler Yeats",
        "Great minds discuss ideas; average minds discuss events; small minds discuss people. – Eleanor Roosevelt",
        "The best way to predict the future is to create it. – Peter Drucker",
        "In the middle of every difficulty lies opportunity. – Albert Einstein"
    ];

    const quoteText = document.getElementById("quote-text");
    const newQuoteBtn = document.getElementById("new-quote-btn");

    function generateQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteText.textContent = quotes[randomIndex];
    }

    // Generate a quote on page load
    document.addEventListener("DOMContentLoaded", generateQuote);

    // Generate a new quote when the button is clicked
    newQuoteBtn.addEventListener("click", generateQuote);

    // ========== TYPING EFFECT FOR "About Me" ==========
    function typeEffect(element, speed) {
        const text = element.textContent;
        element.textContent = "";
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
            }
        }, speed);
    }

    const aboutTitle = document.getElementById("typing-effect");
    if (aboutTitle) {
        // Start typing effect with a speed of 100ms per character
        typeEffect(aboutTitle, 100);
    }


});
