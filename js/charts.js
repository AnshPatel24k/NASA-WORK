// Charts Controller using Chart.js
class ChartsController {
    constructor() {
        this.charts = {};
        this.isInitialized = false;
        this.chartData = this.initializeChartData();
        this.chartColors = {
            primary: '#3498db',
            secondary: '#e74c3c',
            success: '#27ae60',
            warning: '#f39c12',
            accent: '#9b59b6',
            dark: '#2c3e50'
        };
    }

    initializeChartData() {
        return {
            waterLevels: {
                years: [1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025],
                levels: [53.4, 52.8, 50.2, 53.4, 38.8, 28.5, 22.8, 20.1],
                volume: [1083, 1000, 800, 1083, 320, 180, 85, 70] // km³
            },
            waterUsage: {
                labels: ['Agriculture', 'Industry', 'Domestic', 'Other'],
                data: [92, 4, 3, 1],
                colors: ['#e74c3c', '#f39c12', '#3498db', '#95a5a6']
            },
            cottonProduction: {
                years: [1960, 1970, 1980, 1990, 2000, 2010, 2020, 2025],
                uzbekistan: [2.8, 4.2, 5.8, 5.1, 3.8, 3.4, 3.2, 3.0],
                kazakhstan: [0.8, 1.2, 1.5, 1.3, 0.9, 0.7, 0.5, 0.4]
            },
            temperature: {
                years: [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025],
                summer: [28.5, 29.1, 29.8, 30.2, 31.1, 31.8, 32.4, 33.1],
                winter: [-8.2, -7.8, -7.1, -6.9, -6.3, -5.8, -5.2, -4.7]
            },
            economicImpact: {
                categories: ['Fishing Industry', 'Tourism', 'Agriculture', 'Health Costs', 'Migration'],
                losses: [850, 120, 340, 680, 290], // millions USD
                colors: ['#e74c3c', '#f39c12', '#27ae60', '#9b59b6', '#34495e']
            },
            population: {
                years: [1990, 2000, 2010, 2020, 2025],
                aralsk: [50000, 42000, 35000, 30000, 28000],
                muynak: [25000, 18000, 14000, 12000, 10000],
                nukus: [180000, 220000, 270000, 300000, 310000]
            }
        };
    }

    initializeEvidenceCharts() {
        this.createWaterLevelChart();
        this.createPopulationChart();
    }

    initializeDataCharts() {
        this.createWaterUsageChart();
        this.createCottonVsSeaChart();
        this.createTemperatureChart();
        this.createEconomicChart();
        this.isInitialized = true;
    }

    createWaterLevelChart() {
        const canvas = document.getElementById('water-level-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');
        
        this.charts.waterLevel = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.chartData.waterLevels.years,
                datasets: [{
                    label: 'Water Level (m above sea level)',
                    data: this.chartData.waterLevels.levels,
                    borderColor: this.chartColors.primary,
                    backgroundColor: this.chartColors.primary + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.chartColors.primary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6
                }, {
                    label: 'Water Volume (km³)',
                    data: this.chartData.waterLevels.volume,
                    borderColor: this.chartColors.secondary,
                    backgroundColor: this.chartColors.secondary + '20',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: this.chartColors.secondary,
                    pointBorderColor: '#ffffff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Aral Sea Water Level & Volume Decline',
                        color: '#f39c12',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#ecf0f1' }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(22, 33, 62, 0.9)',
                        titleColor: '#f39c12',
                        bodyColor: '#ecf0f1',
                        borderColor: '#f39c12',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        ticks: { color: '#ecf0f1' },
                        title: { display: true, text: 'Year', color: '#ecf0f1' }
                    },
                    y: {
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        ticks: { color: '#ecf0f1' },
                        title: { display: true, text: 'Water Level (m)', color: '#ecf0f1' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#ecf0f1' },
                        title: { display: true, text: 'Volume (km³)', color: '#ecf0f1' }
                    }
                },
                animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    createPopulationChart() {
        const canvas = document.getElementById('population-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');
        
        this.charts.population = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.chartData.population.years,
                datasets: [{
                    label: 'Aralsk',
                    data: this.chartData.population.aralsk,
                    borderColor: this.chartColors.secondary,
                    backgroundColor: this.chartColors.secondary + '20',
                    borderWidth: 2,
                    fill: false
                }, {
                    label: 'Muynak',
                    data: this.chartData.population.muynak,
                    borderColor: this.chartColors.warning,
                    backgroundColor: this.chartColors.warning + '20',
                    borderWidth: 2,
                    fill: false
                }, {
                    label: 'Nukus',
                    data: this.chartData.population.nukus,
                    borderColor: this.chartColors.success,
                    backgroundColor: this.chartColors.success + '20',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Population Changes in Affected Cities',
                        color: '#f39c12',
                        font: { size: 14, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#ecf0f1' }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        ticks: { color: '#ecf0f1' }
                    },
                    y: {
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        ticks: { color: '#ecf0f1' },
                        title: { display: true, text: 'Population', color: '#ecf0f1' }
                    }
                }
            }
        });
    }

