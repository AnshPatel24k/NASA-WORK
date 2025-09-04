// Animation Controller using GSAP
class AnimationController {
    constructor() {
        this.animations = {};
        this.scrollTriggers = [];
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        // Wait for GSAP to be available
        if (typeof gsap !== 'undefined') {
            this.setupGSAP();
            this.registerScrollTriggers();
            this.setupHoverAnimations();
            this.isInitialized = true;
        } else {
            // Fallback to CSS animations
            this.setupCSSAnimations();
        }
    }

    setupGSAP() {
        // Register ScrollTrigger plugin if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        // Set default animation settings
        gsap.defaults({
            duration: 1,
            ease: "power2.out"
        });
    }

    registerScrollTriggers() {
        // Chapter entrance animations
        this.createChapterAnimations();
        
        // Evidence room animations
        this.createEvidenceAnimations();
        
        // Chart animations
        this.createChartAnimations();
        
        // Timelapse animations
        this.createTimelapseAnimations();
        
        // Map animations
        this.createMapAnimations();
        
        // Simulator animations
        this.createSimulatorAnimations();
        
        // Verdict animations
        this.createVerdictAnimations();
    }

    createChapterAnimations() {
        // Case file entrance
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.fromTo('.case-file', 
                {
                    opacity: 0,
                    y: 100,
                    scale: 0.8
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 1.5,
                    ease: "back.out(1.7)",
                    scrollTrigger: {
                        trigger: '[data-chapter="1"]',
                        start: "top center",
                        end: "bottom center",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    }

    createEvidenceAnimations() {
        const evidenceItems = document.querySelectorAll('.evidence-item');
        
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            evidenceItems.forEach((item, index) => {
                gsap.fromTo(item,
                    {
                        opacity: 0,
                        y: 50,
                        rotationY: -15
                    },
                    {
                        opacity: 1,
                        y: 0,
                        rotationY: 0,
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: item,
                            start: "top 80%",
                            end: "bottom 20%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        } else {
            // Fallback to CSS animations
            evidenceItems.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.2}s`;
                item.classList.add('animate-fade-in-up');
            });
        }
    }

    createChartAnimations() {
        const chartContainers = document.querySelectorAll('.chart-container');
        
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            chartContainers.forEach((container, index) => {
                gsap.fromTo(container,
                    {
                        opacity: 0,
                        scale: 0.8,
                        rotation: -5
                    },
                    {
                        opacity: 1,
                        scale: 1,
                        rotation: 0,
                        duration: 1,
                        delay: index * 0.15,
                        ease: "back.out(1.2)",
                        scrollTrigger: {
                            trigger: container,
                            start: "top 85%",
                            end: "bottom 15%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });
        }
    }

    createTimelapseAnimations() {
        const timelapseContainer = document.querySelector('.timelapse-container');
        
        if (timelapseContainer && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            // Animate the main container
            gsap.fromTo(timelapseContainer,
                {
                    opacity: 0,
                    y: 100
                },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: timelapseContainer,
                        start: "top 70%",
                        end: "bottom 30%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Animate controls separately
            const controls = timelapseContainer.querySelector('.timelapse-controls');
            if (controls) {
                gsap.fromTo(controls.children,
                    {
                        opacity: 0,
                        x: -50
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 0.8,
                        stagger: 0.2,
                        delay: 0.5,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: controls,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }
    }

    createMapAnimations() {
        const mapContainer = document.querySelector('.map-investigation');
        
        if (mapContainer && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.fromTo(mapContainer.querySelector('#investigation-map'),
                {
                    opacity: 0,
                    scale: 0.9,
                    filter: 'blur(10px)'
                },
                {
                    opacity: 1,
                    scale: 1,
                    filter: 'blur(0px)',
                    duration: 1.5,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: mapContainer,
                        start: "top 60%",
                        end: "bottom 40%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Animate map controls
            const controls = mapContainer.querySelector('.map-controls');
            if (controls) {
                gsap.fromTo(controls,
                    {
                        opacity: 0,
                        x: 100
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        delay: 0.3,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: controls,
                            start: "top 80%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }
    }

    createSimulatorAnimations() {
        const simulatorContainer = document.querySelector('.simulator-container');
        
        if (simulatorContainer && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            const controls = simulatorContainer.querySelector('.scenario-controls');
            const results = simulatorContainer.querySelector('.simulation-results');

            if (controls) {
                gsap.fromTo(controls,
                    {
                        opacity: 0,
                        x: -100
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: controls,
                            start: "top 75%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }

            if (results) {
                gsap.fromTo(results,
                    {
                        opacity: 0,
                        x: 100
                    },
                    {
                        opacity: 1,
                        x: 0,
                        duration: 1,
                        delay: 0.2,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: results,
                            start: "top 75%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            }
        }
    }

    createVerdictAnimations() {
        const verdictSection = document.querySelector('.verdict-section');
        
        if (verdictSection && typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            const findings = verdictSection.querySelectorAll('.finding');
            const lessons = verdictSection.querySelectorAll('.lessons-learned li');
            const actionButtons = verdictSection.querySelectorAll('.action-buttons button, .action-buttons a');

            // Animate findings
            gsap.fromTo(findings,
                {
                    opacity: 0,
                    y: 50,
                    scale: 0.9
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: '.key-findings',
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Animate lessons
            gsap.fromTo(lessons,
                {
                    opacity: 0,
                    x: -50
                },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: '.lessons-learned',
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );

            // Animate action buttons
            gsap.fromTo(actionButtons,
                {
                    opacity: 0,
                    y: 30,
                    scale: 0.8
                },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "back.out(1.5)",
                    scrollTrigger: {
                        trigger: '.action-buttons',
                        start: "top 90%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    }

    setupHoverAnimations() {
        // Evidence item hover animations
        const evidenceItems = document.querySelectorAll('.evidence-item');
        evidenceItems.forEach(item => {
            if (typeof gsap !== 'undefined') {
                item.addEventListener('mouseenter', () => {
                    gsap.to(item, {
                        scale: 1.05,
                        y: -10,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });

                item.addEventListener('mouseleave', () => {
                    gsap.to(item, {
                        scale: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            }
        });

        // Button hover animations
        const buttons = document.querySelectorAll('button, .btn');
        buttons.forEach(button => {
            if (typeof gsap !== 'undefined') {
                button.addEventListener('mouseenter', () => {
                    gsap.to(button, {
                        scale: 1.05,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                });

                button.addEventListener('mouseleave', () => {
                    gsap.to(button, {
                        scale: 1,
                        duration: 0.2,
                        ease: "power2.out"
                    });
                });
            }
        });

        // Chart container hover animations
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            if (typeof gsap !== 'undefined') {
                container.addEventListener('mouseenter', () => {
                    gsap.to(container, {
                        y: -5,
                        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)",
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });

                container.addEventListener('mouseleave', () => {
                    gsap.to(container, {
                        y: 0,
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
            }
        });
    }

    setupCSSAnimations() {
        // Fallback CSS-based animations when GSAP is not available
        const sections = document.querySelectorAll('.story-section');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Add staggered animations to children
                    const children = entry.target.querySelectorAll('.evidence-item, .chart-container, .finding');
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('animate-fade-in-up');
                        }, index * 100);
                    });
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Animation utilities
    animateTimelapseTransition(fromYear, toYear) {
        const img = document.getElementById('timelapse-img');
        const notes = document.getElementById('year-observations');
        
        if (typeof gsap !== 'undefined' && img && notes) {
            gsap.to(img, {
                opacity: 0,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: () => {
                    // Update image source here
                    gsap.to(img, {
                        opacity: 1,
                        duration: 0.3,
                        ease: "power2.inOut"
                    });
                }
            });

            gsap.to(notes, {
                opacity: 0,
                y: 20,
                duration: 0.3,
                ease: "power2.inOut",
                onComplete: () => {
                    // Update notes content here
                    gsap.to(notes, {
                        opacity: 1,
                        y: 0,
                        duration: 0.3,
                        ease: "power2.inOut"
                    });
                }
            });
        }
    }

    animateSeaLevelChange(fromLevel, toLevel) {
        const currentLevel = document.querySelector('.current-level');
        const projectedLevel = document.querySelector('.projected-level');
        
        if (typeof gsap !== 'undefined' && currentLevel && projectedLevel) {
            gsap.to(currentLevel, {
                height: `${(fromLevel / 53.4) * 100}%`,
                duration: 1,
                ease: "power2.inOut"
            });

            gsap.to(projectedLevel, {
                height: `${(toLevel / 53.4) * 100}%`,
                duration: 1,
                delay: 0.5,
                ease: "power2.inOut"
            });
        }
    }

    animateChartBars(chart, data) {
        if (typeof gsap !== 'undefined' && chart) {
            const bars = chart.querySelectorAll('.chart-bar');
            gsap.fromTo(bars,
                {
                    scaleY: 0,
                    transformOrigin: "bottom"
                },
                {
                    scaleY: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "bounce.out"
                }
            );
        }
    }

    createParticleEffect(element, particleCount = 10) {
        if (typeof gsap === 'undefined') return;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: 4px;
                height: 4px;
                background: var(--gold-color);
                border-radius: 50%;
                pointer-events: none;
            `;
            
            element.appendChild(particle);
            
            gsap.set(particle, {
                x: Math.random() * element.offsetWidth,
                y: Math.random() * element.offsetHeight
            });
            
            gsap.to(particle, {
                y: -100,
                x: Math.random() * 200 - 100,
                opacity: 0,
                duration: 2 + Math.random() * 2,
                ease: "power2.out",
                onComplete: () => {
                    element.removeChild(particle);
                }
            });
        }
    }

    // Public methods
    playIntroAnimation() {
        const caseFile = document.querySelector('.case-file');
        if (typeof gsap !== 'undefined' && caseFile) {
            gsap.fromTo(caseFile,
                {
                    opacity: 0,
                    scale: 0.5,
                    rotation: -10
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 2,
                    ease: "elastic.out(1, 0.3)"
                }
            );
        }
    }

    refreshScrollTriggers() {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    }

    killAllAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.killTweensOf("*");
        }
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.killAll();
        }
    }

    pauseAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.pause();
        }
    }

    resumeAnimations() {
        if (typeof gsap !== 'undefined') {
            gsap.globalTimeline.resume();
        }
    }
}

// Initialize Animation Controller
document.addEventListener('DOMContentLoaded', () => {
    window.AnimationController = new AnimationController();
});

// Handle reduced motion preferences
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.01s');
    document.documentElement.style.setProperty('--transition-duration', '0.01s');
}