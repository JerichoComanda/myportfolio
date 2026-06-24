document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons immediately after DOM is ready
    if (window.lucide) {
        lucide.createIcons();
    }

    // ==========================================
    // Theme Toggle (Dark/Light Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        htmlElement.classList.remove('light');
        htmlElement.classList.add('dark');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            htmlElement.classList.add('light');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.classList.remove('light');
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    });

    // ==========================================
    // Mobile Menu Toggle
    // ==========================================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        // Re-render icons if menu state changes
        if(window.lucide) {
            let iconName = mobileMenu.classList.contains('active') ? 'x' : 'menu';
            mobileMenuBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
            lucide.createIcons();
        }
    });

    // Close mobile menu when a link is clicked
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            if(window.lucide) {
                mobileMenuBtn.innerHTML = '<i data-lucide="menu"></i>';
                lucide.createIcons();
            }
        });
    });

    // ==========================================
    // Sticky Navbar & Scroll Progress
    // ==========================================
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Sticky Navbar
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll Progress Bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + '%';
    });

    // ==========================================
    // Smooth Scrolling & Active Link Highlight
    // ==========================================
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ==========================================
    // Typewriter Effect
    // ==========================================
    const texts = [
        "Software Developer",
        "IT Support Specialist",
        "Web Designer",
        "Database Administrator",
        "Computer Technician"
    ];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';
    let isDeleting = false;
    const typewriterElement = document.getElementById('typewriter-text');

    function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        typewriterElement.textContent = letter;

        let typeSpeed = 100;

        if (isDeleting) {
            typeSpeed /= 2;
        }

        if (!isDeleting && letter.length === currentText.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    // Start typewriter
    setTimeout(type, 1000);

    // ==========================================
    // Scroll Reveal & Animated Elements
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');
    const skillBars = document.querySelectorAll('.skill-progress');
    const statNumbers = document.querySelectorAll('.stat-number');
    
    // Check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.85
        );
    }

    // Counter animation function
    function animateCounter(el) {
        if (el.classList.contains('counted')) return;
        
        const target = +el.getAttribute('data-target');
        const isPlus = el.getAttribute('data-plus') === 'true';
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                el.innerText = Math.ceil(current);
                if (isPlus) el.classList.add('has-plus');
                requestAnimationFrame(updateCounter);
            } else {
                el.innerText = target;
                if (isPlus) el.classList.add('has-plus');
                el.classList.add('counted');
            }
        };
        updateCounter();
    }

    function handleScrollAnimations() {
        // Reveal elements
        revealElements.forEach(el => {
            if (isElementInViewport(el)) {
                el.classList.add('active');
            }
        });

        // Skill bars
        skillBars.forEach(bar => {
            if (isElementInViewport(bar.parentElement)) {
                bar.style.width = bar.getAttribute('data-width');
            }
        });

        // Counters
        statNumbers.forEach(num => {
            if (isElementInViewport(num)) {
                animateCounter(num);
            }
        });
    }

    // Initial check and scroll event listener
    handleScrollAnimations();
    window.addEventListener('scroll', handleScrollAnimations);

    // ==========================================
    // EmailJS Configuration & Form Submission
    // ==========================================
    // Initialize EmailJS v4 with publicKey object format
    try {
        emailjs.init({ publicKey: 'FUIxY1r2CzJ738Ou-' });
    } catch (initErr) {
        console.error('EmailJS failed to initialize:', initErr);
    }

    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const formError = document.getElementById('form-error');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const user_name = document.getElementById('user_name');
            const user_email = document.getElementById('user_email');
            const subject = document.getElementById('subject');
            const message = document.getElementById('message');

            // Reset errors
            document.querySelectorAll('.form-group').forEach(group => group.classList.remove('error'));
            if (formError) formError.classList.add('hidden');

            // Name validation
            if (user_name.value.trim() === '') {
                user_name.parentElement.classList.add('error');
                isValid = false;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(user_email.value.trim())) {
                user_email.parentElement.classList.add('error');
                isValid = false;
            }

            // Subject validation
            if (subject.value.trim() === '') {
                subject.parentElement.classList.add('error');
                isValid = false;
            }

            // Message validation
            if (message.value.trim() === '') {
                message.parentElement.classList.add('error');
                isValid = false;
            }

            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalBtnContent = submitBtn.innerHTML;

                submitBtn.innerHTML = '<span>Sending...</span>';
                submitBtn.disabled = true;

                const templateParams = {
                    name: user_name.value.trim(),
                    email: user_email.value.trim(),
                    subject: subject.value.trim(),
                    message: message.value.trim()
                };

                console.log('Sending email with params:', templateParams);

                emailjs.send('service_5pij8z3', 'template_s4rmlpp', templateParams)
                    .then(() => {
                        console.log('Email sent successfully!');
                        contactForm.reset();
                        submitBtn.innerHTML = originalBtnContent;
                        submitBtn.disabled = false;

                        if (formSuccess) formSuccess.classList.remove('hidden');
                        if (formError) formError.classList.add('hidden');

                        // Re-render icons for the restored button
                        if (window.lucide) lucide.createIcons();

                        setTimeout(() => {
                            if (formSuccess) formSuccess.classList.add('hidden');
                        }, 5000);
                    })
                    .catch((error) => {
                        console.error('EmailJS send error:', error);
                        submitBtn.innerHTML = originalBtnContent;
                        submitBtn.disabled = false;

                        if (window.lucide) lucide.createIcons();

                        const errMsg = document.getElementById('error-message');
                        if (errMsg) errMsg.textContent = 'Error: ' + (error?.text || error?.message || 'Failed to send. Please try again.');
                        if (formError) formError.classList.remove('hidden');
                    });
            }
        });
    } else {
        console.warn('Contact form element not found.');
    }

    // ==========================================
    // Image Modal Logic for Projects
    // ==========================================
    const modal = document.getElementById("image-modal");
    const modalImg = document.getElementById("modal-img");
    const captionText = document.getElementById("modal-caption");
    const closeModal = document.querySelector(".close-modal");

    // Get all project images
    const projectImages = document.querySelectorAll(".project-card .project-image img");

    if (modal && modalImg && projectImages.length > 0) {
        projectImages.forEach(img => {
            // Make image look clickable
            img.style.cursor = 'pointer';
            
            img.addEventListener('click', function() {
                modal.classList.add("active");
                modalImg.src = this.src;
                // Try to get title from project card
                const projectCard = this.closest('.project-card');
                if (projectCard) {
                    const title = projectCard.querySelector('.project-title');
                    captionText.innerHTML = title ? title.innerText : this.alt;
                } else {
                    captionText.innerHTML = this.alt;
                }
            });
        });

        // Close modal
        closeModal.addEventListener('click', function() {
            modal.classList.remove("active");
        });

        // Close modal on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === "Escape" && modal.classList.contains("active")) {
                modal.classList.remove("active");
            }
        });
    }

    // ==========================================
    // Badge Modal Logic
    // ==========================================
    const badgeModal = document.getElementById('badge-modal');
    const badgeModalImg = document.getElementById('badge-modal-img');
    const badgeModalVerify = document.getElementById('badge-modal-verify');
    const badgeModalClose = document.getElementById('badge-modal-close');
    const badgeIcons = document.querySelectorAll('.cert-badge-icon');

    if (badgeModal && badgeIcons.length > 0) {
        badgeIcons.forEach(icon => {
            icon.style.cursor = 'pointer';
            icon.addEventListener('click', function () {
                badgeModalImg.src = this.src;
                badgeModalImg.alt = this.alt;
                badgeModalVerify.href = this.getAttribute('data-credly') || '#';
                badgeModal.classList.add('active');
                if (window.lucide) lucide.createIcons();
            });
        });

        // Close on X button
        badgeModalClose.addEventListener('click', function () {
            badgeModal.classList.remove('active');
        });

        // Close on backdrop click
        badgeModal.addEventListener('click', function (e) {
            if (e.target === badgeModal) {
                badgeModal.classList.remove('active');
            }
        });

        // Close on Escape
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && badgeModal.classList.contains('active')) {
                badgeModal.classList.remove('active');
            }
        });
    }
});
