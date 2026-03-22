// Prince Togble Portfolio JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // Loader functionality
    const loader = document.getElementById('loader');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1500);
    });

    // Typing animation
    const typedText = document.getElementById('typed-text');
    const textArray = [
        'Étudiant BTS SIO SISR',
        'Administrateur Système',
        'Spécialiste Réseau',
        'Passionné d\'Infrastructure'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeText() {
        const currentText = textArray[textIndex];
        
        if (isDeleting) {
            typedText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typedText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % textArray.length;
            typingSpeed = 500;
        }

        setTimeout(typeText, typingSpeed);
    }

    // Start typing animation after loader
    setTimeout(() => {
        typeText();
    }, 2000);

    // Navbar scroll effect
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateNavbar() {
        const scrolled = window.pageYOffset;
        
        if (scrolled > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Update active nav link
        const sections = document.querySelectorAll('section');
        const scrollPos = scrolled + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateNavbar);

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu if open
            const navbarCollapse = document.getElementById('navbarNav');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });

    // Particle animation for hero section
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 2;
            this.speedY = (Math.random() - 0.5) * 2;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
            if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const numberOfParticles = Math.min(100, Math.floor(canvas.width * canvas.height / 15000));
        
        for (let i = 0; i < numberOfParticles; i++) {
            particles.push(new Particle());
        }
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        connectParticles();
        animationId = requestAnimationFrame(animateParticles);
    }

    // Initialize particles
    resizeCanvas();
    initParticles();
    animateParticles();

    // Handle resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });

    // Stop particles animation when not in view
    const heroSection = document.getElementById('home');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationId) animateParticles();
            } else {
                if (animationId) {
                    cancelAnimationFrame(animationId);
                    animationId = null;
                }
            }
        });
    });

    observer.observe(heroSection);

    // Animated progress bars
    const progressBars = document.querySelectorAll('.progress-bar');
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width');
                
                setTimeout(() => {
                    progressBar.style.width = width + '%';
                }, 200);
                
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });

    // Project modal functionality
    const projectData = {
        project1: {
            title: 'Architecture Réseau Entreprise',
            content: `
                <div class="row">
                    <div class="col-md-6">
                        <h5>Description du projet</h5>
                        <p>Conception et mise en œuvre d'une infrastructure réseau complète pour une PME de 50 utilisateurs, incluant la segmentation réseau, la sécurité et la haute disponibilité.</p>
                        
                        <h5>Objectifs</h5>
                        <ul>
                            <li>Améliorer les performances réseau</li>
                            <li>Sécuriser les communications</li>
                            <li>Faciliter la maintenance</li>
                            <li>Assurer la scalabilité</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h5>Technologies utilisées</h5>
                        <ul>
                            <li><strong>Cisco IOS</strong> - Configuration routeurs et switches</li>
                            <li><strong>VLAN</strong> - Segmentation du réseau</li>
                            <li><strong>Routage</strong> - OSPF et RIP</li>
                            <li><strong>Sécurité</strong> - ACL et pare-feu</li>
                        </ul>
                        
                        <h5>Résultats</h5>
                        <p>Amélioration de 40% des performances réseau et réduction significative des incidents de sécurité.</p>
                    </div>
                </div>
            `
        },
        project2: {
            title: 'Serveur Windows Active Directory',
            content: `
                <div class="row">
                    <div class="col-md-6">
                        <h5>Description du projet</h5>
                        <p>Déploiement et configuration d'un environnement Active Directory complet avec gestion centralisée des utilisateurs, des groupes et des politiques de sécurité.</p>
                        
                        <h5>Fonctionnalités implementées</h5>
                        <ul>
                            <li>Gestion centralisée des comptes utilisateurs</li>
                            <li>Politiques de groupe (GPO)</li>
                            <li>Services DNS intégrés</li>
                            <li>Authentification Kerberos</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h5>Technologies utilisées</h5>
                        <ul>
                            <li><strong>Windows Server 2019</strong> - Serveur principal</li>
                            <li><strong>Active Directory</strong> - Annuaire d'entreprise</li>
                            <li><strong>DNS</strong> - Résolution de noms</li>
                            <li><strong>PowerShell</strong> - Automatisation</li>
                        </ul>
                        
                        <h5>Impact</h5>
                        <p>Centralisation de l'administration IT et amélioration de la sécurité des accès pour 50+ utilisateurs.</p>
                    </div>
                </div>
            `
        },
        project3: {
            title: 'Solution de Sauvegarde',
            content: `
                <div class="row">
                    <div class="col-md-6">
                        <h5>Description du projet</h5>
                        <p>Mise en place d'une stratégie de sauvegarde complète avec automatisation des tâches et tests réguliers de restauration pour garantir l'intégrité des données.</p>
                        
                        <h5>Stratégie 3-2-1</h5>
                        <ul>
                            <li>3 copies des données importantes</li>
                            <li>2 supports de stockage différents</li>
                            <li>1 copie hors site (cloud)</li>
                            <li>Tests de restauration mensuels</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h5>Technologies utilisées</h5>
                        <ul>
                            <li><strong>Veeam Backup</strong> - Solution de sauvegarde</li>
                            <li><strong>PowerShell</strong> - Scripts d'automatisation</li>
                            <li><strong>Stockage NAS</strong> - Sauvegarde locale</li>
                            <li><strong>Cloud Storage</strong> - Sauvegarde externe</li>
                        </ul>
                        
                        <h5>Bénéfices</h5>
                        <p>RTO de 4h et RPO de 15 minutes, avec 99.9% de fiabilité des restaurations testées.</p>
                    </div>
                </div>
            `
        },
        project4: {
            title: 'Supervision Réseau',
            content: `
                <div class="row">
                    <div class="col-md-6">
                        <h5>Description du projet</h5>
                        <p>Déploiement d'une solution de monitoring complète permettant la surveillance en temps réel de l'infrastructure réseau avec alertes automatiques et tableaux de bord personnalisés.</p>
                        
                        <h5>Métriques surveillées</h5>
                        <ul>
                            <li>Disponibilité des équipements</li>
                            <li>Utilisation de la bande passante</li>
                            <li>Température et performance CPU</li>
                            <li>Espace disque disponible</li>
                        </ul>
                    </div>
                    <div class="col-md-6">
                        <h5>Technologies utilisées</h5>
                        <ul>
                            <li><strong>PRTG Network Monitor</strong> - Supervision centrale</li>
                            <li><strong>SNMP</strong> - Protocole de monitoring</li>
                            <li><strong>Scripts personnalisés</strong> - Vérifications spécifiques</li>
                            <li><strong>Notifications SMS/Email</strong> - Alertes</li>
                        </ul>
                        
                        <h5>Amélioration</h5>
                        <p>Réduction de 60% du temps de résolution d'incidents grâce à la détection proactive des problèmes.</p>
                    </div>
                </div>
            `
        }
    };

    window.openProjectModal = function(projectId) {
        const project = projectData[projectId];
        if (project) {
            document.getElementById('modalTitle').textContent = project.title;
            document.getElementById('modalBody').innerHTML = project.content;
            
            const modal = new bootstrap.Modal(document.getElementById('projectModal'));
            modal.show();
        }
    };

    // Form validation and submission
    const contactForm = document.querySelector('.contact-form');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const formInputs = this.querySelectorAll('.form-control');
        
        // Simple validation
        let isValid = true;
        formInputs.forEach(input => {
            input.classList.remove('is-invalid');
            if (!input.value.trim()) {
                input.classList.add('is-invalid');
                isValid = false;
            }
        });
        
        if (isValid) {
            // Simulate form submission
            const submitButton = this.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Envoi en cours...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                submitButton.innerHTML = '<i class="fas fa-check me-2"></i>Message envoyé !';
                submitButton.classList.remove('btn-primary');
                submitButton.classList.add('btn-success');
                
                setTimeout(() => {
                    submitButton.innerHTML = originalText;
                    submitButton.classList.remove('btn-success');
                    submitButton.classList.add('btn-primary');
                    submitButton.disabled = false;
                    this.reset();
                }, 3000);
            }, 2000);
        }
    });

    // Enhanced form input animations
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const heroSection = document.getElementById('home');
        const heroContent = document.querySelector('.hero-content');
        
        if (heroSection && scrolled < heroSection.offsetHeight) {
            const parallax = scrolled * 0.5;
            heroContent.style.transform = `translateY(${parallax}px)`;
        }
    });

    // Add floating animation to tech items
    const techItems = document.querySelectorAll('.tech-item');
    
    techItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.animation = `float 3s ease-in-out infinite ${index * 0.5}s`;
        }, 1000);
    });

    // Add CSS for floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-10px);
            }
        }
    `;
    document.head.appendChild(style);

    // Advanced 3D hover effects for project cards
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // Add smooth reveal animations for sections
    const sections = document.querySelectorAll('section');
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(section => {
        section.classList.add('section-hidden');
        sectionObserver.observe(section);
    });

    // Add section animation styles
    const sectionStyle = document.createElement('style');
    sectionStyle.textContent = `
        .section-hidden {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s ease;
        }
        
        .section-visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(sectionStyle);

    // Easter egg: Konami code
    let konamiCode = [];
    const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // ↑↑↓↓←→←→BA
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.keyCode);
        if (konamiCode.length > konamiSequence.length) {
            konamiCode.shift();
        }
        
        if (konamiCode.length === konamiSequence.length && 
            konamiCode.every((code, index) => code === konamiSequence[index])) {
            
            // Activate special effect
            document.body.style.animation = 'rainbow 2s infinite';
            
            const rainbowStyle = document.createElement('style');
            rainbowStyle.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(rainbowStyle);
            
            setTimeout(() => {
                document.body.style.animation = '';
                rainbowStyle.remove();
            }, 4000);
            
            konamiCode = [];
        }
    });

    // Performance optimization: Lazy load animations
    const lazyElements = document.querySelectorAll('[data-aos]');
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
                lazyObserver.unobserve(entry.target);
            }
        });
    }, { 
        rootMargin: '50px',
        threshold: 0.1 
    });

    lazyElements.forEach(el => {
        lazyObserver.observe(el);
    });

    // Console Easter egg
    console.log('%cBienvenue sur le portfolio de Prince Togble ! 🚀', 
                'color: #0066CC; font-size: 20px; font-weight: bold;');
    console.log('%cÉtudiant BTS SIO SISR passionné par les infrastructures système et réseau.', 
                'color: #4A90E2; font-size: 14px;');
    console.log('%cSi vous voyez ce message, vous êtes probablement un développeur ! 👨‍💻', 
                'color: #666; font-size: 12px;');

});

// Global utility functions
window.scrollToTop = function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Add scroll to top button
const scrollToTopButton = document.createElement('button');
scrollToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopButton.className = 'scroll-to-top';
scrollToTopButton.onclick = window.scrollToTop;

const scrollToTopStyle = document.createElement('style');
scrollToTopStyle.textContent = `
    .scroll-to-top {
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: var(--gradient-primary, linear-gradient(135deg, #0066CC 0%, #4A90E2 100%));
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 18px;
        cursor: pointer;
        transition: all 0.3s ease;
        opacity: 0;
        visibility: hidden;
        z-index: 1000;
        box-shadow: 0 4px 15px rgba(0, 102, 204, 0.3);
    }
    
    .scroll-to-top:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 102, 204, 0.4);
    }
    
    .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
    }
`;
document.head.appendChild(scrollToTopStyle);
document.body.appendChild(scrollToTopButton);

// Show/hide scroll to top button
window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
        scrollToTopButton.classList.add('visible');
    } else {
        scrollToTopButton.classList.remove('visible');
    }
});