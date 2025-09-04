// What-If Simulator Controller
class SimulatorController {
    constructor() {
        this.currentScenario = {
            irrigationEfficiency: 45,
            cottonArea: 80,
            waterPolicy: 'none'
        };
        this.baselineData = this.initializeBaselineData();
        this.isInitialized = false;
        
        this.bindElements();
    }

    bindElements() {
        this.irrigationSlider = document.getElementById('irrigation-efficiency');
        this.cottonSlider = document.getElementById('cotton-area');
        this.waterPolicySelect = document.getElementById('water-policy');
        this.runButton = document.getElementById('run-simulation');
        this.seaLevelVisualization = document.querySelector('.sea-level-visualization');
        this.feedbackElement = document.getElementById('simulation-feedback');
    }

    initializeBaselineData() {
        return {
            historicalSeaLevel: 53.4, // 1990 level
            currentSeaLevel: 20.1,    // 2025 level
            waterDiversion: {
                agriculture: 92,
                industry: 4,
                domestic: 3,
                other: 1
            },
            irrigationEfficiencyFactors: {
                30: 1.5,  // Very inefficient - 50% more water waste
                45: 1.0,  // Current efficiency (baseline)
                60: 0.7,  // Improved efficiency
                75: 0.5,  // High efficiency
                90: 0.3   // Very high efficiency
            },
            cottonWaterConsumption: 2700, // liters per kg of cotton
            policyImpacts: {
                'none': 1.0,
                'moderate': 0.75,
                'strict': 0.5
            }
        };
    }

    initialize() {
        this.setupEventListeners();
        this.updateDisplayValues();
        this.runInitialSimulation();
        this.isInitialized = true;
    }

    setupEventListeners() {
        if (this.irrigationSlider) {
            this.irrigationSlider.addEventListener('input', (e) => {
                this.currentScenario.irrigationEfficiency = parseInt(e.target.value);
                this.updateDisplayValue('irrigation-efficiency');
            });
        }

        if (this.cottonSlider) {
            this.cottonSlider.addEventListener('input', (e) => {
                this.currentScenario.cottonArea = parseInt(e.target.value);
                this.updateDisplayValue('cotton-area');
            });
        }

        if (this.waterPolicySelect) {
            this.waterPolicySelect.addEventListener('change', (e) => {
                this.currentScenario.waterPolicy = e.target.value;
            });
        }

        if (this.runButton) {
            this.runButton.addEventListener('click', () => {
                this.runSimulation();
            });
        }

        // Real-time updates
        document.addEventListener('input', (e) => {
            if (e.target.matches('#irrigation-efficiency, #cotton-area')) {
                this.debounceSimulation();
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.isSimulatorActive()) {
                switch (e.key) {
                    case 'Enter':
                        this.runSimulation();
                        break;
                    case 'Escape':
                        this.resetToDefaults();
                        break;
                }
            }
        });
    }

    isSimulatorActive() {
        const simulatorSection = document.querySelector('[data-chapter="6"]');
        return simulatorSection && simulatorSection.classList.contains('active');
    }

    updateDisplayValues() {
        this.updateDisplayValue('irrigation-efficiency');
        this.updateDisplayValue('cotton-area');
    }

    updateDisplayValue(sliderId) {
        const slider = document.getElementById(sliderId);
        const display = slider.parentElement.querySelector('.value-display');
        
        if (slider && display) {
            let value = slider.value;
            let unit = sliderId === 'irrigation-efficiency' ? '%' : '%';
            display.textContent = value + unit;
        }
    }

    runInitialSimulation() {
        // Run simulation with current default values
        this.calculateScenario(this.currentScenario);
    }

    debounceSimulation() {
        clearTimeout(this.debounceTimer);
        this.debounceTimer = setTimeout(() => {
            this.runSimulation();
        }, 500);
    }