    createWaterUsageChart() {
        const canvas = document.getElementById('water-usage-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');
        
        this.charts.waterUsage = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: this.chartData.waterUsage.labels,
                datasets: [{
                    data: this.chartData.waterUsage.data,
                    backgroundColor: this.chartData.waterUsage.colors,
                    borderColor: '#1a1a2e',
                    borderWidth: 2,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Water Usage by Sector (%)',
                        color: '#f39c12',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        position: 'bottom',
                        labels: { 
                            color: '#ecf0f1',
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(22, 33, 62, 0.9)',
                        titleColor: '#f39c12',
                        bodyColor: '#ecf0f1',
                        callbacks: {
                            label: function(context) {
                                return context.label + ': ' + context.parsed + '%';
                            }
                        }
                    }
                },
                animation: {
                    animateRotate: true,
                    duration: 2000
                }
            }
        });
    }

    createCottonVsSeaChart() {
        const canvas = document.getElementById('cotton-vs-sea-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');
        
        // Calculate combined cotton production
        const combinedCotton = this.chartData.cottonProduction.uzbekistan.map((uz, i) => 
            uz + this.chartData.cottonProduction.kazakhstan[i]
        );

        this.charts.cottonVsSea = new Chart(ctx, {
            type: 'line',
            data: {
                labels: this.chartData.cottonProduction.years,
                datasets: [{
                    label: 'Cotton Production (Million Tons)',
                    data: combinedCotton,
                    borderColor: this.chartColors.success,
                    backgroundColor: this.chartColors.success + '20',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: this.chartColors.success,
                    yAxisID: 'y'
                }, {
                    label: 'Sea Water Level (m)',
                    data: this.chartData.waterLevels.levels,
                    borderColor: this.chartColors.primary,
                    backgroundColor: this.chartColors.primary + '20',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.4,
                    pointBackgroundColor: this.chartColors.primary,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Cotton Production vs Sea Water Level',
                        color: '#f39c12',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#ecf0f1' }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        ticks: { color: '#ecf0f1' },
                        title: { display: true, text: 'Year', color: '#ecf0f1' }
                    },
                    y: {
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        ticks: { color: '#ecf0f1' },
                        title: { display: true, text: 'Cotton Production (Million Tons)', color: '#ecf0f1' }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: { drawOnChartArea: false },
                        ticks: { color: '#ecf0f1' },
                        title: { display: true, text: 'Water Level (m)', color: '#ecf0f1' }
                    }
                }
            }
        });
    }

    createTemperatureChart() {
        const canvas = document.getElementById('temperature-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');
        
        this.charts.temperature = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: this.chartData.temperature.years,
                datasets: [{
                    label: 'Summer Avg (°C)',
                    data: this.chartData.temperature.summer,
                    backgroundColor: this.chartColors.warning + '80',
                    borderColor: this.chartColors.warning,
                    borderWidth: 1
                }, {
                    label: 'Winter Avg (°C)',
                    data: this.chartData.temperature.winter,
                    backgroundColor: this.chartColors.primary + '80',
                    borderColor: this.chartColors.primary,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Temperature Changes Over Time',
                        color: '#f39c12',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        labels: { color: '#ecf0f1' }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        ticks: { color: '#ecf0f1' },
                        title: { display: true, text: 'Year', color: '#ecf0f1' }
                    },
                    y: {
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        ticks: { color: '#ecf0f1' },
                        title: { display: true, text: 'Temperature (°C)', color: '#ecf0f1' }
                    }
                },
                animation: {
                    delay: (context) => context.dataIndex * 200
                }
            }
        });
    }

    createEconomicChart() {
        const canvas = document.getElementById('economic-chart');
        if (!canvas || typeof Chart === 'undefined') return;

        const ctx = canvas.getContext('2d');
        
        this.charts.economic = new Chart(ctx, {
            type: 'horizontalBar',
            data: {
                labels: this.chartData.economicImpact.categories,
                datasets: [{
                    label: 'Economic Loss (Million USD)',
                    data: this.chartData.economicImpact.losses,
                    backgroundColor: this.chartData.economicImpact.colors,
                    borderColor: '#1a1a2e',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    title: {
                        display: true,
                        text: 'Economic Impact by Sector',
                        color: '#f39c12',
                        font: { size: 16, weight: 'bold' }
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(22, 33, 62, 0.9)',
                        titleColor: '#f39c12',
                        bodyColor: '#ecf0f1',
                        callbacks: {
                            label: function(context) {
                                return context.dataset.label + ': $' + context.parsed.x + 'M';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        ticks: { 
                            color: '#ecf0f1',
                            callback: function(value) {
                                return '$' + value + 'M';
                            }
                        },
                        title: { display: true, text: 'Economic Loss (Million USD)', color: '#ecf0f1' }
                    },
                    y: {
                        grid: { color: 'rgba(236, 240, 241, 0.1)' },
                        ticks: { color: '#ecf0f1' }
                    }
                },
                animation: {
                    delay: (context) => context.dataIndex * 300
                }
            }
        });
    }

    // Interactive chart methods
    highlightDataPoint(chartName, dataIndex) {
        const chart = this.charts[chartName];
        if (!chart) return;

        // Reset all points
        chart.data.datasets.forEach(dataset => {
            dataset.pointRadius = dataset.pointRadius || [];
            dataset.pointHoverRadius = dataset.pointHoverRadius || [];
            
            for (let i = 0; i < dataset.data.length; i++) {
                dataset.pointRadius[i] = 6;
                dataset.pointHoverRadius[i] = 8;
            }
        });

        // Highlight specific point
        chart.data.datasets.forEach(dataset => {
            if (dataset.pointRadius) {
                dataset.pointRadius[dataIndex] = 10;
                dataset.pointHoverRadius[dataIndex] = 12;
            }
        });

        chart.update('none');
    }

    animateChart(chartName) {
        const chart = this.charts[chartName];
        if (!chart) return;

        chart.stop();
        chart.update('none');
        chart.render();
    }

    updateChartForYear(year) {
        // Update charts to highlight data for specific year
        const yearIndex = this.chartData.waterLevels.years.indexOf(year);
        
        if (yearIndex !== -1) {
            this.highlightDataPoint('waterLevel', yearIndex);
            this.highlightDataPoint('cottonVsSea', yearIndex);
            
            // Add detective clue
            if (window.DetectiveController) {
                const waterLevel = this.chartData.waterLevels.levels[yearIndex];
                const volume = this.chartData.waterLevels.volume[yearIndex];
                window.DetectiveController.addClue(
                    `Chart analysis ${year}: Water level ${waterLevel}m, Volume ${volume}km³`
                );
            }
        }
    }

    // Data export functionality
    exportChartData(chartName) {
        const chart = this.charts[chartName];
        if (!chart) return;

        const data = {
            labels: chart.data.labels,
            datasets: chart.data.datasets.map(dataset => ({
                label: dataset.label,
                data: dataset.data
            }))
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${chartName}_data.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Responsive handling
    resize() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.resize === 'function') {
                chart.resize();
            }
        });
    }

    // Destroy charts (for cleanup)
    destroy() {
        Object.values(this.charts).forEach(chart => {
            if (chart && typeof chart.destroy === 'function') {
                chart.destroy();
            }
        });
        this.charts = {};
        this.isInitialized = false;
    }

    // Get chart data for external use
    getChartData(chartName) {
        return this.chartData[chartName] || null;
    }

    getAllChartsData() {
        return this.chartData;
    }

    // Add custom annotations to charts
    addAnnotation(chartName, annotation) {
        const chart = this.charts[chartName];
        if (!chart) return;

        // This would require Chart.js annotation plugin
        // Implementation depends on specific annotation requirements
        console.log(`Adding annotation to ${chartName}:`, annotation);
    }

    // Update chart theme
    updateTheme(isDark = true) {
        const textColor = isDark ? '#ecf0f1' : '#2c3e50';
        const gridColor = isDark ? 'rgba(236, 240, 241, 0.1)' : 'rgba(44, 62, 80, 0.1)';

        Object.values(this.charts).forEach(chart => {
            if (chart && chart.options) {
                // Update text colors
                chart.options.plugins.title.color = '#f39c12';
                chart.options.plugins.legend.labels.color = textColor;
                
                // Update scale colors
                if (chart.options.scales) {
                    Object.values(chart.options.scales).forEach(scale => {
                        scale.ticks.color = textColor;
                        scale.grid.color = gridColor;
                        if (scale.title) {
                            scale.title.color = textColor;
                        }
                    });
                }
                
                chart.update('none');
            }
        });
    }
}

// Initialize Charts Controller
document.addEventListener('DOMContentLoaded', () => {
    window.ChartsController = new ChartsController();
});

// Handle Chart.js fallback
if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded, chart functionality will be limited');
    
    // Create placeholder charts
    document.addEventListener('DOMContentLoaded', () => {
        const chartCanvases = document.querySelectorAll('canvas[id*="chart"]');
        chartCanvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'rgba(22, 33, 62, 0.9)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#f39c12';
            ctx.font = '16px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('Chart data loading...', canvas.width / 2, canvas.height / 2);
        });
    });
}