class ParticleSystem {
    constructor() {
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.className = 'particle-canvas';
        document.body.insertBefore(this.canvas, document.body.firstChild);
        
        this.resize();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', this.resize.bind(this));
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles(); // Recreate particles when resizing
    }
    
    createParticles() {
        this.particles = [];
        // Reduce particle count on mobile devices
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 
            Math.min(window.innerWidth / 20, 30) : 
            Math.min(window.innerWidth / 10, 100);
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                color: 'rgba(59, 130, 246, 0.3)',
                vx: Math.random() * 0.5 - 0.25,
                vy: Math.random() * 0.5 - 0.25,
                originalX: Math.random() * this.canvas.width,
                originalY: Math.random() * this.canvas.height
            });
        }
    }
    
    handleMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            // Calculate distance to mouse
            const dx = this.mouseX - p.x;
            const dy = this.mouseY - p.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Apply mouse repulsion force if mouse is near
            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) / 10;
                p.vx -= Math.cos(angle) * force;
                p.vy -= Math.sin(angle) * force;
            }
            
            // Apply return force to original position
            p.vx += (p.originalX - p.x) * 0.01;
            p.vy += (p.originalY - p.y) * 0.01;
            
            // Apply velocity
            p.x += p.vx;
            p.y += p.vy;
            
            // Apply friction
            p.vx *= 0.95;
            p.vy *= 0.95;
            
            // Draw
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.fill();
            
            // Draw connections between particles
            this.particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(p.x, p.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(this.animate.bind(this));
    }
}

class PortfolioApp {
    constructor() {
        this.theme = 'dark'; // Always dark mode
        this.isMenuOpen = false;
        this.projects = [];
        this.currentFilter = 'all';
        this.observers = [];
        this.isMobileDevice = this.detectMobileDevice();
        
        this.init();
    }

    init() {
        this.setupDOM();
        this.setupEventListeners();
        this.applyDarkTheme();
        this.setupScrollEffects();
        this.setupAnimations();
        this.setupTypingEffect();
        this.fetchProjects();
        this.setupFormHandling();
        
        // Only setup cursor follower on non-mobile devices
        if (!this.isMobileDevice) {
            this.setupCursorFollower();
        }
        
        this.hideLoadingScreen();
        
        // Initialize particle system with reduced particles on mobile
        this.particleSystem = new ParticleSystem();
        
        // Apply mobile optimizations
        if (this.isMobileDevice) {
            this.applyMobileOptimizations();
        }
    }

    setupDOM() {
        this.elements = {
            loadingScreen: document.getElementById('loadingScreen'),
            scrollProgress: document.getElementById('scrollProgress'),
            cursorFollower: document.getElementById('cursorFollower'),
            scrollToTop: document.getElementById('scrollToTop'),
            nav: document.getElementById('header'),
            navMenuBtn: document.getElementById('navMenuBtn'),
            navMenu: document.getElementById('myNavMenu'),
            contactForm: document.getElementById('contactForm'),
            projectContainer: document.getElementById('project-container'),
            filterBtns: document.querySelectorAll('.filter-btn'),
            navLinks: document.querySelectorAll('.nav-link'),
            sections: document.querySelectorAll('section[id]')
        };
    }