    runSimulation() {
        // Add visual feedback
        this.showSimulationRunning();
        
        // Calculate scenario
        const results = this.calculateScenario(this.currentScenario);
        
        // Update visualization
        setTimeout(() => {
            this.updateVisualization(results);
            this.updateFeedback(results);
            this.hideSimulationRunning();
            
            // Add detective clue
            if (window.DetectiveController) {
                window.DetectiveController.addClue(
                    `Simulation run: ${results.seaLevelChange > 0 ? 'Improved' : 'Worsened'} sea level by ${Math.abs(results.seaLevelChange).toFixed(1)}m`
                );
            }
        }, 1000);
    }

    calculateScenario(scenario) {
        // Base water consumption calculation
        let waterConsumption = 100; // Base percentage
        
        // Irrigation efficiency impact
        const efficiencyFactor = this.baselineData.irrigationEfficiencyFactors[scenario.irrigationEfficiency] || 1.0;
        waterConsumption *= efficiencyFactor;
        
        // Cotton cultivation area impact
        const cottonFactor = scenario.cottonArea / 80; // 80% is baseline
        waterConsumption *= cottonFactor;
        
        // Water policy impact
        const policyFactor = this.baselineData.policyImpacts[scenario.waterPolicy] || 1.0;
        waterConsumption *= policyFactor;
        
        // Calculate projected sea level
        const waterSaved = 100 - waterConsumption;
        const seaLevelImprovement = (waterSaved / 100) * (this.baselineData.historicalSeaLevel - this.baselineData.currentSeaLevel);
        const projectedSeaLevel = this.baselineData.currentSeaLevel + seaLevelImprovement;
        
        // Calculate other impacts
        const economicImpact = this.calculateEconomicImpact(scenario, waterConsumption);
        const environmentalImpact = this.calculateEnvironmentalImpact(projectedSeaLevel);
        const socialImpact = this.calculateSocialImpact(scenario, projectedSeaLevel);
        
        return {
            projectedSeaLevel: Math.max(20.1, Math.min(53.4, projectedSeaLevel)),
            seaLevelChange: projectedSeaLevel - this.baselineData.currentSeaLevel,
            waterConsumption: waterConsumption,
            waterSaved: Math.max(0, waterSaved),
            economicImpact,
            environmentalImpact,
            socialImpact,
            scenario: { ...scenario }
        };
    }

    calculateEconomicImpact(scenario, waterConsumption) {
        // Economic factors
        let agricultureCost = scenario.cottonArea * 0.8; // Cost per % of cotton area
        let efficiencyInvestment = (scenario.irrigationEfficiency - 45) * 2; // Investment in efficiency
        let policyCost = scenario.waterPolicy === 'strict' ? 50 : scenario.waterPolicy === 'moderate' ? 20 : 0;
        
        // Benefits from water conservation
        let waterSavingsBenefit = (100 - waterConsumption) * 1.5;
        
        let totalCost = agricultureCost + efficiencyInvestment + policyCost;
        let netBenefit = waterSavingsBenefit - totalCost;
        
        return {
            totalCost: Math.max(0, totalCost),
            totalBenefit: Math.max(0, waterSavingsBenefit),
            netImpact: netBenefit,
            description: netBenefit > 0 ? 'Net Economic Benefit' : 'Net Economic Cost'
        };
    }

    calculateEnvironmentalImpact(projectedSeaLevel) {
        const seaLevelImprovement = projectedSeaLevel - this.baselineData.currentSeaLevel;
        
        let biodiversityScore = Math.min(100, 20 + (seaLevelImprovement / 33.3) * 80);
        let saltStormReduction = Math.min(100, (seaLevelImprovement / 33.3) * 100);
        let climateStability = Math.min(100, 30 + (seaLevelImprovement / 33.3) * 70);
        
        return {
            biodiversityScore: Math.max(0, biodiversityScore),
            saltStormReduction: Math.max(0, saltStormReduction),
            climateStability: Math.max(0, climateStability),
            overallScore: Math.max(0, (biodiversityScore + saltStormReduction + climateStability) / 3)
        };
    }

