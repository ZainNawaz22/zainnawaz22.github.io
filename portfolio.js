/* ----- NAVIGATION BAR FUNCTION ----- */
function myMenuFunction(){
    var menuBtn = document.getElementById("myNavMenu");

    if(menuBtn.className === "nav-menu"){
      menuBtn.className += " responsive";
    } else {
      menuBtn.className = "nav-menu";
    }
  }

/* ----- ENHANCED HEADER SHADOW AND EFFECTS ON SCROLL ----- */
window.onscroll = function() {headerShadow()};

function headerShadow() {
    const navHeader = document.getElementById("header");
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

    if (scrollTop > 50) {
        navHeader.classList.add("scrolled");
    } else {
        navHeader.classList.remove("scrolled");
    }
}

/* ----- TYPING EFFECT ----- */
var typingEffect = new Typed(".typedText", {
    strings : ["Student", "C++ Developer", "Machine Learning Enthusiast", "Game Developer"],
    loop : true,
    typeSpeed : 80, 
    backSpeed : 40,
    backDelay : 2000
});

/* ----- PARTICLE BACKGROUND EFFECT ----- */
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.body.appendChild(particlesContainer);

    const particleCount = window.innerWidth < 768 ? 30 : 70;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    const posX = Math.random() * 100;
    const posY = Math.random() * 100;
    
    // Random size (smaller on mobile)
    const size = window.innerWidth < 768 ? 
                 Math.random() * 3 + 1 : 
                 Math.random() * 5 + 2;
    
    // Random opacity
    const opacity = Math.random() * 0.5 + 0.1;
    
    // Random animation duration
    const duration = Math.random() * 20 + 10;
    
    // Apply styles
    particle.style.cssText = `
        position: fixed;
        top: ${posY}%;
        left: ${posX}%;
        width: ${size}px;
        height: ${size}px;
        background-color: rgba(59, 130, 246, ${opacity});
        border-radius: 50%;
        pointer-events: none;
        z-index: 0;
        animation: float ${duration}s linear infinite;
    `;
    
    container.appendChild(particle);
}

/* ----- SCROLL REVEAL ANIMATION WITH ENHANCED EFFECTS ----- */
const sr = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 1000,
    delay: 200,
    reset: false
});

/* -- HOME -- */
sr.reveal('.featured-text-card', {delay: 100});
sr.reveal('.featured-name', {delay: 200});
sr.reveal('.featured-text-info', {delay: 300});
sr.reveal('.featured-text-btn', {delay: 400});
sr.reveal('.social_icons', {delay: 500});
sr.reveal('.featured-image', {
    delay: 600,
    origin: 'right'
});

/* -- PROJECT BOX -- */
sr.reveal('.project-box', {
    interval: 100,
    origin: 'bottom'
});

/* -- HEADINGS -- */
sr.reveal('.top-header', {
    distance: '40px',
    origin: 'top'
});

/* -- ABOUT INFO & CONTACT INFO -- */
const srLeft = ScrollReveal({
    origin: 'left',
    distance: '80px',
    duration: 1000,
    delay: 200,
    reset: false
});

srLeft.reveal('.about-info', {delay: 100});
srLeft.reveal('.contact-info', {delay: 100});

/* -- ABOUT SKILLS & FORM BOX -- */
const srRight = ScrollReveal({
    origin: 'right',
    distance: '80px',
    duration: 1000,
    delay: 200,
    reset: false
});

srRight.reveal('.skills-box', {delay: 100});
srRight.reveal('.form-control', {delay: 100});

/* ----- CHANGE ACTIVE LINK ----- */
const sections = document.querySelectorAll('section[id]');

function scrollActive() {
    const scrollY = window.scrollY;

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 50,
            sectionId = current.getAttribute('id');

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) { 
            document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.add('active-link');
        } else {
            document.querySelector('.nav-menu a[href*=' + sectionId + ']').classList.remove('active-link');
        }
    });
}

/* ----- INTERACTIVE PROJECT BOXES ----- */
function fetchProjects() {
    fetch('https://api.github.com/users/zainnawaz22/repos')
        .then(response => response.json())
        .then(data => {
            const projectContainer = document.querySelector('.project-container');
            projectContainer.innerHTML = ''; // Clear container
            
            data.forEach(repo => {
                const projectBox = document.createElement('div');
                projectBox.classList.add('project-box');
                
                // Create project content
                projectBox.innerHTML = `
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</p>
                    <a href="${repo.html_url}" target="_blank" class="project-link">View Project</a>
                `;
                
                // Add hover effect listeners
                projectBox.addEventListener('mouseenter', function() {
                    this.classList.add('active');
                });
                
                projectBox.addEventListener('mouseleave', function() {
                    this.classList.remove('active');
                });
                
                projectBox.addEventListener('click', () => {
                    window.open(repo.html_url, '_blank');
                });
                
                projectContainer.appendChild(projectBox);
            });
            
            // Re-initialize ScrollReveal for dynamically added projects
            sr.reveal('.project-box', {
                interval: 100,
                origin: 'bottom'
            });
        })
        .catch(error => {
            console.error('Error fetching repositories:', error);
            const projectContainer = document.querySelector('.project-container');
            projectContainer.innerHTML = `
                <div class="error-message">
                    <h3>Couldn't load projects</h3>
                    <p>Please check your connection or try again later.</p>
                </div>
            `;
        });
}

