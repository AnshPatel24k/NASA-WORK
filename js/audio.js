// Audio Controller for Immersive Sound Experience
class AudioController {
    constructor() {
        this.audioContext = null;
        this.audioElements = {};
        this.currentAmbient = null;
        this.audioEnabled = true;
        this.masterVolume = 0.7;
        this.isInitialized = false;
        this.fadeDuration = 2000; // 2 seconds for fade transitions
        
        this.audioFiles = {
            waterFlowing: 'audio/water-flowing.mp3',
            desertWind: 'audio/desert-wind.mp3',
            investigationTheme: 'audio/investigation-theme.mp3',
            typing: 'audio/typing.mp3',
            buttonClick: 'audio/button-click.mp3',
            chapterTransition: 'audio/chapter-transition.mp3',
            success: 'audio/success.mp3',
            dramatic: 'audio/dramatic.mp3'
        };
        
        this.chapterAudio = {
            1: { ambient: 'investigationTheme', volume: 0.4 },
            2: { ambient: 'typing', volume: 0.3 },
            3: { ambient: 'waterFlowing', volume: 0.5 },
            4: { ambient: 'waterFlowing', volume: 0.4 },
            5: { ambient: 'typing', volume: 0.3 },
            6: { ambient: 'investigationTheme', volume: 0.4 },
            7: { ambient: 'dramatic', volume: 0.5 }
        };
    }

    initialize() {
        this.createAudioContext();
        this.setupAudioElements();
        this.createFallbackAudio();
        this.setupUserInteractionHandler();
        this.isInitialized = true;
    }

    createAudioContext() {
        try {
            // Create Web Audio API context for advanced audio control
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node for volume control
            this.masterGain = this.audioContext.createGain();
            this.masterGain.connect(this.audioContext.destination);
            this.masterGain.gain.value = this.masterVolume;
            
        } catch (error) {
            console.warn('Web Audio API not supported, falling back to HTML5 audio');
            this.audioContext = null;
        }
    }

    setupAudioElements() {
        // Create audio elements for each sound
        Object.entries(this.audioFiles).forEach(([key, src]) => {
            const audio = document.createElement('audio');
            audio.src = src;
            audio.preload = 'auto';
            audio.loop = key.includes('ambient') || key.includes('theme') || key.includes('flowing') || key.includes('wind');
            
            // Set initial volume
            audio.volume = 0;
            
            // Error handling
            audio.addEventListener('error', () => {
                console.warn(`Failed to load audio: ${src}`);
                this.createSynthesizedAudio(key);
            });
            
            // Loaded event
            audio.addEventListener('loadeddata', () => {
                console.log(`Audio loaded: ${key}`);
            });
            
            this.audioElements[key] = audio;
            document.body.appendChild(audio);
        });
    }

    createFallbackAudio() {
        // Create synthesized audio for when files are not available
        if (!this.audioContext) return;
        
        this.synthAudio = {
            waterFlowing: this.createWaterSound(),
            desertWind: this.createWindSound(),
            investigationTheme: this.createThemeMusic(),
            typing: this.createTypingSound(),
            buttonClick: this.createClickSound(),
            chapterTransition: this.createTransitionSound(),
            success: this.createSuccessSound(),
            dramatic: this.createDramaticSound()
        };
    }

    createWaterSound() {
        if (!this.audioContext) return null;
        
        // Create water-like sound using noise and filters
        const bufferSize = this.audioContext.sampleRate * 2; // 2 seconds
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * 0.1; // Low volume noise
        }
        
