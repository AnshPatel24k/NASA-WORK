// Interactive Map Controller using Leaflet.js
class MapController {
    constructor() {
        this.map = null;
        this.layers = {};
        this.currentYear = 1990;
        this.isInitialized = false;
        this.markers = {};
        this.overlays = {};
        
        // Aral Sea coordinates (approximately)
        this.aralSeaCenter = [45.0, 59.5];
        this.aralSeaBounds = [
            [43.5, 57.5], // Southwest
            [46.5, 61.5]  // Northeast
        ];
    }

    initialize() {
        if (typeof L === 'undefined') {
            console.warn('Leaflet.js not loaded, map functionality disabled');
            return;
        }

        this.createMap();
        this.setupLayers();
        this.setupControls();
        this.addInteractiveElements();
        this.setupEventListeners();
        this.isInitialized = true;
    }

    createMap() {
        const mapContainer = document.getElementById('investigation-map');
        if (!mapContainer || this.map) return;

        // Initialize map
        this.map = L.map('investigation-map', {
            center: this.aralSeaCenter,
            zoom: 8,
            minZoom: 6,
            maxZoom: 15,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            dragging: true,
            zoomControl: true
        });

        // Add base tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 15
        }).addTo(this.map);

        // Add scale control
        L.control.scale({
            metric: true,
            imperial: false,
            position: 'bottomleft'
        }).addTo(this.map);

        // Restrict map bounds to Central Asia region
        this.map.setMaxBounds([
            [40.0, 55.0], // Southwest
            [50.0, 65.0]  // Northeast
        ]);
    }

    setupLayers() {
        if (!this.map) return;

        // Create layer groups
        this.layers.waterBodies = L.layerGroup().addTo(this.map);
        this.layers.irrigation = L.layerGroup().addTo(this.map);
        this.layers.settlements = L.layerGroup();
        this.layers.cottonFields = L.layerGroup();

        // Add historical Aral Sea outline
        this.addHistoricalSeaOutlines();
        
        // Add irrigation systems
        this.addIrrigationSystems();
        
        // Add settlements
        this.addSettlements();
        
        // Add cotton cultivation areas
        this.addCottonFields();
    }

    addHistoricalSeaOutlines() {
        // Approximate coordinates for different time periods
        const seaOutlines = {
            1990: [
                [45.8, 58.2], [45.9, 58.8], [46.2, 59.5], [46.0, 60.2],
                [45.5, 60.8], [44.8, 60.5], [44.2, 59.8], [44.0, 59.0],
                [44.3, 58.5], [44.8, 58.0], [45.3, 58.0], [45.8, 58.2]
            ],
            2000: [
                // Northern section
                [46.0, 59.8], [46.2, 60.2], [45.8, 60.5], [45.2, 60.2], [45.5, 59.8], [46.0, 59.8]
            ],
            2010: [
                // Small northern remnant
                [46.0, 60.0], [46.1, 60.1], [45.9, 60.2], [45.8, 60.0], [46.0, 60.0]
            ],
            2020: [
                // Tiny northern remnant
                [46.0, 60.0], [46.05, 60.05], [45.95, 60.05], [46.0, 60.0]
            ]
        };

        Object.entries(seaOutlines).forEach(([year, coords]) => {
            const polygon = L.polygon(coords, {
                color: '#3498db',
                fillColor: '#3498db',
                fillOpacity: year === '1990' ? 0.6 : 0.4,
                weight: 2,
                className: `sea-outline-${year}`
            });

            polygon.bindPopup(`
                <div class="map-popup">
                    <h4>Aral Sea - ${year}</h4>
                    <p>Area: ${this.getSeaArea(year)} km²</p>
                    <p>Status: ${this.getSeaStatus(year)}</p>
                </div>
            `);

            this.layers.waterBodies.addLayer(polygon);
        });

        // Add current (2025) outline - barely visible
        const currentOutline = L.polygon([
            [46.0, 60.0], [46.02, 60.02], [45.98, 60.02], [46.0, 60.0]
        ], {
            color: '#e74c3c',
            fillColor: '#e74c3c',
            fillOpacity: 0.7,
            weight: 2,
            className: 'sea-outline-2025'
        });

        currentOutline.bindPopup(`
            <div class="map-popup">
                <h4>Aral Sea - 2025</h4>
                <p>Area: ~7,000 km²</p>
                <p>Status: Critical - Less than 10% of original size</p>
                <p>Water Level: 20.1m above sea level</p>
            </div>
        `);

        this.layers.waterBodies.addLayer(currentOutline);
    }

    addIrrigationSystems() {
        // Major irrigation canals
        const canals = [
            {
                name: 'Karakum Canal',
                coords: [[37.5, 58.5], [38.0, 59.0], [39.0, 60.0], [40.0, 61.0]],
                info: 'Major irrigation canal diverting water from Amu Darya river'
            },
            {
                name: 'Amu Darya Irrigation Network',
                coords: [[41.0, 60.5], [42.0, 61.0], [43.0, 61.5], [44.0, 62.0]],
                info: 'Extensive irrigation network for cotton cultivation'
            },
            {
                name: 'Syr Darya Irrigation Network',
                coords: [[44.0, 67.0], [44.5, 65.0], [45.0, 63.0], [45.5, 61.0]],
                info: 'Northern irrigation system serving Kazakhstan'
            }
        ];

        canals.forEach(canal => {
            const polyline = L.polyline(canal.coords, {
                color: '#e74c3c',
                weight: 3,
                opacity: 0.8,
                dashArray: '5, 5'
            });

            polyline.bindPopup(`
                <div class="map-popup">
                    <h4>${canal.name}</h4>
                    <p>${canal.info}</p>
                    <p><strong>Impact:</strong> Diverted water from Aral Sea basin</p>
                </div>
            `);

            this.layers.irrigation.addLayer(polyline);
        });

        // Add irrigation area polygons
        const irrigationAreas = [
            {
                name: 'Khorezm Cotton Region',
                coords: [[41.5, 60.0], [42.0, 60.5], [42.5, 60.0], [42.0, 59.5], [41.5, 60.0]],
                area: '15,000 km²'
            },
            {
                name: 'Karakalpakstan Region',
                coords: [[43.0, 59.0], [43.5, 59.5], [44.0, 59.0], [43.5, 58.5], [43.0, 59.0]],
                area: '12,000 km²'
            }
        ];

        irrigationAreas.forEach(area => {
            const polygon = L.polygon(area.coords, {
                color: '#e67e22',
                fillColor: '#f39c12',
                fillOpacity: 0.3,
                weight: 1
            });

            polygon.bindPopup(`
                <div class="map-popup">
                    <h4>${area.name}</h4>
                    <p>Irrigated Area: ${area.area}</p>
                    <p>Primary Crop: Cotton</p>
                    <p>Water Source: Diverted rivers</p>
                </div>
            `);

            this.layers.irrigation.addLayer(polygon);
        });
    }

    addSettlements() {
        const settlements = [
            {
                name: 'Nukus',
                coords: [42.45, 59.61],
                population: '300,000',
                impact: 'Former fishing port, now 150km from water'
            },
            {
                name: 'Muynak',
                coords: [43.77, 59.02],
                population: '12,000',
                impact: 'Ship graveyard - ships stranded far from sea'
            },
            {
                name: 'Aralsk',
                coords: [46.80, 61.67],
                population: '30,000',
                impact: 'Former major fishing center, economic collapse'
            },
            {
                name: 'Kazalinsk',
                coords: [45.75, 62.10],
                population: '8,000',
                impact: 'Lost access to sea, economy devastated'
            }
        ];

        settlements.forEach(settlement => {
            const marker = L.marker(settlement.coords, {
                icon: L.divIcon({
                    className: 'settlement-marker',
                    html: '<div class="marker-inner">🏘️</div>',
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                })
            });

            marker.bindPopup(`
                <div class="map-popup">
                    <h4>${settlement.name}</h4>
                    <p><strong>Population:</strong> ~${settlement.population}</p>
                    <p><strong>Impact:</strong> ${settlement.impact}</p>
                    <p><strong>Status:</strong> Affected by sea's disappearance</p>
                </div>
            `);

            this.layers.settlements.addLayer(marker);
        });
    }

    addCottonFields() {
        const cottonRegions = [
            {
                name: 'Fergana Valley',
                coords: [[40.0, 70.0], [41.0, 72.0], [40.5, 73.0], [39.5, 71.0], [40.0, 70.0]],
                production: '2.5 million tons/year'
            },
            {
                name: 'Amu Darya Delta',
                coords: [[41.0, 59.0], [42.0, 60.0], [41.5, 61.0], [40.5, 60.0], [41.0, 59.0]],
                production: '1.8 million tons/year'
            },
            {
                name: 'Syr Darya Valley',
                coords: [[43.0, 67.0], [44.0, 68.0], [43.5, 69.0], [42.5, 68.0], [43.0, 67.0]],
                production: '1.2 million tons/year'
            }
        ];

        cottonRegions.forEach(region => {
            const polygon = L.polygon(region.coords, {
                color: '#27ae60',
                fillColor: '#2ecc71',
                fillOpacity: 0.4,
                weight: 2,
                dashArray: '3, 3'
            });

            polygon.bindPopup(`
                <div class="map-popup">
                    <h4>${region.name}</h4>
                    <p><strong>Primary Crop:</strong> Cotton</p>
                    <p><strong>Production:</strong> ${region.production}</p>
                    <p><strong>Water Usage:</strong> Extremely high</p>
                    <p><strong>Impact:</strong> Major contributor to Aral Sea decline</p>
                </div>
            `);

            this.layers.cottonFields.addLayer(polygon);
        });
    }

    setupControls() {
        if (!this.map) return;

        // Layer control
        const overlayMaps = {
            "Water Bodies": this.layers.waterBodies,
            "Irrigation Systems": this.layers.irrigation,
            "Settlements": this.layers.settlements,
            "Cotton Fields": this.layers.cottonFields
        };

        L.control.layers(null, overlayMaps, {
            position: 'topright',
            collapsed: false
        }).addTo(this.map);

        // Custom legend
        this.addLegend();
        
        // Custom info panel
        this.addInfoPanel();
    }

    addLegend() {
        const legend = L.control({ position: 'bottomright' });

        legend.onAdd = function() {
            const div = L.DomUtil.create('div', 'map-legend');
            div.innerHTML = `
                <h4>Legend</h4>
                <div class="legend-item">
                    <span class="legend-color" style="background: #3498db;"></span>
                    <span>Historical Sea Area</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background: #e74c3c;"></span>
                    <span>Current Sea Area</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background: #e67e22;"></span>
                    <span>Irrigation Canals</span>
                </div>
                <div class="legend-item">
                    <span class="legend-color" style="background: #2ecc71;"></span>
                    <span>Cotton Fields</span>
                </div>
                <div class="legend-item">
                    <span class="legend-marker">🏘️</span>
                    <span>Affected Settlements</span>
                </div>
            `;
            return div;
        };

        legend.addTo(this.map);
    }

    addInfoPanel() {
        const info = L.control({ position: 'topleft' });

        info.onAdd = function() {
            const div = L.DomUtil.create('div', 'map-info');
            div.innerHTML = `
                <h4>Investigation Map</h4>
                <p>Interactive map showing the Aral Sea's transformation and contributing factors.</p>
                <p><strong>Tip:</strong> Click on elements to explore evidence!</p>
            `;
            return div;
        };

        info.addTo(this.map);
    }

    setupEventListeners() {
        // Layer control checkboxes
        const layerControls = document.querySelectorAll('#water-bodies, #irrigation, #settlements, #cotton-fields');
        layerControls.forEach(control => {
            control.addEventListener('change', (e) => {
                this.toggleLayer(e.target.id, e.target.checked);
            });
        });

        // Year selector
        const yearSelector = document.getElementById('map-year');
        if (yearSelector) {
            yearSelector.addEventListener('change', (e) => {
                this.updateMapForYear(parseInt(e.target.value));
            });
        }

        // Map events
        if (this.map) {
            this.map.on('click', (e) => {
                this.handleMapClick(e);
            });

            this.map.on('zoom', () => {
                this.updateMarkerSizes();
            });
        }
    }

    toggleLayer(layerId, show) {
        const layerMap = {
            'water-bodies': 'waterBodies',
            'irrigation': 'irrigation',
            'settlements': 'settlements',
            'cotton-fields': 'cottonFields'
        };

        const layerName = layerMap[layerId];
        if (this.layers[layerName]) {
            if (show) {
                this.map.addLayer(this.layers[layerName]);
            } else {
                this.map.removeLayer(this.layers[layerName]);
            }
        }
    }

    updateMapForYear(year) {
        this.currentYear = year;
        
        // Hide all sea outlines first
        document.querySelectorAll('[class*="sea-outline-"]').forEach(outline => {
            outline.style.display = 'none';
        });

        // Show appropriate outline for the year
        let displayYear = year;
        if (year <= 1995) displayYear = 1990;
        else if (year <= 2005) displayYear = 2000;
        else if (year <= 2015) displayYear = 2010;
        else if (year <= 2022) displayYear = 2020;
        else displayYear = 2025;

        const targetOutline = document.querySelector(`.sea-outline-${displayYear}`);
        if (targetOutline) {
            targetOutline.style.display = 'block';
        }

        // Update info panel
        this.updateInfoPanelForYear(year);
        
        // Trigger detective clue
        if (window.DetectiveController) {
            window.DetectiveController.addClue(`Examined map data for year ${year}`);
        }
    }

    updateInfoPanelForYear(year) {
        const infoPanel = document.querySelector('.map-info');
        if (infoPanel) {
            const status = this.getSeaStatus(year);
            const area = this.getSeaArea(year);
            
            infoPanel.innerHTML = `
                <h4>Investigation Map - ${year}</h4>
                <p><strong>Sea Status:</strong> ${status}</p>
                <p><strong>Approximate Area:</strong> ${area} km²</p>
                <p><strong>Tip:</strong> Click on elements to explore evidence!</p>
            `;
        }
    }

    handleMapClick(e) {
        const lat = e.latlng.lat.toFixed(4);
        const lng = e.latlng.lng.toFixed(4);
        
        // Create a temporary marker for clicked location
        const clickMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'click-marker',
                html: '<div class="marker-inner">📍</div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
            })
        }).addTo(this.map);

        clickMarker.bindPopup(`
            <div class="map-popup">
                <h4>Investigation Point</h4>
                <p><strong>Coordinates:</strong> ${lat}, ${lng}</p>
                <p><strong>Region:</strong> ${this.getRegionName(lat, lng)}</p>
                <p>Click on markers and areas for detailed evidence!</p>
            </div>
        `).openPopup();

        // Remove marker after 3 seconds
        setTimeout(() => {
            this.map.removeLayer(clickMarker);
        }, 3000);
    }

    updateMarkerSizes() {
        const zoom = this.map.getZoom();
        const scale = Math.max(0.5, Math.min(1.5, zoom / 10));
        
        document.querySelectorAll('.settlement-marker').forEach(marker => {
            marker.style.transform = `scale(${scale})`;
        });
    }

    // Utility functions
    getSeaArea(year) {
        const areas = {
            1990: '68,000',
            2000: '17,160',
            2010: '13,900',
            2020: '8,300',
            2025: '7,000'
        };
        return areas[year] || areas[2025];
    }

    getSeaStatus(year) {
        if (year <= 1990) return 'Healthy - Full extent';
        if (year <= 2000) return 'Declining - Split into two parts';
        if (year <= 2010) return 'Critical - Eastern basin dry';
        if (year <= 2020) return 'Catastrophic - Less than 15% remains';
        return 'Critical - Less than 10% remains';
    }

    getRegionName(lat, lng) {
        if (lat > 45 && lng > 60) return 'Kazakhstan (Northern region)';
        if (lat < 44 && lng < 61) return 'Uzbekistan (Southern region)';
        if (lng < 59) return 'Turkmenistan border';
        return 'Central Aral Sea region';
    }

    // Public methods
    focusOnLocation(lat, lng, zoom = 10) {
        if (this.map) {
            this.map.setView([lat, lng], zoom);
        }
    }

    addCustomMarker(lat, lng, info, type = 'investigation') {
        if (!this.map) return;

        const marker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: `${type}-marker`,
                html: '<div class="marker-inner">🔍</div>',
                iconSize: [25, 25],
                iconAnchor: [12, 12]
            })
        });

        marker.bindPopup(info);
        marker.addTo(this.map);
        
        return marker;
    }

    resize() {
        if (this.map) {
            setTimeout(() => {
                this.map.invalidateSize();
            }, 100);
        }
    }

    reset() {
        this.currentYear = 1990;
        this.updateMapForYear(1990);
        
        if (this.map) {
            this.map.setView(this.aralSeaCenter, 8);
        }
    }

    // Get current state
    getCurrentYear() {
        return this.currentYear;
    }

    isLayerVisible(layerName) {
        return this.map && this.layers[layerName] && this.map.hasLayer(this.layers[layerName]);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.MapController = new MapController();
});