    calculateSocialImpact(scenario, projectedSeaLevel) {
        const seaLevelImprovement = projectedSeaLevel - this.baselineData.currentSeaLevel;
        
        // Job impacts from cotton reduction
        let jobLoss = (80 - scenario.cottonArea) * 500; // Jobs lost per % reduction
        let newJobs = scenario.irrigationEfficiency > 45 ? (scenario.irrigationEfficiency - 45) * 100 : 0;
        
        // Health improvements
        let healthImprovement = Math.min(100, (seaLevelImprovement / 33.3) * 100);
        
        // Community displacement reduction
        let displacementReduction = Math.min(100, (seaLevelImprovement / 33.3) * 100);
        
        return {
            jobsLost: Math.max(0, jobLoss),
            jobsCreated: Math.max(0, newJobs),
            netJobs: newJobs - jobLoss,
            healthImprovement: Math.max(0, healthImprovement),
            displacementReduction: Math.max(0, displacementReduction),
            overallScore: Math.max(0, ((newJobs - jobLoss) / 1000 * 50) + healthImprovement/2 + displacementReduction/2)
        };
    }

    updateVisualization(results) {
        const currentLevel = document.querySelector('.current-level');
        const projectedLevel = document.querySelector('.projected-level');
        
        if (currentLevel && projectedLevel) {
            // Update heights based on water levels
            const currentHeight = ((this.baselineData.currentSeaLevel - 20) / (53.4 - 20)) * 100;
            const projectedHeight = ((results.projectedSeaLevel - 20) / (53.4 - 20)) * 100;
            
            // Animate the changes
            if (window.AnimationController && typeof gsap !== 'undefined') {
                gsap.to(currentLevel, {
                    height: `${Math.max(5, currentHeight)}%`,
                    duration: 1,
                    ease: "power2.out"
                });
                
                gsap.to(projectedLevel, {
                    height: `${Math.max(5, projectedHeight)}%`,
                    duration: 1.5,
                    delay: 0.5,
                    ease: "power2.out",
                    onComplete: () => {
                        this.showLevelComparison(results);
                    }
                });
            } else {
                currentLevel.style.height = `${Math.max(5, currentHeight)}%`;
                projectedLevel.style.height = `${Math.max(5, projectedHeight)}%`;
                this.showLevelComparison(results);
            }
        }
        
        // Update level labels
        this.updateLevelLabels(results);
    }

    updateLevelLabels(results) {
        const labels = document.querySelector('.level-labels');
        if (labels) {
            labels.innerHTML = `
                <span>1990: 53.4m</span>
                <span>2025: 20.1m</span>
                <span>Your Scenario: ${results.projectedSeaLevel.toFixed(1)}m</span>
            `;
        }
    }