/* ----- FORM VALIDATION AND INTERACTION ----- */
function setupForm() {
    const formInputs = document.querySelectorAll('.input-field, textarea');
    const form = document.querySelector('.form-control');
    
    if (!form) return;
    
    // Add focus effects
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            
            // Add filled class if input has value
            if (this.value.trim() !== '') {
                this.classList.add('filled');
            } else {
                this.classList.remove('filled');
            }
        });
    });
    
    // Form submission animation
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = this.querySelector('.btn');
            const originalText = btn.innerHTML;
            
            // Change button text and add loading state
            btn.innerHTML = '<i class="uil uil-spinner"></i> Sending...';
            btn.classList.add('loading');
            
            // Simulate sending (would be replaced with actual API call)
            setTimeout(() => {
                btn.innerHTML = '<i class="uil uil-check"></i> Sent!';
                btn.classList.remove('loading');
                btn.classList.add('success');
                
                // Reset form
                form.reset();
                formInputs.forEach(input => {
                    input.classList.remove('filled');
                });
                
                // Reset button after delay
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.remove('success');
                }, 3000);
            }, 1500);
        });
    }
}

/* ----- THEME SWITCH LOGIC ----- */
function setupThemeSwitch() {
    const themeToggle = document.getElementById('theme-toggle');
    const root = document.documentElement;
    
    if (!themeToggle) return;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark'; // Set dark as default
    root.setAttribute('data-theme', savedTheme);
    themeToggle.checked = savedTheme === 'dark';

    // Theme switch handler
    themeToggle.addEventListener('change', function() {
        const theme = this.checked ? 'dark' : 'light';
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Add transition class for smooth color changes
        document.body.classList.add('theme-transition');
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 1000);
    });
}

/* ----- INITIALIZE EVERYTHING WHEN DOM IS LOADED ----- */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme before anything else to prevent flash
    setupThemeSwitch();
    
    // Add scroll event listener
    window.addEventListener('scroll', scrollActive);
    
    // Initialize particles
    createParticles();
    
    // Fetch projects
    fetchProjects();
    
    // Setup form interactions
    setupForm();
    
    // Add CSS for dynamically created elements
    const style = document.createElement('style');
    style.textContent = `
        .particles-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
            overflow: hidden;
        }
        
        @keyframes float {
            0%, 100% {
                transform: translate(0, 0);
            }
            25% {
                transform: translate(10px, 10px);
            }
            50% {
                transform: translate(0, 20px);
            }
            75% {
                transform: translate(-10px, 10px);
            }
        }
        
        .theme-transition {
            transition: background-color 0.5s ease, color 0.5s ease;
        }
        
        .form-control .focused {
            position: relative;
        }
        
        .form-control .focused::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--accent-primary);
            animation: focusAnimation 0.3s ease forwards;
        }
        
        @keyframes focusAnimation {
            from { transform: scaleX(0); }
            to { transform: scaleX(1); }
        }
        
        .btn.loading {
            opacity: 0.8;
            pointer-events: none;
        }
        
        .btn.success {
            background: #10b981;
        }
        
        .uil-spinner {
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .project-box.active {
            transform: translateY(-10px);
        }
        
        .project-box p {
            color: var(--text-tertiary);
            margin: 1rem 0;
            transition: color 0.3s ease;
        }
        
        .project-box:hover p {
            color: var(--text-secondary);
        }
        
        .project-link {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(59, 130, 246, 0.15);
            color: var(--accent-primary);
            border-radius: 20px;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            margin-top: 1rem;
            opacity: 0;
            transform: translateY(10px);
        }
        
        .project-box:hover .project-link {
            opacity: 1;
            transform: translateY(0);
        }
        
        .project-link:hover {
            background: var(--accent-primary);
            color: var(--text-primary);
        }
        
        .error-message {
            text-align: center;
            padding: 2rem;
            background: rgba(239, 68, 68, 0.1);
            border-radius: var(--border-radius);
            border: 1px solid rgba(239, 68, 68, 0.3);
        }
    `;
    document.head.appendChild(style);
});