// Add custom CSS for map elements
const mapStyles = document.createElement('style');
mapStyles.textContent = `
    .map-legend {
        background: rgba(22, 33, 62, 0.9);
        border-radius: 10px;
        padding: 1rem;
        border: 1px solid rgba(243, 156, 18, 0.3);
        color: var(--text-light);
        backdrop-filter: blur(10px);
    }
    
    .map-legend h4 {
        color: var(--gold-color);
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
    }
    
    .legend-item {
        display: flex;
        align-items: center;
        margin-bottom: 0.3rem;
        font-size: 0.9rem;
    }
    
    .legend-color {
        width: 15px;
        height: 15px;
        border-radius: 3px;
        margin-right: 0.5rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .legend-marker {
        margin-right: 0.5rem;
        font-size: 1rem;
    }
    
    .map-info {
        background: rgba(22, 33, 62, 0.9);
        border-radius: 10px;
        padding: 1rem;
        border: 1px solid rgba(243, 156, 18, 0.3);
        color: var(--text-light);
        backdrop-filter: blur(10px);
        max-width: 250px;
    }
    
    .map-info h4 {
        color: var(--gold-color);
        margin: 0 0 0.5rem 0;
        font-size: 1rem;
    }
    
    .map-info p {
        margin-bottom: 0.3rem;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .map-popup {
        color: var(--text-dark);
    }
    
    .map-popup h4 {
        color: var(--primary-color);
        margin: 0 0 0.5rem 0;
        font-size: 1.1rem;
    }
    
    .map-popup p {
        margin-bottom: 0.3rem;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    
    .settlement-marker,
    .click-marker {
        background: rgba(233, 69, 96, 0.9);
        border-radius: 50%;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
    }
    
    .settlement-marker:hover,
    .click-marker:hover {
        transform: scale(1.2) !important;
    }
    
    .marker-inner {
        font-size: 0.8rem;
    }
    
    /* Leaflet control styling */
    .leaflet-control-layers {
        background: rgba(22, 33, 62, 0.9) !important;
        border: 1px solid rgba(243, 156, 18, 0.3) !important;
        border-radius: 10px !important;
        backdrop-filter: blur(10px);
    }
    
    .leaflet-control-layers-title {
        color: var(--gold-color) !important;
        font-weight: 600;
    }
    
    .leaflet-control-layers label {
        color: var(--text-light) !important;
        font-size: 0.9rem;
    }
    
    .leaflet-control-scale {
        background: rgba(22, 33, 62, 0.9) !important;
        border: 1px solid rgba(243, 156, 18, 0.3) !important;
        border-radius: 5px !important;
        color: var(--text-light) !important;
    }
    
    @media (max-width: 768px) {
        .map-legend,
        .map-info {
            font-size: 0.8rem;
            padding: 0.8rem;
        }
        
        .settlement-marker,
        .click-marker {
            width: 20px !important;
            height: 20px !important;
        }
    }
`;
document.head.appendChild(mapStyles);