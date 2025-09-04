// Detective Theme Controller
class DetectiveController {
    constructor() {
        this.caseFileData = this.initializeCaseData();
        this.investigationProgress = 0;
        this.cluesDiscovered = [];
        this.evidenceExamined = [];
        
        this.init();
    }

    init() {
        this.setupDetectiveTheme();
        this.initializeCaseFile();
        this.setupEvidenceInteractions();
        this.setupCluesTooltips();
    }

    initializeCaseData() {
        return {
            caseNumber: "ENV-001-ARAL",
            openDate: "1990-01-01",
            lastUpdate: "2025-09-04",
            status: "Active Investigation",
            primaryLocation: "Central Asia (Kazakhstan, Uzbekistan)",
            suspects: [
                "Intensive Cotton Cultivation",
                "Poor Water Management",
                "Climate Change",
                "Political Decisions"
            ],
            evidence: [
                {
                    id: "SAT-001",
                    type: "Satellite Imagery",
                    description: "NASA Terra satellite images spanning 35 years",
                    significance: "Primary visual evidence of the sea's disappearance",
                    dateCollected: "1990-2025"
                },
                {
                    id: "HYD-002",
                    type: "Hydrological Data",
                    description: "Water level measurements and flow data",
                    significance: "Quantifies the scale of water loss",
                    dateCollected: "1960-2025"
                },
                {
                    id: "AGR-003",
                    type: "Agricultural Records",
                    description: "Cotton production and irrigation data",
                    significance: "Links agricultural expansion to water diversion",
                    dateCollected: "1960-2025"
                },
                {
                    id: "ENV-004",
                    type: "Environmental Impact",
                    description: "Health and ecological consequences",
                    significance: "Documents the human and environmental cost",
                    dateCollected: "1990-2025"
                }
            ],
            timeline: [
                { year: 1960, event: "Major irrigation projects begin", impact: "Low" },
                { year: 1970, event: "Cotton cultivation expansion", impact: "Medium" },
                { year: 1980, event: "First signs of sea level decline", impact: "Medium" },
                { year: 1990, event: "Dramatic shrinkage becomes visible", impact: "High" },
                { year: 2000, event: "Sea splits into two bodies", impact: "Critical" },
                { year: 2010, event: "Eastern basin completely dries", impact: "Critical" },
                { year: 2020, event: "Only 10% of original sea remains", impact: "Catastrophic" },
                { year: 2025, event: "Current investigation status", impact: "Ongoing" }
            ]
        };
    }

    setupDetectiveTheme() {
        // Add detective UI elements
        this.createInvestigationMenu();
        this.setupCaseNotes();
        this.initializeEvidenceBoard();
    }

    createInvestigationMenu() {
        const existingMenu = document.querySelector('.investigation-menu');
        if (existingMenu) return;

        const menu = document.createElement('div');
        menu.className = 'investigation-menu';
        menu.innerHTML = `
            <div class="menu-toggle" id="investigation-toggle">
                <span class="menu-icon">🔍</span>
                <span class="menu-text">Case Files</span>
            </div>
            <div class="menu-content" id="investigation-content">
                <div class="case-header">
                    <h3>Case #${this.caseFileData.caseNumber}</h3>
                    <p>Status: ${this.caseFileData.status}</p>
                </div>
                <div class="clues-section">
                    <h4>Clues Discovered</h4>
                    <div class="clues-list" id="clues-list">
                        <p class="no-clues">No clues discovered yet...</p>
                    </div>
                </div>
                <div class="evidence-section">
                    <h4>Evidence Examined</h4>
                    <div class="evidence-list" id="evidence-list">
                        <p class="no-evidence">No evidence examined yet...</p>
                    </div>
                </div>
            </div>
        `;

        // Style the menu
        menu.style.cssText = `
            position: fixed;
            top: 80px;
            left: 20px;
            z-index: 1000;
            background: rgba(22, 33, 62, 0.95);
            border-radius: 15px;
            border: 1px solid rgba(243, 156, 18, 0.3);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
            max-width: 300px;
        `;

        document.body.appendChild(menu);

        // Setup menu interactions
        this.setupInvestigationMenuInteractions();
    }

    setupInvestigationMenuInteractions() {
        const toggle = document.getElementById('investigation-toggle');
        const content = document.getElementById('investigation-content');
        let isOpen = false;

        toggle.style.cssText = `
            padding: 1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: var(--gold-color);
            font-weight: 600;
        `;

        content.style.cssText = `
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease;
            padding: 0 1rem;
        `;

        toggle.addEventListener('click', () => {
            isOpen = !isOpen;
            if (isOpen) {
                content.style.maxHeight = '400px';
                content.style.padding = '1rem';
            } else {
                content.style.maxHeight = '0';
                content.style.padding = '0 1rem';
            }
        });
    }

    setupCaseNotes() {
        // Create floating case notes that appear based on investigation progress
        this.createFloatingNotes();
    }

