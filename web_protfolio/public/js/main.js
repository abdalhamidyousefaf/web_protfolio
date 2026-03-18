const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');
const projectsGrid = document.getElementById('projectsGrid');
const blogGrid = document.getElementById('blogGrid');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const submitBtn = document.getElementById('submitBtn');
const backToTopBtn = document.getElementById('backToTop');
const blogModal = document.getElementById('blogModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const typewriterElement = document.getElementById('typewriter');
const filterBtns = document.querySelectorAll('.filter-btn');

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initTypewriter();
    loadProjects();
    loadBlogPosts();
    initContactForm();
    initScrollEffects();
    initBackToTop();
    initModal();
    initFilterButtons();
});


function initNavigation() {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navLinkItems.forEach((link) => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });
}

function initTypewriter() {
    const texts = [
        'Web Developer',
        'Frontend Developer',
        'Backend Developer',
        'Creative Problem Solver'
    ];
    let textIndex = 0;    
    let charIndex = 0;    
    let isDeleting = false; 
    const typingSpeed = 100;  
    const deletingSpeed = 50;
    const pauseAfterType = 2000; 


    function type() {
        const currentText = texts[textIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? deletingSpeed : typingSpeed;

        if (!isDeleting && charIndex === currentText.length) {
            delay = pauseAfterType;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            delay = 500; 
        }

        setTimeout(type, delay);
    }

    type();
}



/**
 * @param {string} category - Optional category filter ('all', 'frontend', 'fullstack')
 */
async function loadProjects(category = 'all') {
    try {
        projectsGrid.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading projects...</p>
            </div>
        `;

        const url = category === 'all'
            ? '/api/projects'
            : `/api/projects?category=${category}`;

        const response = await fetch(url);
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            renderProjects(result.data);
        } else {
            projectsGrid.innerHTML = `
                <div class="loading-spinner">
                    <p>No projects found in this category.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = `
            <div class="loading-spinner">
                <p>Failed to load projects. Please try again later.</p>
            </div>
        `;
    }
}

/**
 * @param {Array} projects - Array of project objects from the API
 */
function renderProjects(projects) {
    projectsGrid.innerHTML = projects.map((project, index) => `
        <div class="project-card" style="animation-delay: ${index * 0.1}s">
            <div class="project-image">
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <div class="project-overlay">
                    <a href="${project.liveUrl}" target="_blank" title="Live Demo" aria-label="View live demo">
                        <i class="fas fa-external-link-alt"></i>
                    </a>
                    <a href="${project.githubUrl}" target="_blank" title="Source Code" aria-label="View source code">
                        <i class="fab fa-github"></i>
                    </a>
                </div>
            </div>
            <div class="project-info">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <div class="project-tags">
                    ${project.technologies.map((tech) => `
                        <span class="project-tag">${tech}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}


function initFilterButtons() {
    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            // Update active button styling
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            // Load projects for the selected category
            const category = btn.dataset.filter;
            loadProjects(category);
        });
    });
}

async function loadBlogPosts() {
    try {
        // Show loading spinner while fetching
        blogGrid.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p>Loading blog posts...</p>
            </div>
        `;

        // Fetch blog posts from the backend
        const response = await fetch('/api/blog');
        const result = await response.json();

        if (result.success && result.data.length > 0) {
            // Render all blog cards
            renderBlogPosts(result.data);
        } else {
            blogGrid.innerHTML = `
                <div class="loading-spinner">
                    <p>No blog posts available yet.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading blog posts:', error);
        blogGrid.innerHTML = `
            <div class="loading-spinner">
                <p>Failed to load blog posts. Please try again later.</p>
            </div>
        `;
    }
}

/**
 * @param {Array} posts - Array of blog post objects from the API
 */
function renderBlogPosts(posts) {
    blogGrid.innerHTML = posts.map((post, index) => `
        <div class="blog-card" data-post-id="${post.id}" style="animation-delay: ${index * 0.1}s">
            <div class="blog-card-image">
                <img src="${post.image}" alt="${post.title}" loading="lazy">
            </div>
            <div class="blog-card-content">
                <div class="blog-card-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${formatDate(post.date)}</span>
                    <span><i class="fas fa-clock"></i> ${post.readTime}</span>
                </div>
                <h3>${post.title}</h3>
                <p>${post.excerpt}</p>
                <div class="blog-card-tags">
                    ${post.tags.map((tag) => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
                <span class="blog-read-more">
                    Read More <i class="fas fa-arrow-right"></i>
                </span>
            </div>
        </div>
    `).join('');

    // Attach click event to each blog card to open the modal
    document.querySelectorAll('.blog-card').forEach((card) => {
        card.addEventListener('click', () => {
            const postId = card.dataset.postId;
            openBlogPost(postId);
        });
    });
}