    setupEventListeners() {
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16));
        window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));
        window.addEventListener('load', this.handleLoad.bind(this));

        this.elements.navMenuBtn?.addEventListener('click', this.toggleMobileMenu.bind(this));
        this.elements.scrollToTop?.addEventListener('click', this.scrollToTop.bind(this));

        this.elements.navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavClick.bind(this));
        });

        this.elements.filterBtns.forEach(btn => {
            btn.addEventListener('click', this.handleFilterClick.bind(this));
        });

        document.addEventListener('mousemove', this.throttle(this.updateCursorFollower.bind(this), 16));
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        document.addEventListener('click', (e) => {
            if (!this.elements.navMenu?.contains(e.target) && !this.elements.navMenuBtn?.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    throttle(func, delay) {
        let lastCall = 0;
        return function(...args) {
            const now = new Date().getTime();
            if (now - lastCall < delay) {
                return;
            }
            lastCall = now;
            return func(...args);
        };
    }

    debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }

    hideLoadingScreen() {
        setTimeout(() => {
            this.elements.loadingScreen?.classList.add('hidden');
            setTimeout(() => {
                this.elements.loadingScreen?.remove();
            }, 300);
        }, 1000);
    }

    applyDarkTheme() {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;

        if (this.elements.scrollProgress) {
            this.elements.scrollProgress.style.width = `${scrollPercent}%`;
        }

        if (this.elements.nav) {
            if (scrollTop > 50) {
                this.elements.nav.classList.add('scrolled');
            } else {
                this.elements.nav.classList.remove('scrolled');
            }
        }

        if (this.elements.scrollToTop) {
            if (scrollTop > 300) {
                this.elements.scrollToTop.classList.add('visible');
            } else {
                this.elements.scrollToTop.classList.remove('visible');
            }
        }

        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const scrollTop = window.pageYOffset + 100;
        
        this.elements.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollTop >= sectionTop && scrollTop < sectionTop + sectionHeight) {
                this.elements.navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active-link');
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }

    handleResize() {
        if (window.innerWidth > 768 && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        this.updateCursorFollower();
    }

    handleLoad() {
        this.setupIntersectionObserver();
        this.animateSkillBars();
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.elements.navMenu && this.elements.navMenuBtn) {
            this.elements.navMenu.classList.toggle('responsive', this.isMenuOpen);
            this.elements.navMenuBtn.setAttribute('aria-expanded', this.isMenuOpen.toString());
            
            if (this.isMenuOpen) {
                this.elements.navMenuBtn.setAttribute('aria-label', 'Close navigation menu');
                document.body.style.overflow = 'hidden';
            } else {
                this.elements.navMenuBtn.setAttribute('aria-label', 'Open navigation menu');
                document.body.style.overflow = '';
            }
        }
    }

    closeMobileMenu() {
        if (this.isMenuOpen) {
            this.isMenuOpen = false;
            this.elements.navMenu?.classList.remove('responsive');
            this.elements.navMenuBtn?.setAttribute('aria-expanded', 'false');
            this.elements.navMenuBtn?.setAttribute('aria-label', 'Open navigation menu');
            document.body.style.overflow = '';
        }
    }

    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const headerHeight = this.elements.nav?.offsetHeight || 80;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            this.closeMobileMenu();
        }
    }

    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    setupCursorFollower() {
        if (!this.elements.cursorFollower || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            return;
        }

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;

        const updateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            
            this.elements.cursorFollower.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
            requestAnimationFrame(updateCursor);
        };

        updateCursor();
    }

    updateCursorFollower(e) {
        if (this.elements.cursorFollower) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        }
    }

    handleKeydown(e) {
        if (e.key === 'Escape' && this.isMenuOpen) {
            this.closeMobileMenu();
        }
        
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    }

    setupTypingEffect() {
        const typedElement = document.querySelector('.typedText');
        if (typedElement && typeof Typed !== 'undefined') {
            // First destroy any existing instance to avoid conflicts
            if (window.typingInstance) {
                window.typingInstance.destroy();
            }
            
            // Create a new instance with improved configuration
            window.typingInstance = new Typed('.typedText', {
                strings: [
                    'Computer Science Student',
                    'Machine Learning Enthusiast', 
                    'Game Developer',
                    'Full Stack Developer',
                    'Problem Solver'
                ],
                typeSpeed: 70,
                backSpeed: 35,
                backDelay: 1500,
                loop: true,
                showCursor: true,
                cursorChar: '|',
                // Disable smart backspace as it can cause glitches
                smartBackspace: false,
                // Add a small delay before starting
                startDelay: 300,
                // Fix for handling HTML content
                contentType: 'html',
                // These settings help with smoother transitions
                fadeOut: false,
                fadeOutClass: 'typed-fade-out',
                fadeOutDelay: 500,
                // Prevent staggered typing effect
                shuffle: false,
                // Ensures better stability between strings
                loopCount: Infinity
            });
        }
    }

    setupScrollEffects() {
        if (typeof ScrollReveal === 'undefined') return;
        
        // Check if device is mobile for lighter animations
        const isMobile = window.innerWidth < 768;

        const sr = ScrollReveal({
            origin: 'bottom',
            distance: isMobile ? '30px' : '60px',
            duration: isMobile ? 800 : 1000,
            delay: isMobile ? 100 : 200,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            reset: false,
            mobile: true,
            useDelay: isMobile ? 'once' : 'always'
        });

        sr.reveal('.featured-text', { delay: 100 });
        sr.reveal('.featured-image', { delay: 300, origin: 'right' });
        sr.reveal('.about-info', { delay: 100, origin: 'left' });
        sr.reveal('.skills-section', { delay: 200, origin: 'right' });
        
        // Ensure all section headers are properly targeted
        sr.reveal('.top-header', { 
            delay: 100, 
            origin: 'top', 
            distance: '30px',
            interval: 200 
        });
        
        // Specifically target the projects section header if needed
        sr.reveal('#projects .top-header', { 
            delay: 150, 
            origin: 'top', 
            distance: '30px' 
        });
        
        sr.reveal('.contact-info', { delay: 100, origin: 'left' });
        sr.reveal('.form-control', { delay: 200, origin: 'right' });
        
        sr.reveal('.project-box', {
            delay: 100,
            interval: 100,
            origin: 'bottom'
        });

        // Footer animations
        sr.reveal('.top-footer', { 
            delay: 100, 
            origin: 'bottom', 
            distance: '20px' 
        });
        
        sr.reveal('.middle-footer', { 
            delay: 200, 
            origin: 'bottom', 
            distance: '20px' 
        });
        
        sr.reveal('.footer-social-icons', { 
            delay: 300, 
            origin: 'bottom', 
            distance: '20px' 
        });
        
        sr.reveal('.bottom-footer', { 
            delay: 400, 
            origin: 'bottom', 
            distance: '20px' 
        });
    }

    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fadeInUp');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.about-info, .skills-box, .project-box, .contact-info').forEach(el => {
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    animateSkillBars() {
        const skillBars = document.querySelectorAll('.progress');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target;
                    const width = progressBar.style.width;
                    progressBar.style.width = '0%';
                    
                    setTimeout(() => {
                        progressBar.style.width = width;
                    }, 200);
                    
                    observer.unobserve(progressBar);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => observer.observe(bar));
        this.observers.push(observer);
    }

    async fetchProjects() {
        const loadingElement = this.elements.projectContainer?.querySelector('.loading-projects');
        
        try {
            const response = await fetch('https://api.github.com/users/zainnawaz22/repos', {
                headers: {
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const repos = await response.json();
            this.projects = this.processProjects(repos);
            this.renderProjects();
            
            // After projects are rendered, ensure section title is properly animated
            this.ensureProjectSectionAnimation();
            
        } catch (error) {
            console.error('Error fetching projects:', error);
            this.handleProjectsError();
        } finally {
            loadingElement?.remove();
        }
    }

    processProjects(repos) {
        return repos
            .filter(repo => !repo.fork && repo.description)
            .map(repo => ({
                id: repo.id,
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                language: repo.language,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                updated: new Date(repo.updated_at),
                category: this.categorizeProject(repo),
                tags: this.generateProjectTags(repo)
            }))
            .sort((a, b) => b.updated - a.updated)
            .slice(0, 12);
    }

    generateProjectTags(repo) {
        const tags = [];
        const name = repo.name.toLowerCase();
        const description = (repo.description || '').toLowerCase();
        
        // Add language as a tag if it exists
        if (repo.language) {
            tags.push(repo.language);
        }
        
        // Add category as a tag
        const category = this.categorizeProject(repo);
        if (category === 'web') {
            tags.push('Web');
            
            // Add more specific web technologies based on keywords
            if (description.includes('react') || name.includes('react')) tags.push('React');
            if (description.includes('vue') || name.includes('vue')) tags.push('Vue');
            if (description.includes('angular') || name.includes('angular')) tags.push('Angular');
            if (description.includes('node') || name.includes('node')) tags.push('Node.js');
            if (description.includes('javascript') || description.includes('js')) tags.push('JavaScript');
            if (description.includes('typescript') || description.includes('ts')) tags.push('TypeScript');
            if (description.includes('html') || description.includes('css')) tags.push('HTML/CSS');
        }
        
        if (category === 'ml') {
            tags.push('Machine Learning');
            
            // Add more specific ML technologies
            if (description.includes('tensorflow') || name.includes('tensorflow')) tags.push('TensorFlow');
            if (description.includes('pytorch') || name.includes('pytorch')) tags.push('PyTorch');
            if (description.includes('scikit') || name.includes('scikit')) tags.push('Scikit-learn');
            if (description.includes('nlp') || description.includes('natural language')) tags.push('NLP');
            if (description.includes('vision') || description.includes('image')) tags.push('Computer Vision');
            if (description.includes('data') || description.includes('analysis')) tags.push('Data Analysis');
        }
        
        if (category === 'game') {
            tags.push('Game Development');
            
            // Add more specific game dev technologies
            if (description.includes('unity') || name.includes('unity')) tags.push('Unity');
            if (description.includes('unreal') || name.includes('unreal')) tags.push('Unreal Engine');
            if (description.includes('3d') || name.includes('3d')) tags.push('3D');
            if (description.includes('2d') || name.includes('2d')) tags.push('2D');
            if (description.includes('physics') || name.includes('physics')) tags.push('Physics');
            if (description.includes('ai') || description.includes('artificial intelligence')) tags.push('AI');
        }
        
        // Remove duplicates and return
        return [...new Set(tags)];
    }

    categorizeProject(repo) {
        const name = repo.name.toLowerCase();
        const description = (repo.description || '').toLowerCase();
        const language = (repo.language || '').toLowerCase();

        if (language.includes('javascript') || language.includes('typescript') || 
            name.includes('web') || description.includes('web')) {
            return 'web';
        }
        
        if (language.includes('python') || name.includes('ml') || name.includes('ai') ||
            description.includes('machine learning') || description.includes('data')) {
            return 'ml';
        }
        
        if (language.includes('c#') || language.includes('unity') || 
            name.includes('game') || description.includes('game')) {
            return 'game';
        }
        
        return 'other';
    }

    renderProjects() {
        if (!this.elements.projectContainer) return;

        const filteredProjects = this.currentFilter === 'all' 
            ? this.projects 
            : this.projects.filter(project => project.category === this.currentFilter);

        this.elements.projectContainer.innerHTML = filteredProjects.length 
            ? filteredProjects.map(project => this.createProjectHTML(project)).join('')
            : '<div class="no-projects"><p>No projects found for this category.</p></div>';

        this.setupProjectInteractions();
        this.triggerScrollReveal();
    }

    createProjectHTML(project) {
        const formatDate = (date) => {
            return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(
                Math.ceil((date - new Date()) / (1000 * 60 * 60 * 24)), 'day'
            );
        };

        // Create tags HTML
        const tagsHTML = project.tags && project.tags.length 
            ? `<div class="project-tags">
                ${project.tags.map(tag => `
                    <span class="project-tag" data-tag="${tag}">${tag}</span>
                `).join('')}
              </div>`
            : '';

        return `
            <article class="project-box" data-category="${project.category}">
                <div class="project-header">
                    <h3>${this.escapeHtml(project.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()))}</h3>
                    <div class="project-meta">
                        <span class="project-language">${project.language || 'Unknown'}</span>
                        <span class="project-updated">Updated ${formatDate(project.updated)}</span>
                    </div>
                </div>
                <p class="project-description">${this.escapeHtml(project.description)}</p>
                ${tagsHTML}
                <div class="project-stats">
                    <span class="stat">
                        <i class="uil uil-star" aria-hidden="true"></i>
                        ${project.stars}
                    </span>
                    <span class="stat">
                        <i class="uil uil-code-branch" aria-hidden="true"></i>
                        ${project.forks}
                    </span>
                </div>
                <div class="project-actions">
                    <a href="${project.url}" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="project-link"
                       aria-label="View ${project.name} on GitHub">
                        View Project
                        <i class="uil uil-external-link-alt" aria-hidden="true"></i>
                    </a>
                </div>
            </article>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupProjectInteractions() {
        const projectBoxes = document.querySelectorAll('.project-box');
        
        projectBoxes.forEach(box => {
            box.addEventListener('click', (e) => {
                if (e.target.closest('.project-link')) return;
                
                // Check if we clicked on a tag
                if (e.target.classList.contains('project-tag')) {
                    this.filterProjectsByTag(e.target.dataset.tag);
                    return;
                }
                
                const link = box.querySelector('.project-link');
                if (link) {
                    window.open(link.href, '_blank', 'noopener,noreferrer');
                }
            });

            box.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    box.click();
                }
            });
        });
    }

    filterProjectsByTag(tag) {
        if (!tag) return;
        
        // Filter projects by the selected tag
        const filteredProjects = this.projects.filter(project => 
            project.tags && project.tags.includes(tag)
        );
        
        // Render the filtered projects
        this.renderFilteredProjects(filteredProjects);
    }

    setupFormHandling() {
        if (!this.elements.contactForm) return;

        this.elements.contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        
        const inputs = this.elements.contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', this.validateField.bind(this));
            input.addEventListener('input', this.clearFieldError.bind(this));
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.elements.contactForm);
        const data = Object.fromEntries(formData);
        
        if (!this.validateForm(data)) {
            this.showFormStatus('Please fix the errors below.', 'error');
            return;
        }

        const submitBtn = this.elements.contactForm.querySelector('#submitBtn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span>Sending...</span><i class="uil uil-spinner" aria-hidden="true"></i>';
        submitBtn.disabled = true;

        try {
            await this.simulateFormSubmission(data);
            this.showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.elements.contactForm.reset();
        } catch (error) {
            console.error('Form submission error:', error);
            this.showFormStatus('Sorry, there was an error sending your message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    validateForm(data) {
        let isValid = true;
        
        if (!data.name || data.name.trim().length < 2) {
            this.showFieldError('name', 'Name must be at least 2 characters long.');
            isValid = false;
        }
        
        if (!data.email || !this.isValidEmail(data.email)) {
            this.showFieldError('email', 'Please enter a valid email address.');
            isValid = false;
        }
        
        if (!data.message || data.message.trim().length < 10) {
            this.showFieldError('message', 'Message must be at least 10 characters long.');
            isValid = false;
        }
        
        return isValid;
    }

    validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        
        switch (field.name) {
            case 'name':
                if (value.length > 0 && value.length < 2) {
                    this.showFieldError('name', 'Name must be at least 2 characters long.');
                } else {
                    this.clearFieldError(e);
                }
                break;
            case 'email':
                if (value.length > 0 && !this.isValidEmail(value)) {
                    this.showFieldError('email', 'Please enter a valid email address.');
                } else {
                    this.clearFieldError(e);
                }
                break;
            case 'message':
                if (value.length > 0 && value.length < 10) {
                    this.showFieldError('message', 'Message must be at least 10 characters long.');
                } else {
                    this.clearFieldError(e);
                }
                break;
        }
    }

    showFieldError(fieldName, message) {
        const field = this.elements.contactForm.querySelector(`[name="${fieldName}"]`);
        const errorElement = this.elements.contactForm.querySelector(`#${fieldName}-error`);
        
        if (field && errorElement) {
            field.classList.add('error');
            errorElement.textContent = message;
            field.setAttribute('aria-invalid', 'true');
        }
    }

    clearFieldError(e) {
        const field = e.target;
        const errorElement = this.elements.contactForm.querySelector(`#${field.name}-error`);
        
        if (field && errorElement) {
            field.classList.remove('error');
            errorElement.textContent = '';
            field.setAttribute('aria-invalid', 'false');
        }
    }

    showFormStatus(message, type) {
        const statusElement = this.elements.contactForm.querySelector('#formStatus');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = `form-status visible ${type}`;
            
            setTimeout(() => {
                statusElement.classList.remove('visible');
            }, 5000);
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    async simulateFormSubmission(data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted:', data);
                resolve();
            }, 2000);
        });
    }

    setupAnimations() {
        const animateOnScroll = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        };

        const observer = new IntersectionObserver(animateOnScroll, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.section > *').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });

        this.observers.push(observer);
    }

    destroy() {
        // Clean up observers
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        
        // Clean up event listeners
        window.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener('resize', this.handleResize);
        window.removeEventListener('load', this.handleLoad);
        
        // Clean up typing effect
        if (window.typingInstance) {
            window.typingInstance.destroy();
            window.typingInstance = null;
        }
    }

    // Ensure project section animations are applied
    ensureProjectSectionAnimation() {
        // Make sure the projects section title is visible and has animation effects
        const projectsHeader = document.querySelector('#projects .top-header');
        
        if (projectsHeader) {
            // Apply fade-in animation if not already visible
            if (getComputedStyle(projectsHeader).opacity < '1') {
                projectsHeader.style.opacity = '0';
                projectsHeader.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    projectsHeader.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                    projectsHeader.style.opacity = '1';
                    projectsHeader.style.transform = 'translateY(0)';
                }, 100);
            }
            
            // Apply gradient text effect to ensure it's visible
            const projectTitle = projectsHeader.querySelector('h2');
            if (projectTitle) {
                projectTitle.style.backgroundImage = 'var(--gradient-primary)';
                projectTitle.style.webkitBackgroundClip = 'text';
                projectTitle.style.backgroundClip = 'text';
                projectTitle.style.webkitTextFillColor = 'transparent';
                projectTitle.style.color = 'transparent';
            }
        }
    }

    setupEnhancedProjectFiltering() {
        // This method is now empty as we're removing the popular tags section
        // while keeping the tag functionality in individual project cards
    }
    
    filterProjectsByTag(tag) {
        if (!tag) return;
        
        // Filter projects by the selected tag
        const filteredProjects = this.projects.filter(project => 
            project.tags && project.tags.includes(tag)
        );
        
        // Render the filtered projects
        this.renderFilteredProjects(filteredProjects);
    }

    renderFilteredProjects(filteredProjects) {
        if (!this.elements.projectContainer) return;
        
        if (filteredProjects.length === 0) {
            this.elements.projectContainer.innerHTML = `
                <div class="no-projects">
                    <i class="uil uil-filter-slash" aria-hidden="true"></i>
                    <p>No projects found matching this tag.</p>
                    <button class="reset-search">Clear Filter</button>
                </div>
            `;
            
            // Add event listener to reset button
            const resetButton = this.elements.projectContainer.querySelector('.reset-search');
            if (resetButton) {
                resetButton.addEventListener('click', () => {
                    this.renderProjects();
                });
            }
        } else {
            // Use existing project HTML creation but with filtered projects
            this.elements.projectContainer.innerHTML = filteredProjects
                .map(project => this.createProjectHTML(project))
                .join('');
                
            // Re-setup project interactions
            this.setupProjectInteractions();
        }
    }

    handleProjectsError() {
        if (this.elements.projectContainer) {
            this.elements.projectContainer.innerHTML = `
                <div class="error-message">
                    <h3>Unable to load projects</h3>
                    <p>Please try again later or visit my <a href="https://github.com/zainnawaz22" target="_blank" rel="noopener noreferrer">GitHub profile</a> directly.</p>
                </div>
            `;
        }
    }

    handleFilterClick(e) {
        const btn = e.currentTarget;
        const filter = btn.dataset.filter;

        this.elements.filterBtns.forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-selected', 'false');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        this.currentFilter = filter;
        this.renderProjects();
    }

    triggerScrollReveal() {
        if (typeof ScrollReveal !== 'undefined') {
            ScrollReveal().reveal('.project-box', {
                delay: 100,
                interval: 100,
                origin: 'bottom',
                distance: '30px',
                duration: 600
            });
        }
    }

    detectMobileDevice() {
        const isMobile = window.innerWidth < 768 || 
                        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return isMobile;
    }

    applyMobileOptimizations() {
        // Reduce scroll animations
        document.querySelectorAll('.project-box').forEach((box, index) => {
            if (index > 5) {
                box.style.opacity = 1;
                box.style.transform = 'none';
            }
        });
        
        // Use passive event listeners for better scrolling
        this.addPassiveEventListeners();
        
        // Optimize image loading
        this.lazyLoadImages();
    }
    
    addPassiveEventListeners() {
        // Improve touch and scroll performance with passive listeners
        const passiveSupported = this.detectPassiveSupport();
        const wheelOpt = passiveSupported ? { passive: true } : false;
        
        window.addEventListener('scroll', this.throttle(this.handleScroll.bind(this), 16), wheelOpt);
        window.addEventListener('touchstart', () => {}, wheelOpt);
        window.addEventListener('touchmove', () => {}, wheelOpt);
    }
    
    detectPassiveSupport() {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get: () => {
                    supportsPassive = true;
                    return true;
                }
            });
            window.addEventListener('testPassive', null, opts);
            window.removeEventListener('testPassive', null, opts);
        } catch (e) {}
        return supportsPassive;
    }
    
    lazyLoadImages() {
        // Convert to IntersectionObserver for more efficient image loading
        const imgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.portfolioApp = new PortfolioApp();
});

window.addEventListener('beforeunload', () => {
    if (window.portfolioApp) {
        window.portfolioApp.destroy();
    }
});