    showLevelComparison(results) {
        // Create comparison indicators
        const container = document.querySelector('.sea-level-visualization');
        if (!container) return;
        
        let indicator = container.querySelector('.level-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.className = 'level-indicator';
            container.appendChild(indicator);
        }
        
        const change = results.seaLevelChange;
        const changeText = change > 0 ? `+${change.toFixed(1)}m improvement` : `${change.toFixed(1)}m decline`;
        const changeColor = change > 0 ? '#27ae60' : '#e74c3c';
        
        indicator.innerHTML = `
            <div class="indicator-text" style="color: ${changeColor}; font-weight: bold;">
                ${changeText}
            </div>
            <div class="percentage-text">
                ${((results.projectedSeaLevel / this.baselineData.historicalSeaLevel) * 100).toFixed(1)}% of original size
            </div>
        `;
        
        indicator.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: rgba(22, 33, 62, 0.9);
            padding: 0.8rem;
            border-radius: 8px;
            border: 1px solid ${changeColor};
            color: var(--text-light);
            font-size: 0.9rem;
            text-align: center;
            backdrop-filter: blur(10px);
        `;
    }

    updateFeedback(results) {
        if (!this.feedbackElement) return;
        
        let feedback = this.generateFeedbackText(results);
        
        // Animate text change
        if (window.AnimationController && typeof gsap !== 'undefined') {
            gsap.to(this.feedbackElement, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    this.feedbackElement.innerHTML = feedback;
                    gsap.to(this.feedbackElement, {
                        opacity: 1,
                        duration: 0.5
                    });
                }
            });
        } else {
            this.feedbackElement.innerHTML = feedback;
        }
    }

    generateFeedbackText(results) {
        const scenario = results.scenario;
        let feedback = '';
        
        // Main impact assessment
        if (results.seaLevelChange > 10) {
            feedback += '<strong>Excellent Result!</strong> Your scenario could significantly restore the Aral Sea. ';
        } else if (results.seaLevelChange > 5) {
            feedback += '<strong>Good Progress!</strong> This scenario shows meaningful improvement. ';
        } else if (results.seaLevelChange > 0) {
            feedback += '<strong>Minor Improvement.</strong> Small steps in the right direction. ';
        } else {
            feedback += '<strong>No Improvement.</strong> This scenario maintains current decline. ';
        }
        
        // Specific recommendations
        feedback += '<br><br><strong>Analysis:</strong><br>';
        
        if (scenario.irrigationEfficiency < 60) {
            feedback += '• Consider improving irrigation efficiency to reduce water waste.<br>';
        }
        
        if (scenario.cottonArea > 60) {
            feedback += '• Reducing cotton cultivation area could significantly help water conservation.<br>';
        }
        
        if (scenario.waterPolicy === 'none') {
            feedback += '• Implementing water conservation policies would have major benefits.<br>';
        }
        
        // Economic and social notes
        if (results.economicImpact.netImpact < 0) {
            feedback += '• <span style="color: #e74c3c;">Economic costs are high, but environmental benefits may justify investment.</span><br>';
        }
        
        if (results.socialImpact.netJobs < 0) {
            feedback += '• <span style="color: #f39c12;">Job losses in agriculture could be offset by new green economy opportunities.</span><br>';
        }
        
        // Best case scenario hint
        feedback += '<br><strong>Tip:</strong> Try combining high irrigation efficiency (75%+), reduced cotton area (40% or less), and strict water policies for maximum impact!';
        
        return feedback;
    }

    showSimulationRunning() {
        if (this.runButton) {
            this.runButton.disabled = true;
            this.runButton.innerHTML = '⏳ Running Simulation...';
            this.runButton.style.background = 'linear-gradient(135deg, #95a5a6, #7f8c8d)';
        }
        
        // Add loading animation
        const visualization = document.querySelector('.sea-level-visualization');
        if (visualization) {
            visualization.style.filter = 'blur(2px)';
            visualization.style.opacity = '0.7';
        }
    }

    hideSimulationRunning() {
        if (this.runButton) {
            this.runButton.disabled = false;
            this.runButton.innerHTML = '🔄 Run Simulation';
            this.runButton.style.background = 'linear-gradient(135deg, var(--detective-green), #219a52)';
        }
        
        // Remove loading animation
        const visualization = document.querySelector('.sea-level-visualization');
        if (visualization) {
            visualization.style.filter = 'none';
            visualization.style.opacity = '1';
        }
    }

    // Preset scenarios
    loadPreset(presetName) {
        const presets = {
            'current': {
                irrigationEfficiency: 45,
                cottonArea: 80,
                waterPolicy: 'none'
            },
            'moderate': {
                irrigationEfficiency: 65,
                cottonArea: 60,
                waterPolicy: 'moderate'
            },
            'aggressive': {
                irrigationEfficiency: 85,
                cottonArea: 30,
                waterPolicy: 'strict'
            },
            'economic': {
                irrigationEfficiency: 55,
                cottonArea: 70,
                waterPolicy: 'moderate'
            }
        };
        
        const preset = presets[presetName];
        if (preset) {
            this.currentScenario = { ...preset };
            this.updateSlidersToScenario();
            this.runSimulation();
        }
    }

    updateSlidersToScenario() {
        if (this.irrigationSlider) {
            this.irrigationSlider.value = this.currentScenario.irrigationEfficiency;
            this.updateDisplayValue('irrigation-efficiency');
        }
        
        if (this.cottonSlider) {
            this.cottonSlider.value = this.currentScenario.cottonArea;
            this.updateDisplayValue('cotton-area');
        }
        
        if (this.waterPolicySelect) {
            this.waterPolicySelect.value = this.currentScenario.waterPolicy;
        }
    }

    resetToDefaults() {
        this.loadPreset('current');
    }

    // Export simulation results
    exportResults() {
        const results = this.calculateScenario(this.currentScenario);
        
        const exportData = {
            scenario: this.currentScenario,
            results: results,
            timestamp: new Date().toISOString(),
            baseline: this.baselineData
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'aral_sea_simulation_results.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Add preset buttons dynamically
    createPresetButtons() {
        const controlsContainer = document.querySelector('.scenario-controls');
        if (!controlsContainer) return;
        
        const presetsDiv = document.createElement('div');
        presetsDiv.className = 'preset-scenarios';
        presetsDiv.innerHTML = `
            <h4>Quick Scenarios</h4>
            <div class="preset-buttons">
                <button class="preset-btn" onclick="window.SimulatorController.loadPreset('current')">Current Trend</button>
                <button class="preset-btn" onclick="window.SimulatorController.loadPreset('moderate')">Moderate Reform</button>
                <button class="preset-btn" onclick="window.SimulatorController.loadPreset('aggressive')">Aggressive Action</button>
                <button class="preset-btn" onclick="window.SimulatorController.loadPreset('economic')">Economic Balance</button>
            </div>
        `;
        
        presetsDiv.style.cssText = `
            margin-top: 2rem;
            padding-top: 2rem;
            border-top: 1px solid rgba(243, 156, 18, 0.3);
        `;
        
        controlsContainer.appendChild(presetsDiv);
    }

    // Public API
    getCurrentScenario() {
        return { ...this.currentScenario };
    }

    getLastResults() {
        return this.lastResults;
    }

    reset() {
        this.resetToDefaults();
    }
}

// Initialize Simulator Controller
document.addEventListener('DOMContentLoaded', () => {
    window.SimulatorController = new SimulatorController();
});

// Add CSS for simulator elements
const simulatorStyles = document.createElement('style');
simulatorStyles.textContent = `
    .level-indicator {
        animation: slideInRight 0.5s ease-out;
    }
    
    .preset-scenarios h4 {
        color: var(--gold-color);
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }
    
    .preset-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 0.8rem;
    }
    
