// Main JavaScript Controller
class AralSeaInvestigation {
    constructor() {
        this.currentChapter = 1;
        this.progressPercentage = 0;
        this.audioEnabled = true;
        this.timelapseData = this.initializeTimelapseData();
        this.isInitialized = false;
        
        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.initializeScrollTriggers();
        this.setupProgressTracking();
        this.initializeAudio();
        
        // Initialize after a short delay to show loading screen
        setTimeout(() => {
            this.hideLoadingScreen();
            this.isInitialized = true;
        }, 3000);
    }

    initializeTimelapseData() {
        return {
            1990: {
                image: 'sample/WhatsApp Image 2025-08-29 at 17.40.49_37279892.jpg',
                notes: '1990: The Aral Sea appears full and vibrant, covering approximately 68,000 km². Fishing boats dot the waters, and coastal communities thrive.',
                waterLevel: 53.4 // meters above sea level
            },
            1995: {
                image: 'sample/WhatsApp Image 2025-08-29 at 17.40.49_4e672a3f.jpg',
                notes: '1995: First signs of shrinkage become visible. The sea has begun to split into northern and southern parts due to dramatically reduced inflow.',
                waterLevel: 45.2
            },
            2000: {
                image: 'sample/WhatsApp Image 2025-08-29 at 17.40.50_6415c799.jpg',
                notes: '2000: The division is now clear. Two separate bodies of water exist where once there was one magnificent sea. Salinity increases rapidly.',
                waterLevel: 38.8
            },
            2005: {
                image: 'sample/WhatsApp Image 2025-08-29 at 17.40.50_9979000e.jpg',
                notes: '2005: The southern Aral Sea continues to shrink dramatically. Ships are now stranded far from any shoreline, creating an eerie ship graveyard.',
                waterLevel: 32.1
            },
            2010: {
                image: 'sample/WhatsApp Image 2025-08-29 at 17.40.50_d26ef9c7.jpg',
                notes: '2010: What remains is a fraction of the original sea. The exposed seabed creates dust storms that spread salt and chemicals across the region.',
                waterLevel: 28.5
            },
            2015: {
                image: 'sample/WhatsApp Image 2025-08-29 at 17.40.51_16f8bab1.jpg',
                notes: '2015: The eastern basin of the southern Aral Sea has completely dried up. Fishing industry collapse has devastated local communities.',
                waterLevel: 25.3
            },
            2020: {
                image: 'sample/WhatsApp Image 2025-08-29 at 17.40.51_67d4a907.jpg',
                notes: '2020: Only small remnants remain of what was once a massive inland sea. Climate change accelerates the remaining water loss.',
                waterLevel: 22.8
            },
            2025: {
                image: 'sample/WhatsApp Image 2025-08-29 at 17.40.51_d2ab72e6.jpg',
                notes: '2025: Today, less than 10% of the original Aral Sea remains. This environmental catastrophe serves as a stark warning for future water management.',
                waterLevel: 20.1
            }
        };
    }

    showLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.display = 'flex';
        
        // Animate loading progress
        const progressBar = document.querySelector('.loading-progress');
        progressBar.style.width = '0%';
        