    createFloatingNotes() {
        const notes = [
            { 
                trigger: 20, 
                text: "Note: The cotton industry was heavily promoted by the Soviet government in the 1960s.",
                position: { top: '30%', right: '20px' }
            },
            { 
                trigger: 40, 
                text: "Observation: The Amu Darya and Syr Darya rivers were diverted for irrigation.",
                position: { top: '50%', left: '20px' }
            },
            { 
                trigger: 60, 
                text: "Evidence: Satellite data shows 90% volume loss over 35 years.",
                position: { bottom: '30%', right: '20px' }
            },
            { 
                trigger: 80, 
                text: "Conclusion: Human activities were the primary cause of the disaster.",
                position: { bottom: '20%', left: '50%' }
            }
        ];

        window.addEventListener('scroll', () => {
            const progress = window.AralSeaApp ? window.AralSeaApp.getProgressPercentage() : 0;
            
            notes.forEach((note, index) => {
                if (progress >= note.trigger && !note.shown) {
                    this.showFloatingNote(note, index);
                    note.shown = true;
                }
            });
        });
    }

    showFloatingNote(note, index) {
        const noteElement = document.createElement('div');
        noteElement.className = `floating-note note-${index}`;
        noteElement.innerHTML = `
            <div class="note-content">
                <span class="note-close">&times;</span>
                <p>${note.text}</p>
            </div>
        `;

        noteElement.style.cssText = `
            position: fixed;
            ${Object.entries(note.position).map(([key, value]) => `${key}: ${value}`).join('; ')};
            background: rgba(233, 69, 96, 0.9);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 250px;
            z-index: 1001;
            animation: slideInRight 0.5s ease-out;
            backdrop-filter: blur(10px);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(noteElement);

        // Auto-remove after 8 seconds
        setTimeout(() => {
            if (noteElement.parentNode) {
                noteElement.style.animation = 'fadeOut 0.5s ease-out forwards';
                setTimeout(() => {
                    if (noteElement.parentNode) {
                        document.body.removeChild(noteElement);
                    }
                }, 500);
            }
        }, 8000);

        // Manual close
        const closeBtn = noteElement.querySelector('.note-close');
        closeBtn.addEventListener('click', () => {
            noteElement.style.animation = 'fadeOut 0.3s ease-out forwards';
            setTimeout(() => {
                if (noteElement.parentNode) {
                    document.body.removeChild(noteElement);
                }
            }, 300);
        });
    }

    initializeEvidenceBoard() {
        // Track evidence interactions
        document.addEventListener('click', (e) => {
            if (e.target.closest('.evidence-item')) {
                const evidenceItem = e.target.closest('.evidence-item');
                const evidenceType = evidenceItem.dataset.evidence;
                this.examineEvidence(evidenceType, evidenceItem);
            }
        });
    }

    examineEvidence(type, element) {
        if (this.evidenceExamined.includes(type)) return;

        this.evidenceExamined.push(type);
        
        // Add examined class
        element.classList.add('evidence-examined');
        
        // Update evidence list in menu
        this.updateEvidenceList();
        
        // Show examination result
        this.showEvidenceExamination(type);
        
        // Add to investigation progress
        this.addClue(`Examined evidence: ${type}`);
    }

    showEvidenceExamination(type) {
        const evidence = this.caseFileData.evidence.find(e => 
            e.type.toLowerCase().includes(type) || 
            e.id.toLowerCase().includes(type)
        );

        if (!evidence) return;

        // Create examination modal
        const modal = document.createElement('div');
        modal.className = 'evidence-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>Evidence Examination</h3>
                    <span class="modal-close">&times;</span>
                </div>
                <div class="modal-body">
                    <div class="evidence-details">
                        <h4>Evidence ID: ${evidence.id}</h4>
                        <p><strong>Type:</strong> ${evidence.type}</p>
                        <p><strong>Description:</strong> ${evidence.description}</p>
                        <p><strong>Significance:</strong> ${evidence.significance}</p>
                        <p><strong>Date Collected:</strong> ${evidence.dateCollected}</p>
                    </div>
                    <div class="examination-notes">
                        <h4>Examination Notes:</h4>
                        <textarea placeholder="Add your investigation notes..." id="evidence-notes"></textarea>
                        <button class="save-notes-btn">Save Notes</button>
                    </div>
                </div>
            </div>
        `;

        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s ease-out;
        `;

        const modalContent = modal.querySelector('.modal-content');
        modalContent.style.cssText = `
            background: var(--gradient-detective);
            border-radius: 15px;
            padding: 2rem;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            border: 1px solid var(--gold-color);
            color: var(--text-light);
            animation: scaleIn 0.3s ease-out;
        `;

        document.body.appendChild(modal);

        // Setup modal interactions
        const closeBtn = modal.querySelector('.modal-close');
        const saveBtn = modal.querySelector('.save-notes-btn');

        closeBtn.addEventListener('click', () => this.closeModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeModal(modal);
        });

        saveBtn.addEventListener('click', () => {
            const notes = modal.querySelector('#evidence-notes').value;
            if (notes.trim()) {
                this.addClue(`Notes on ${evidence.type}: ${notes.trim()}`);
                this.closeModal(modal);
            }
        });
    }

    closeModal(modal) {
        modal.style.animation = 'fadeOut 0.3s ease-out forwards';
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
        }, 300);
    }

    addClue(clueText) {
        if (this.cluesDiscovered.includes(clueText)) return;

        this.cluesDiscovered.push(clueText);
        this.updateCluesList();
        
        // Show clue notification
        this.showClueNotification(clueText);
    }

    showClueNotification(clueText) {
        const notification = document.createElement('div');
        notification.className = 'clue-notification';
        notification.innerHTML = `
            <div class="clue-icon">🔍</div>
            <div class="clue-text">
                <strong>New Clue Discovered!</strong>
                <p>${clueText}</p>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--detective-green), #219a52);
            color: white;
            padding: 1rem;
            border-radius: 10px;
            z-index: 10001;
            max-width: 300px;
            display: flex;
            align-items: center;
            gap: 1rem;
            animation: slideInRight 0.5s ease-out;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.5s ease-out forwards';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }

    updateCluesList() {
        const cluesList = document.getElementById('clues-list');
        if (!cluesList) return;

        if (this.cluesDiscovered.length === 0) {
            cluesList.innerHTML = '<p class="no-clues">No clues discovered yet...</p>';
        } else {
            cluesList.innerHTML = this.cluesDiscovered.map((clue, index) => `
                <div class="clue-item">
                    <span class="clue-number">${index + 1}.</span>
                    <span class="clue-content">${clue}</span>
                </div>
            `).join('');
        }
    }

    updateEvidenceList() {
        const evidenceList = document.getElementById('evidence-list');
        if (!evidenceList) return;

        if (this.evidenceExamined.length === 0) {
            evidenceList.innerHTML = '<p class="no-evidence">No evidence examined yet...</p>';
        } else {
            evidenceList.innerHTML = this.evidenceExamined.map((evidence, index) => `
                <div class="evidence-item-small">
                    <span class="evidence-number">${index + 1}.</span>
                    <span class="evidence-content">${evidence}</span>
                </div>
            `).join('');
        }
    }

    setupCluesTooltips() {
        // Add tooltips to various elements that contain clues
        const tooltipElements = document.querySelectorAll('[data-clue]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, e.target.dataset.clue);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
    }

    showTooltip(element, text) {
        const tooltip = document.createElement('div');
        tooltip.className = 'detective-tooltip';
        tooltip.textContent = text;
        
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(26, 26, 46, 0.95);
            color: var(--gold-color);
            padding: 0.5rem 1rem;
            border-radius: 5px;
            font-size: 0.9rem;
            z-index: 10002;
            border: 1px solid rgba(243, 156, 18, 0.3);
            max-width: 200px;
            word-wrap: break-word;
            animation: fadeIn 0.2s ease-out;
        `;

        document.body.appendChild(tooltip);
        this.currentTooltip = tooltip;

        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    }

    hideTooltip() {
        if (this.currentTooltip) {
            this.currentTooltip.style.animation = 'fadeOut 0.2s ease-out forwards';
            setTimeout(() => {
                if (this.currentTooltip && this.currentTooltip.parentNode) {
                    document.body.removeChild(this.currentTooltip);
                }
                this.currentTooltip = null;
            }, 200);
        }
    }

    // Public methods for external access
    getInvestigationProgress() {
        return {
            cluesDiscovered: this.cluesDiscovered.length,
            evidenceExamined: this.evidenceExamined.length,
            totalEvidence: this.caseFileData.evidence.length,
            progressPercentage: (this.evidenceExamined.length / this.caseFileData.evidence.length) * 100
        };
    }

    getCaseData() {
        return this.caseFileData;
    }

    reset() {
        this.cluesDiscovered = [];
        this.evidenceExamined = [];
        this.updateCluesList();
        this.updateEvidenceList();
        
        // Remove examined classes
        document.querySelectorAll('.evidence-examined').forEach(el => {
            el.classList.remove('evidence-examined');
        });
    }
}

// Initialize Detective Controller
document.addEventListener('DOMContentLoaded', () => {
    window.DetectiveController = new DetectiveController();
});

// Add CSS for detective elements
const detectiveStyles = document.createElement('style');
detectiveStyles.textContent = `
    .evidence-examined {
        border-color: var(--detective-green) !important;
        box-shadow: 0 0 20px rgba(39, 174, 96, 0.3) !important;
    }
    
    .evidence-examined::after {
        content: '✓';
        position: absolute;
        top: 10px;
        right: 10px;
        background: var(--detective-green);
        color: white;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-size: 0.9rem;
    }
    
    .clue-item, .evidence-item-small {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
        background: rgba(26, 26, 46, 0.5);
        border-radius: 5px;
        border-left: 3px solid var(--gold-color);
        font-size: 0.9rem;
    }
    
    .clue-number, .evidence-number {
        color: var(--gold-color);
        font-weight: bold;
        margin-right: 0.5rem;
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(detectiveStyles);