    .preset-btn {
        background: rgba(52, 73, 94, 0.8);
        border: 1px solid rgba(243, 156, 18, 0.5);
        color: var(--text-light);
        padding: 0.8rem;
        border-radius: 8px;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .preset-btn:hover {
        background: rgba(243, 156, 18, 0.2);
        border-color: var(--gold-color);
        transform: translateY(-2px);
    }
    
    .simulation-running {
        position: relative;
        overflow: hidden;
    }
    
    .simulation-running::after {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(39, 174, 96, 0.3), transparent);
        animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
        0% { left: -100%; }
        100% { left: 100%; }
    }
    
    .sea-level-bar {
        position: relative;
        overflow: hidden;
    }
    
    .current-level {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 50%;
        background: linear-gradient(to top, #3498db, #5dade2);
        border-radius: 0 0 0 10px;
        transition: height 1s ease;
    }
    
    .projected-level {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 50%;
        background: linear-gradient(to top, var(--detective-green), #58d68d);
        border-radius: 0 0 10px 0;
        transition: height 1.5s ease;
    }
    
    @media (max-width: 768px) {
        .preset-buttons {
            grid-template-columns: 1fr;
        }
        
        .preset-btn {
            font-size: 0.8rem;
            padding: 0.6rem;
        }
    }
`;
document.head.appendChild(simulatorStyles);