        setTimeout(() => {
            progressBar.style.width = '100%';
        }, 500);
    }

    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.classList.add('fade-out');
        
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
        
        // Start the first chapter
        this.activateChapter(1);
    }

    setupEventListeners() {
        // Begin Investigation Button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('begin-investigation-btn')) {
                this.startInvestigation();
            }
        });

        // Audio Toggle
        const audioToggle = document.getElementById('audio-toggle');
        if (audioToggle) {
            audioToggle.addEventListener('click', () => {
                this.toggleAudio();
            });
        }

        // Restart Investigation
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('restart-btn')) {
                this.restartInvestigation();
            }
        });

        // Share Button
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('share-btn')) {
                this.shareStory();
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown' || e.key === 'Space') {
                this.nextChapter();
            } else if (e.key === 'ArrowUp') {
                this.previousChapter();
            }
        });
    }

    initializeScrollTriggers() {
        // Initialize Scrollama
        const scroller = scrollama();
        
        scroller
            .setup({
                step: '.story-section',
                offset: 0.5,
                debug: false
            })
            .onStepEnter((response) => {
                this.activateChapter(parseInt(response.element.dataset.chapter));
            });

        // Handle window resize
        window.addEventListener('resize', scroller.resize);
    }

    setupProgressTracking() {
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');

        // Update progress as user scrolls through chapters
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('.story-section');
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = Math.min((scrolled / documentHeight) * 100, 100);

            if (progressFill && progressText) {
                progressFill.style.width = `${progress}%`;
                progressText.textContent = `Investigation Progress: ${Math.round(progress)}%`;
            }

            this.progressPercentage = progress;
        });
    }

    activateChapter(chapterNumber) {
        // Remove active class from all sections
        document.querySelectorAll('.story-section').forEach(section => {
            section.classList.remove('active');
        });

        // Add active class to current section
        const currentSection = document.querySelector(`[data-chapter="${chapterNumber}"]`);
        if (currentSection) {
            currentSection.classList.add('active');
            this.currentChapter = chapterNumber;
            
            // Trigger chapter-specific initialization
            this.initializeChapter(chapterNumber);
            
            // Update audio based on chapter
            this.updateAudioForChapter(chapterNumber);
        }
    }

    initializeChapter(chapterNumber) {
        switch (chapterNumber) {
            case 1:
                this.initializeIntroChapter();
                break;
            case 2:
                this.initializeEvidenceRoom();
                break;
            case 3:
                this.initializeTimelapse();
                break;
            case 4:
                this.initializeMap();
                break;
            case 5:
                this.initializeCharts();
                break;
            case 6:
                this.initializeSimulator();
                break;
            case 7:
                this.initializeVerdict();
                break;
        }
    }

    initializeIntroChapter() {
        // Add typewriter effect to case file text
        const caseTitle = document.querySelector('.case-title');
        if (caseTitle && !caseTitle.classList.contains('typewriter-done')) {
            caseTitle.classList.add('typewriter');
            caseTitle.classList.add('typewriter-done');
        }
    }

    initializeEvidenceRoom() {
        // Initialize evidence room charts if not already done
        if (window.ChartsController && !this.evidenceChartsInitialized) {
            window.ChartsController.initializeEvidenceCharts();
            this.evidenceChartsInitialized = true;
        }
    }

    initializeTimelapse() {
        // Initialize timelapse functionality
        if (window.TimelapseController && !this.timelapseInitialized) {
            window.TimelapseController.initialize(this.timelapseData);
            this.timelapseInitialized = true;
        }
    }

    initializeMap() {
        // Initialize interactive map
        if (window.MapController && !this.mapInitialized) {
            window.MapController.initialize();
            this.mapInitialized = true;
        }
    }

    initializeCharts() {
        // Initialize data visualization charts
        if (window.ChartsController && !this.chartsInitialized) {
            window.ChartsController.initializeDataCharts();
            this.chartsInitialized = true;
        }
    }

    initializeSimulator() {
        // Initialize what-if simulator
        if (window.SimulatorController && !this.simulatorInitialized) {
            window.SimulatorController.initialize();
            this.simulatorInitialized = true;
        }
    }

    initializeVerdict() {
        // Final chapter initialization
        this.animateVerdictElements();
    }

    animateVerdictElements() {
        const findings = document.querySelectorAll('.finding');
        findings.forEach((finding, index) => {
            setTimeout(() => {
                finding.classList.add('animate-slide-in-left');
            }, index * 200);
        });

        const lessons = document.querySelectorAll('.lessons-learned li');
        lessons.forEach((lesson, index) => {
            setTimeout(() => {
                lesson.classList.add('animate-fade-in-up');
            }, 1000 + (index * 150));
        });
    }

    startInvestigation() {
        // Smooth scroll to evidence room
        const evidenceRoom = document.querySelector('[data-chapter="2"]');
        if (evidenceRoom) {
            evidenceRoom.scrollIntoView({ behavior: 'smooth' });
        }
    }

    nextChapter() {
        if (this.currentChapter < 7) {
            const nextSection = document.querySelector(`[data-chapter="${this.currentChapter + 1}"]`);
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    previousChapter() {
        if (this.currentChapter > 1) {
            const prevSection = document.querySelector(`[data-chapter="${this.currentChapter - 1}"]`);
            if (prevSection) {
                prevSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }

    initializeAudio() {
        // Audio will be handled by the AudioController
        if (window.AudioController) {
            window.AudioController.initialize();
        }
    }

    toggleAudio() {
        this.audioEnabled = !this.audioEnabled;
        const audioBtn = document.getElementById('audio-toggle');
        const audioIcon = audioBtn.querySelector('.audio-icon');
        
        if (this.audioEnabled) {
            audioBtn.classList.remove('muted');
            audioIcon.textContent = '🔊';
        } else {
            audioBtn.classList.add('muted');
            audioIcon.textContent = '🔇';
        }

        if (window.AudioController) {
            window.AudioController.toggleAudio(this.audioEnabled);
        }
    }

    updateAudioForChapter(chapterNumber) {
        if (window.AudioController && this.audioEnabled) {
            window.AudioController.updateForChapter(chapterNumber);
        }
    }

    restartInvestigation() {
        // Scroll to top and reset
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.currentChapter = 1;
        this.progressPercentage = 0;
        
        // Reset any interactive elements
        if (window.SimulatorController) {
            window.SimulatorController.reset();
        }
        
        // Reset progress bar
        const progressFill = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        if (progressFill && progressText) {
            progressFill.style.width = '0%';
            progressText.textContent = 'Investigation Progress: 0%';
        }
    }

    shareStory() {
        if (navigator.share) {
            navigator.share({
                title: 'The Aral Sea Mystery - NASA Terra Investigation',
                text: 'Discover how the Aral Sea disappeared through this interactive detective story using NASA satellite data.',
                url: window.location.href
            }).catch(console.error);
        } else {
            // Fallback to copying URL
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('Link copied to clipboard!');
            }).catch(() => {
                this.showNotification('Please copy the URL manually: ' + window.location.href);
            });
        }
    }

    showNotification(message) {
        // Create and show a temporary notification
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--detective-green);
            color: white;
            padding: 1rem 2rem;
            border-radius: 50px;
            z-index: 10000;
            animation: slideDown 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    handleResize() {
        // Handle responsive adjustments
        if (window.MapController) {
            window.MapController.resize();
        }
        
        if (window.ChartsController) {
            window.ChartsController.resize();
        }
    }

    // Public API for external access
    getCurrentChapter() {
        return this.currentChapter;
    }

    getProgressPercentage() {
        return this.progressPercentage;
    }

    isAudioEnabled() {
        return this.audioEnabled;
    }

    getTimelapseData() {
        return this.timelapseData;
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.AralSeaApp = new AralSeaInvestigation();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AralSeaInvestigation;
}