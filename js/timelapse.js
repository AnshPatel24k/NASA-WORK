// Timelapse Controller
class TimelapseController {
    constructor() {
        this.currentYear = 1990;
        this.isPlaying = false;
        this.playInterval = null;
        this.timelapseData = {};
        this.playSpeed = 800; // milliseconds between frames
        
        this.bindElements();
    }

    bindElements() {
        this.playButton = document.getElementById('play-timelapse');
        this.yearSlider = document.getElementById('year-range');
        this.yearDisplay = document.getElementById('current-year');
        this.timelapseImage = document.getElementById('timelapse-img');
        this.observationNotes = document.getElementById('year-observations');
    }

    initialize(timelapseData) {
        this.timelapseData = timelapseData;
        this.setupEventListeners();
        this.updateDisplay(this.currentYear);
    }

    setupEventListeners() {
        if (this.playButton) {
            this.playButton.addEventListener('click', () => {
                this.togglePlayback();
            });
        }

        if (this.yearSlider) {
            this.yearSlider.addEventListener('input', (e) => {
                this.currentYear = parseInt(e.target.value);
                this.updateDisplay(this.currentYear);
                
                if (this.isPlaying) {
                    this.pausePlayback();
                }
            });

            // Add keyboard support for slider
            this.yearSlider.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                    e.preventDefault();
                    const direction = e.key === 'ArrowLeft' ? -1 : 1;
                    const step = e.shiftKey ? 5 : 1; // Shift for larger steps
                    const newYear = Math.max(1990, Math.min(2025, this.currentYear + (direction * step)));
                    this.setYear(newYear);
                }
            });
        }

        // Keyboard shortcuts for entire timelapse
        document.addEventListener('keydown', (e) => {
            if (this.isTimelapseActive()) {
                switch (e.key) {
                    case ' ': // Spacebar to play/pause
                        e.preventDefault();
                        this.togglePlayback();
                        break;
                    case 'Home':
                        e.preventDefault();
                        this.setYear(1990);
                        break;
                    case 'End':
                        e.preventDefault();
                        this.setYear(2025);
                        break;
                    case 'ArrowLeft':
                        if (!e.target.matches('input[type="range"]')) {
                            e.preventDefault();
                            this.previousYear();
                        }
                        break;
                    case 'ArrowRight':
                        if (!e.target.matches('input[type="range"]')) {
                            e.preventDefault();
                            this.nextYear();
                        }
                        break;
                }
            }
        });
    }

    isTimelapseActive() {
        const timelapseSection = document.querySelector('[data-chapter="3"]');
        return timelapseSection && timelapseSection.classList.contains('active');
    }

    togglePlayback() {
        if (this.isPlaying) {
            this.pausePlayback();
        } else {
            this.startPlayback();
        }
    }

    startPlayback() {
        this.isPlaying = true;
        this.updatePlayButton();
        
        this.playInterval = setInterval(() => {
            this.nextYear();
            
            // Stop at the end
            if (this.currentYear >= 2025) {
                this.pausePlayback();
            }
        }, this.playSpeed);

        // Add visual feedback
        this.addPlaybackEffects();
    }

    pausePlayback() {
        this.isPlaying = false;
        this.updatePlayButton();
        
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }

        this.removePlaybackEffects();
    }

    nextYear() {
        const availableYears = Object.keys(this.timelapseData).map(y => parseInt(y)).sort((a, b) => a - b);
        const currentIndex = availableYears.indexOf(this.currentYear);
        
        if (currentIndex < availableYears.length - 1) {
            this.setYear(availableYears[currentIndex + 1]);
        }
    }

    previousYear() {
        const availableYears = Object.keys(this.timelapseData).map(y => parseInt(y)).sort((a, b) => a - b);
        const currentIndex = availableYears.indexOf(this.currentYear);
        
        if (currentIndex > 0) {
            this.setYear(availableYears[currentIndex - 1]);
        }
    }

    setYear(year) {
        this.currentYear = year;
        this.updateDisplay(year);
        
        if (this.yearSlider) {
            this.yearSlider.value = year;
        }
    }

    updateDisplay(year) {
        const data = this.timelapseData[year];
        if (!data) return;

        // Update year display
        if (this.yearDisplay) {
            this.yearDisplay.textContent = year;
        }

        // Update image with transition effect
        this.updateImage(data.image);
        
        // Update observation notes
        this.updateNotes(data.notes);
        
        // Update water level indicator if present
        this.updateWaterLevelIndicator(data.waterLevel);
        
        // Trigger detective clues
        this.triggerDetectiveClues(year, data);
    }

    updateImage(imageSrc) {
        if (!this.timelapseImage) return;

        // Create transition effect
        if (window.AnimationController && typeof gsap !== 'undefined') {
            gsap.to(this.timelapseImage, {
                opacity: 0.3,
                duration: 0.2,
                ease: "power2.inOut",
                onComplete: () => {
                    this.timelapseImage.src = imageSrc;
                    this.timelapseImage.onload = () => {
                        gsap.to(this.timelapseImage, {
                            opacity: 1,
                            duration: 0.3,
                            ease: "power2.inOut"
                        });
                    };
                }
            });
        } else {
            // Fallback without GSAP
            this.timelapseImage.style.transition = 'opacity 0.3s ease';
            this.timelapseImage.style.opacity = '0.3';
            
            setTimeout(() => {
                this.timelapseImage.src = imageSrc;
                this.timelapseImage.onload = () => {
                    this.timelapseImage.style.opacity = '1';
                };
            }, 200);
        }
    }

    updateNotes(notes) {
        if (!this.observationNotes) return;

        // Typewriter effect for notes
        if (window.AnimationController && typeof gsap !== 'undefined') {
            gsap.to(this.observationNotes, {
                opacity: 0,
                y: 10,
                duration: 0.2,
                ease: "power2.inOut",
                onComplete: () => {
                    this.observationNotes.textContent = notes;
                    gsap.fromTo(this.observationNotes, 
                        { opacity: 0, y: 10 },
                        { 
                            opacity: 1, 
                            y: 0, 
                            duration: 0.5, 
                            ease: "power2.out" 
                        }
                    );
                }
            });
        } else {
            // Fallback
            this.observationNotes.style.transition = 'opacity 0.3s ease';
            this.observationNotes.style.opacity = '0';
            
            setTimeout(() => {
                this.observationNotes.textContent = notes;
                this.observationNotes.style.opacity = '1';
            }, 200);
        }
    }

    updateWaterLevelIndicator(waterLevel) {
        // Create or update water level indicator
        let indicator = document.querySelector('.water-level-indicator');
        
        if (!indicator) {
            indicator = this.createWaterLevelIndicator();
        }

        if (indicator) {
            const percentage = ((waterLevel - 20) / (53.4 - 20)) * 100; // Normalize to 0-100%
            const levelBar = indicator.querySelector('.level-bar');
            const levelText = indicator.querySelector('.level-text');
            
            if (levelBar) {
                if (window.AnimationController && typeof gsap !== 'undefined') {
                    gsap.to(levelBar, {
                        height: `${Math.max(0, percentage)}%`,
                        duration: 0.8,
                        ease: "power2.out"
                    });
                } else {
                    levelBar.style.transition = 'height 0.8s ease';
                    levelBar.style.height = `${Math.max(0, percentage)}%`;
                }
            }
            
            if (levelText) {
                levelText.textContent = `${waterLevel}m above sea level`;
            }
        }
    }

    createWaterLevelIndicator() {
        const container = document.querySelector('.timelapse-viewer');
        if (!container) return null;

        const indicator = document.createElement('div');
        indicator.className = 'water-level-indicator';
        indicator.innerHTML = `
            <div class="indicator-header">
                <h4>Water Level</h4>
            </div>
            <div class="level-container">
                <div class="level-background">
                    <div class="level-bar"></div>
                </div>
                <div class="level-markers">
                    <span class="marker high">53.4m (1990)</span>
                    <span class="marker low">20.1m (2025)</span>
                </div>
            </div>
            <div class="level-text">53.4m above sea level</div>
        `;

        indicator.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(22, 33, 62, 0.9);
            border-radius: 10px;
            padding: 1rem;
            border: 1px solid rgba(243, 156, 18, 0.3);
            min-width: 150px;
            backdrop-filter: blur(10px);
        `;

        // Style the components
        const header = indicator.querySelector('.indicator-header h4');
        if (header) {
            header.style.cssText = `
                color: var(--gold-color);
                margin: 0 0 1rem 0;
                font-size: 1rem;
                text-align: center;
            `;
        }

        const levelContainer = indicator.querySelector('.level-container');
        if (levelContainer) {
            levelContainer.style.cssText = `
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 0.5rem;
            `;
        }

        const levelBackground = indicator.querySelector('.level-background');
        if (levelBackground) {
            levelBackground.style.cssText = `
                width: 20px;
                height: 100px;
                background: rgba(26, 26, 46, 0.7);
                border-radius: 10px;
                position: relative;
                border: 1px solid rgba(243, 156, 18, 0.3);
                overflow: hidden;
            `;
        }

        const levelBar = indicator.querySelector('.level-bar');
        if (levelBar) {
            levelBar.style.cssText = `
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(to top, #3498db, #5dade2);
                border-radius: 0 0 10px 10px;
                transition: height 0.8s ease;
            `;
        }

        const markers = indicator.querySelector('.level-markers');
        if (markers) {
            markers.style.cssText = `
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                height: 100px;
                font-size: 0.7rem;
                color: var(--text-light);
            `;
        }

        const levelText = indicator.querySelector('.level-text');
        if (levelText) {
            levelText.style.cssText = `
                color: var(--gold-color);
                font-size: 0.9rem;
                text-align: center;
                font-weight: 600;
            `;
        }

        // Make the timelapse images container relative for absolute positioning
        const imagesContainer = container.querySelector('.timelapse-images');
        if (imagesContainer) {
            imagesContainer.style.position = 'relative';
            imagesContainer.appendChild(indicator);
        }

        return indicator;
    }

    updatePlayButton() {
        if (!this.playButton) return;

        if (this.isPlaying) {
            this.playButton.innerHTML = '⏸ Pause Timelapse';
            this.playButton.style.background = 'linear-gradient(135deg, var(--accent-color), #c0392b)';
        } else {
            this.playButton.innerHTML = '▶ Play Timelapse';
            this.playButton.style.background = 'linear-gradient(135deg, var(--detective-green), #219a52)';
        }
    }

    addPlaybackEffects() {
        const timelapseContainer = document.querySelector('.timelapse-container');
        if (timelapseContainer) {
            timelapseContainer.classList.add('playing');
            
            // Add pulsing effect to container
            if (window.AnimationController && typeof gsap !== 'undefined') {
                gsap.to(timelapseContainer, {
                    boxShadow: "0 0 30px rgba(39, 174, 96, 0.3)",
                    duration: 1,
                    repeat: -1,
                    yoyo: true,
                    ease: "power2.inOut"
                });
            }
        }
    }

    removePlaybackEffects() {
        const timelapseContainer = document.querySelector('.timelapse-container');
        if (timelapseContainer) {
            timelapseContainer.classList.remove('playing');
            
            // Remove pulsing effect
            if (window.AnimationController && typeof gsap !== 'undefined') {
                gsap.killTweensOf(timelapseContainer);
                gsap.set(timelapseContainer, { boxShadow: "none" });
            }
        }
    }

    triggerDetectiveClues(year, data) {
        if (!window.DetectiveController) return;

        // Add year-specific clues
        const clues = {
            1990: "The Aral Sea was thriving with a vibrant fishing industry",
            1995: "First signs of irrigation impact become visible from space",
            2000: "The sea splits into two separate bodies - a critical turning point",
            2005: "Ships become stranded as water levels drop dramatically",
            2010: "The exposed seabed creates salt storms affecting the region",
            2015: "Fishing communities are forced to abandon their traditional livelihoods",
            2020: "Climate change accelerates the remaining water loss",
            2025: "Less than 10% of the original sea remains"
        };

        if (clues[year]) {
            window.DetectiveController.addClue(`${year}: ${clues[year]}`);
        }
    }

    // Speed controls
    setPlaySpeed(speed) {
        this.playSpeed = speed;
        
        if (this.isPlaying) {
            this.pausePlayback();
            this.startPlayback();
        }
    }

    // Jump to specific events
    jumpToEvent(eventName) {
        const events = {
            'start': 1990,
            'first_split': 2000,
            'eastern_dry': 2010,
            'current': 2025
        };

        if (events[eventName]) {
            this.setYear(events[eventName]);
        }
    }

    // Export functionality
    exportTimelapse() {
        const timelapseData = {
            currentYear: this.currentYear,
            totalYears: Object.keys(this.timelapseData).length,
            data: this.timelapseData
        };

        const blob = new Blob([JSON.stringify(timelapseData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aral_sea_timelapse_data.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Reset to beginning
    reset() {
        this.pausePlayback();
        this.setYear(1990);
    }

    // Public API
    getCurrentYear() {
        return this.currentYear;
    }

    getAvailableYears() {
        return Object.keys(this.timelapseData).map(y => parseInt(y)).sort((a, b) => a - b);
    }

    isCurrentlyPlaying() {
        return this.isPlaying;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.TimelapseController = new TimelapseController();
});

// Add custom CSS for timelapse effects
const timelapseStyles = document.createElement('style');
timelapseStyles.textContent = `
    .timelapse-container.playing {
        border: 2px solid var(--detective-green);
        animation: pulse-glow 2s ease-in-out infinite;
    }
    
    @keyframes pulse-glow {
        0% { box-shadow: 0 0 5px rgba(39, 174, 96, 0.3); }
        50% { box-shadow: 0 0 20px rgba(39, 174, 96, 0.6); }
        100% { box-shadow: 0 0 5px rgba(39, 174, 96, 0.3); }
    }
    
    .water-level-indicator {
        transition: all 0.3s ease;
    }
    
    .water-level-indicator:hover {
        transform: scale(1.05);
    }
    
    .level-bar {
        position: relative;
        overflow: hidden;
    }
    
    .level-bar::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
        animation: water-shimmer 2s ease-in-out infinite;
    }
    
    @keyframes water-shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    @media (max-width: 768px) {
        .water-level-indicator {
            position: static;
            margin-top: 1rem;
            width: 100%;
        }
        
        .level-container {
            justify-content: center;
        }
    }
`;
document.head.appendChild(timelapseStyles);