/**
 * @param {string} postId - The ID of the blog post to display
 */
async function openBlogPost(postId) {
    try {
        const response = await fetch(`/api/blog/${postId}`);
        const result = await response.json();

        if (result.success) {
            const post = result.data;
            modalBody.innerHTML = `
                <h2>${post.title}</h2>
                <div class="modal-meta">
                    <span><i class="fas fa-user"></i> ${post.author}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${formatDate(post.date)}</span>
                    <span><i class="fas fa-clock"></i> ${post.readTime}</span>
                </div>
                <img src="${post.image}" alt="${post.title}">
                <div class="blog-content">${post.content}</div>
                <div class="modal-tags">
                    ${post.tags.map((tag) => `<span class="blog-tag">${tag}</span>`).join('')}
                </div>
            `;
            blogModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    } catch (error) {
        console.error('Error loading blog post:', error);
    }
}

function initModal() {
    modalClose.addEventListener('click', closeModal);

    blogModal.addEventListener('click', (e) => {
        if (e.target === blogModal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && blogModal.classList.contains('active')) {
            closeModal();
        }
    });
}


function closeModal() {
    blogModal.classList.remove('active');
    document.body.style.overflow = '';
}

function initContactForm() {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        clearFormErrors();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        let hasErrors = false;

        if (!name) {
            showFieldError('name', 'Please enter your name');
            hasErrors = true;
        }

        if (!email) {
            showFieldError('email', 'Please enter your email address');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            showFieldError('email', 'Please enter a valid email address');
            hasErrors = true;
        }

        if (!subject) {
            showFieldError('subject', 'Please enter a subject');
            hasErrors = true;
        }

        if (!message) {
            showFieldError('message', 'Please enter your message');
            hasErrors = true;
        }

        if (hasErrors) return;

        toggleSubmitLoading(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, subject, message })
            });

            const result = await response.json();

            if (result.success) {
                showFormStatus('success', result.message);
                contactForm.reset();
            } else {
                showFormStatus('error', result.message || 'Failed to send message.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            showFormStatus('error', 'Network error. Please check your connection and try again.');
        } finally {
            toggleSubmitLoading(false);
        }
    });
}

/**
 * @param {string} email - Email address to validate
 * @returns {boolean} True if the email format is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * @param {string} fieldId - The ID of the input field
 * @param {string} message - Error message to display
 */
function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}Error`);
    field.classList.add('error');
    errorSpan.textContent = message;
}

function clearFormErrors() {
    document.querySelectorAll('.form-error').forEach((span) => {
        span.textContent = '';
    });
    document.querySelectorAll('.form-group input, .form-group textarea').forEach((field) => {
        field.classList.remove('error');
    });
    formStatus.className = 'form-status';
    formStatus.textContent = '';
}

/**
 * @param {string} type - 'success' or 'error'
 * @param {string} message - The message to display
 */
function showFormStatus(type, message) {
    formStatus.className = `form-status ${type}`;
    formStatus.textContent = message;

    setTimeout(() => {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
    }, 5000);
}

/**
 * @param {boolean} isLoading - Whether the form is submitting
 */
function toggleSubmitLoading(isLoading) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    submitBtn.disabled = isLoading;
    btnText.style.display = isLoading ? 'none' : 'inline';
    btnLoading.style.display = isLoading ? 'inline' : 'none';
}

function initScrollEffects() {
    let statsAnimated = false;
    let skillsAnimated = false;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        updateActiveNavLink();

        if (!statsAnimated && isElementInView(document.querySelector('.about-stats'))) {
            animateStatCounters();
            statsAnimated = true;
        }

        if (!skillsAnimated && isElementInView(document.querySelector('.skills-container'))) {
            animateSkillBars();
            skillsAnimated = true;
        }
    });
}


function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinkItems.forEach((link) => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

/**
 * @param {HTMLElement} element - The element to check
 * @returns {boolean} True if the element is in the viewport
 */
function isElementInView(element) {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return rect.top < window.innerHeight && rect.bottom > 0;
}

function animateStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach((stat) => {
        const target = parseInt(stat.dataset.target);
        const duration = 2000; // Animation duration in ms
        const increment = target / (duration / 16); // ~60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.ceil(current);
                requestAnimationFrame(updateCounter);
            } else {
                stat.textContent = target;
            }
        };

        updateCounter();
    });
}


function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar) => {
        const progress = bar.dataset.progress;
        // Use setTimeout to ensure the transition is visible
        setTimeout(() => {
            bar.style.width = `${progress}%`;
        }, 200);
    });
}


function initBackToTop() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * @param {string} dateStr - Date string (e.g., "2025-11-15")
 * @returns {string} Formatted date (e.g., "Nov 15, 2025")
 */
function formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
}