        return buffer;
    }

    createWindSound() {
        if (!this.audioContext) return null;
        
        // Create wind-like sound
        const bufferSize = this.audioContext.sampleRate * 3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioContext.sampleRate;
            output[i] = (Math.random() * 2 - 1) * 0.05 * Math.sin(t * 0.5);
        }
        
        return buffer;
    }

    createThemeMusic() {
        if (!this.audioContext) return null;
        
        // Create mysterious theme using oscillators
        const bufferSize = this.audioContext.sampleRate * 4;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        const frequencies = [220, 330, 440, 550]; // A minor chord progression
        
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioContext.sampleRate;
            let sample = 0;
            
            frequencies.forEach((freq, index) => {
                sample += Math.sin(2 * Math.PI * freq * t) * 0.02 * Math.exp(-t * 0.5);
            });
            
            output[i] = sample;
        }
        
        return buffer;
    }

    createTypingSound() {
        if (!this.audioContext) return null;
        
        // Create typing sound
        const bufferSize = this.audioContext.sampleRate * 0.1; // 100ms
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioContext.sampleRate;
            output[i] = (Math.random() * 2 - 1) * 0.3 * Math.exp(-t * 50);
        }
        
        return buffer;
    }

    createClickSound() {
        if (!this.audioContext) return null;
        
        // Create button click sound
        const bufferSize = this.audioContext.sampleRate * 0.05; // 50ms
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioContext.sampleRate;
            output[i] = Math.sin(2 * Math.PI * 800 * t) * 0.3 * Math.exp(-t * 30);
        }
        
        return buffer;
    }

    createTransitionSound() {
        if (!this.audioContext) return null;
        
        // Create transition sound
        const bufferSize = this.audioContext.sampleRate * 1; // 1 second
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioContext.sampleRate;
            const freq = 220 + (t * 440); // Rising frequency
            output[i] = Math.sin(2 * Math.PI * freq * t) * 0.2 * (1 - t);
        }
        
        return buffer;
    }

    createSuccessSound() {
        if (!this.audioContext) return null;
        
        // Create success sound (major chord)
        const bufferSize = this.audioContext.sampleRate * 0.5;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        const frequencies = [261.63, 329.63, 392.00]; // C major chord
        
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioContext.sampleRate;
            let sample = 0;
            
            frequencies.forEach(freq => {
                sample += Math.sin(2 * Math.PI * freq * t) * 0.1;
            });
            
            output[i] = sample * Math.exp(-t * 2);
        }
        
        return buffer;
    }

    createDramaticSound() {
        if (!this.audioContext) return null;
        
        // Create dramatic sound
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const t = i / this.audioContext.sampleRate;
            const freq = 110 - (t * 20); // Descending frequency
            output[i] = Math.sin(2 * Math.PI * freq * t) * 0.3 * Math.sin(t * 4);
        }
        
        return buffer;
    }

    setupUserInteractionHandler() {
        // Web Audio API requires user interaction to start
        const startAudio = () => {
            if (this.audioContext && this.audioContext.state === 'suspended') {
                this.audioContext.resume().then(() => {
                    console.log('Audio context resumed');
                });
            }
            
            // Remove listeners after first interaction
            document.removeEventListener('click', startAudio);
            document.removeEventListener('keydown', startAudio);
        };
        
        document.addEventListener('click', startAudio);
        document.addEventListener('keydown', startAudio);
    }

    // Main audio control methods
    updateForChapter(chapterNumber) {
        if (!this.audioEnabled) return;
        
        const chapterConfig = this.chapterAudio[chapterNumber];
        if (!chapterConfig) return;
        
        this.playChapterTransition();
        
        setTimeout(() => {
            this.setAmbientAudio(chapterConfig.ambient, chapterConfig.volume);
        }, 500);
        
        // Add audio cues based on chapter content
        this.addChapterSpecificAudio(chapterNumber);
    }

    setAmbientAudio(audioKey, volume = 0.5) {
        // Fade out current ambient
        if (this.currentAmbient) {
            this.fadeOut(this.currentAmbient, this.fadeDuration);
        }
        
        // Fade in new ambient
        const audio = this.audioElements[audioKey];
        if (audio) {
            this.currentAmbient = audio;
            this.fadeIn(audio, volume, this.fadeDuration);
        } else if (this.synthAudio && this.synthAudio[audioKey]) {
            this.playSynthAudio(audioKey, volume);
        }
    }

    addChapterSpecificAudio(chapterNumber) {
        switch (chapterNumber) {
            case 1:
                // Investigation theme with typing sounds
                setTimeout(() => this.playSound('typing', 0.3), 2000);
                break;
            case 3:
                // Water sounds that gradually diminish
                this.simulateWaterDiminishing();
                break;
            case 6:
                // Interactive simulation sounds
                this.setupSimulationAudio();
                break;
            case 7:
                // Dramatic conclusion
                setTimeout(() => this.playSound('dramatic', 0.4), 1000);
                break;
        }
    }

    simulateWaterDiminishing() {
        // Gradually reduce water sound volume to simulate disappearing sea
        const audio = this.audioElements.waterFlowing;
        if (!audio) return;
        
        let currentVolume = 0.5;
        const diminishInterval = setInterval(() => {
            currentVolume *= 0.95;
            if (audio.volume > currentVolume) {
                audio.volume = currentVolume;
            }
            
            if (currentVolume < 0.1) {
                clearInterval(diminishInterval);
                this.fadeOut(audio, 1000);
                setTimeout(() => {
                    this.setAmbientAudio('desertWind', 0.3);
                }, 1000);
            }
        }, 1000);
    }

    setupSimulationAudio() {
        // Add audio feedback for simulation interactions
        const runButton = document.getElementById('run-simulation');
        if (runButton) {
            runButton.addEventListener('click', () => {
                this.playSound('buttonClick', 0.5);
                setTimeout(() => {
                    this.playSound('success', 0.4);
                }, 1000);
            });
        }
        
        // Slider audio feedback
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            slider.addEventListener('input', () => {
                this.playTone(200 + (slider.value * 5), 0.1, 50);
            });
        });
    }

    // Audio utility methods
    playSound(audioKey, volume = 0.5) {
        if (!this.audioEnabled) return;
        
        const audio = this.audioElements[audioKey];
        if (audio) {
            audio.volume = volume * this.masterVolume;
            audio.currentTime = 0;
            audio.play().catch(e => console.warn('Audio play failed:', e));
        } else if (this.synthAudio && this.synthAudio[audioKey]) {
            this.playSynthAudio(audioKey, volume);
        }
    }

    playSynthAudio(audioKey, volume = 0.5) {
        if (!this.audioContext || !this.synthAudio[audioKey]) return;
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = this.synthAudio[audioKey];
        gainNode.gain.value = volume * this.masterVolume;
        
        source.connect(gainNode);
        gainNode.connect(this.masterGain || this.audioContext.destination);
        
        source.start();
    }

    playTone(frequency, volume = 0.1, duration = 100) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.value = volume * this.masterVolume;
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration / 1000);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGain || this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    fadeIn(audio, targetVolume, duration) {
        if (!audio) return;
        
        audio.volume = 0;
        audio.play().catch(e => console.warn('Audio play failed:', e));
        
        const startTime = Date.now();
        const fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            audio.volume = progress * targetVolume * this.masterVolume;
            
            if (progress >= 1) {
                clearInterval(fadeInterval);
            }
        }, 16); // ~60fps
    }

    fadeOut(audio, duration) {
        if (!audio) return;
        
        const startVolume = audio.volume;
        const startTime = Date.now();
        
        const fadeInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            audio.volume = startVolume * (1 - progress);
            
            if (progress >= 1) {
                clearInterval(fadeInterval);
                audio.pause();
                audio.currentTime = 0;
            }
        }, 16);
    }

    playChapterTransition() {
        this.playSound('chapterTransition', 0.3);
    }

    // Public control methods
    toggleAudio(enabled = null) {
        if (enabled !== null) {
            this.audioEnabled = enabled;
        } else {
            this.audioEnabled = !this.audioEnabled;
        }
        
        if (!this.audioEnabled) {
            this.stopAllAudio();
        }
        
        return this.audioEnabled;
    }

    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
        
        // Update HTML5 audio elements
        Object.values(this.audioElements).forEach(audio => {
            if (audio.volume > 0) {
                audio.volume = Math.min(audio.volume, this.masterVolume);
            }
        });
    }

    stopAllAudio() {
        Object.values(this.audioElements).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        
        this.currentAmbient = null;
    }

    muteTemporary(duration = 3000) {
        const originalVolume = this.masterVolume;
        this.setMasterVolume(0);
        
        setTimeout(() => {
            this.setMasterVolume(originalVolume);
        }, duration);
    }

    // Audio visualization (optional)
    createAudioVisualizer() {
        if (!this.audioContext) return;
        
        const analyser = this.audioContext.createAnalyser();
        analyser.fftSize = 256;
        
        if (this.masterGain) {
            this.masterGain.connect(analyser);
        }
        
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        
        const visualize = () => {
            analyser.getByteFrequencyData(dataArray);
            
            // Create visual representation of audio
            const audioLevel = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            
            // Update any visual elements based on audio level
            this.updateAudioVisual(audioLevel);
            
            requestAnimationFrame(visualize);
        };
        
        visualize();
    }

    updateAudioVisual(level) {
        // Optional: Update visual elements based on audio level
        const audioIndicator = document.querySelector('.audio-indicator');
        if (audioIndicator) {
            audioIndicator.style.opacity = (level / 255).toString();
        }
    }

    // Cleanup
    destroy() {
        this.stopAllAudio();
        
        if (this.audioContext) {
            this.audioContext.close();
        }
        
        Object.values(this.audioElements).forEach(audio => {
            if (audio.parentNode) {
                audio.parentNode.removeChild(audio);
            }
        });
        
        this.audioElements = {};
        this.isInitialized = false;
    }
}

// Initialize Audio Controller
document.addEventListener('DOMContentLoaded', () => {
    window.AudioController = new AudioController();
});

// Add audio event listeners for UI interactions
document.addEventListener('click', (e) => {
    if (window.AudioController && window.AudioController.audioEnabled) {
        if (e.target.matches('button, .btn, .evidence-item, .chart-container')) {
            window.AudioController.playSound('buttonClick', 0.3);
        }
    }
});

// Add CSS for audio visual elements
const audioStyles = document.createElement('style');
audioStyles.textContent = `
    .audio-indicator {
        position: fixed;
        top: 80px;
        right: 80px;
        width: 20px;
        height: 20px;
        background: linear-gradient(45deg, #27ae60, #2ecc71);
        border-radius: 50%;
        z-index: 1001;
        transition: opacity 0.1s ease;
        pointer-events: none;
    }
    
    .audio-disabled .audio-indicator {
        display: none;
    }
    
    @keyframes audio-pulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .audio-active .audio-indicator {
        animation: audio-pulse 1s ease-in-out infinite;
    }
`;
document.head.appendChild(audioStyles);