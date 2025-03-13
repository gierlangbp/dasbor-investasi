// Use a more efficient way to initialize the dashboard
let chartsInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
    // Create static content immediately
    requestAnimationFrame(() => {
        createBuildingCards();
        createVehicleCards();
        createLightingCards();
        
        // Delay chart initialization until after first paint and when visible in viewport
        if ('IntersectionObserver' in window) {
            const chartObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !chartsInitialized) {
                        chartsInitialized = true;
                        initializeCharts();
                        chartObserver.disconnect();
                    }
                });
            }, {threshold: 0.1});
            
            // Observe the charts section
            const chartsSection = document.querySelector('.charts');
            if (chartsSection) chartObserver.observe(chartsSection);
        } else {
            // Fallback for browsers without IntersectionObserver
            setTimeout(initializeCharts, 300);
        }
    });
});

// Function to initialize charts
function initializeCharts() {
    createInvestmentChart();
    setTimeout(createEmissionChart, 100); // Stagger chart creation
}

// Create the investment bar chart
function createInvestmentChart() {
    const ctx = document.getElementById('investmentChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: investmentData.map(item => item.name),
            datasets: [{
                label: 'Investment (trillion IDR)',
                data: investmentData.map(item => item.investment),
                backgroundColor: colors.barColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 500 // Shorter animation
            },
            devicePixelRatio: 1, // Lower resolution for better performance
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: colors.secondary,
                    titleColor: colors.text,
                    bodyColor: colors.text,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `${context.parsed.y.toFixed(2)} trillion IDR`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: colors.text,
                        maxTicksLimit: 5,
                        callback: function(value) {
                            return value.toFixed(0);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    border: {
                        display: false
                    },
                    ticks: {
                        color: colors.text
                    }
                }
            }
        }
    });
}

// Create the emission pie chart
function createEmissionChart() {
    const ctx = document.getElementById('emissionChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: emissionData.map(item => item.name),
            datasets: [{
                data: emissionData.map(item => item.value),
                backgroundColor: colors.barColors,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 500 // Shorter animation
            },
            devicePixelRatio: 1, // Lower resolution for better performance
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        color: colors.text,
                        padding: 10,
                        boxWidth: 12,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    enabled: true,
                    backgroundColor: colors.secondary,
                    titleColor: colors.text,
                    bodyColor: colors.text,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            const value = context.raw;
                            const percentage = ((value / emissionData.reduce((a, b) => a + b.value, 0)) * 100).toFixed(0);
                            return `${formatNumber(value)} tCO₂e/year (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Create building cards - optimized with document fragment
function createBuildingCards() {
    const container = document.querySelector('.data-section:nth-of-type(1) .cards-grid');
    if (!container) return;
    
    const fragment = document.createDocumentFragment();
    
    buildingData.forEach(building => {
        const card = document.createElement('div');
        card.className = 'card dark-card';
        
        // Create card header
        const header = document.createElement('div');
        header.className = 'card-header';
        
        const title = document.createElement('h3');
        title.textContent = building.name;
        
        const icon = document.createElement('i');
        icon.className = 'fas fa-building';
        icon.style.color = colors.highlight;
        
        header.appendChild(title);
        header.appendChild(icon);
        
        // Create data card
        const dataCard = document.createElement('div');
        dataCard.className = 'data-card';
        
        // Add data pairs (label + value)
        const dataPairs = [
            {label: 'Investment:', value: `${building.investment} trillion IDR`, type: 'value'},
            {label: 'USD:', value: `${building.investmentUSD} billion USD`, type: 'value'},
            {label: 'Emission Reduction:', value: `${formatNumber(building.emissionReduction)} tCO₂e/year`, type: 'accent-value'},
            {label: 'Payback Period:', value: `${building.paybackPeriod} years`, type: 'value'}
        ];
        
        dataPairs.forEach(pair => {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = pair.label;
            
            const valueDiv = document.createElement('div');
            valueDiv.className = pair.type;
            valueDiv.textContent = pair.value;
            
            dataCard.appendChild(labelDiv);
            dataCard.appendChild(valueDiv);
        });
        
        // Assemble card
        card.appendChild(header);
        card.appendChild(dataCard);
        fragment.appendChild(card);
    });
    
    container.appendChild(fragment);
}

// Create vehicle cards - optimized with document fragment and DOM API
function createVehicleCards() {
    const container = document.querySelector('.data-section:nth-of-type(2) .cards-grid');
    if (!container) return;
    
    const fragment = document.createDocumentFragment();
    
    // Helper function to create a vehicle card
    function createScenarioCard(title, iconClass, dataPairs) {
        const card = document.createElement('div');
        card.className = 'card dark-card';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'card-header';
        
        const heading = document.createElement('h3');
        heading.textContent = title;
        
        const icon = document.createElement('i');
        icon.className = iconClass;
        icon.style.color = colors.highlight;
        
        header.appendChild(heading);
        header.appendChild(icon);
        
        // Create data card
        const dataCard = document.createElement('div');
        dataCard.className = 'data-card';
        
        // Add data pairs
        dataPairs.forEach(pair => {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = pair.label;
            
            const valueDiv = document.createElement('div');
            valueDiv.className = pair.type || 'value';
            valueDiv.textContent = pair.value;
            
            dataCard.appendChild(labelDiv);
            dataCard.appendChild(valueDiv);
        });
        
        card.appendChild(header);
        card.appendChild(dataCard);
        return card;
    }
    
    // Scenario 1
    const scenario1Data = [
        {label: 'Electric Cars:', value: `${vehicleData.scenario1.car.investment} trillion IDR`},
        {label: 'Electric Motorcycles:', value: `${vehicleData.scenario1.motorcycle.investment} trillion IDR`},
        {label: 'Emission Reduction:', value: `${formatNumber(vehicleData.scenario1.car.emissionReduction + vehicleData.scenario1.motorcycle.emissionReduction)} tCO₂e/year`, type: 'accent-value'},
        {label: 'Payback Period (Car):', value: `${vehicleData.scenario1.car.paybackPeriod} years`}
    ];
    const card1 = createScenarioCard('Immediate Replacement', 'fas fa-car', scenario1Data);
    
    // Scenario 2
    const scenario2Data = [
        {label: 'Electric Cars:', value: `${vehicleData.scenario2.car.investment} trillion IDR`},
        {label: 'Electric Motorcycles:', value: `${vehicleData.scenario2.motorcycle.investment} trillion IDR`},
        {label: 'Payback Period (Car):', value: `${vehicleData.scenario2.car.paybackPeriod} years`},
        {label: 'Payback Period (Motorcycle):', value: `${vehicleData.scenario2.motorcycle.paybackPeriod} years`}
    ];
    const card2 = createScenarioCard('Lifetime Replacement', 'fas fa-car', scenario2Data);
    
    // Scenario 3
    const scenario3Data = [
        {label: 'Gas Cars:', value: `${vehicleData.scenario3.gasCar.investment} trillion IDR`},
        {label: 'Electric Cars:', value: `${vehicleData.scenario3.electricCar.investment} trillion IDR`},
        {label: 'Savings:', value: `${vehicleData.scenario3.savings}`, type: 'accent-value'}
    ];
    const card3 = createScenarioCard('Sewa', 'fas fa-car', scenario3Data);
    
    // Add all cards to fragment
    fragment.appendChild(card1);
    fragment.appendChild(card2);
    fragment.appendChild(card3);
    
    // Append fragment to container in a single DOM operation
    container.appendChild(fragment);
}

// Create lighting cards - optimized with document fragment
function createLightingCards() {
    const container = document.querySelector('.data-section:nth-of-type(3) .cards-grid');
    if (!container) return;
    
    const fragment = document.createDocumentFragment();
    
    lightingData.forEach(lighting => {
        const card = document.createElement('div');
        card.className = 'card dark-card';
        
        // Create header
        const header = document.createElement('div');
        header.className = 'card-header';
        
        const title = document.createElement('h3');
        title.textContent = lighting.name;
        
        const icon = document.createElement('i');
        // Use the custom icon class if specified, otherwise use default
        icon.className = lighting.iconClass ? `fas ${lighting.iconClass}` : 'fas fa-lightbulb';
        icon.style.color = colors.highlight;
        
        header.appendChild(title);
        header.appendChild(icon);
        
        // Create data card
        const dataCard = document.createElement('div');
        dataCard.className = 'data-card';
        
        // Add common data pairs
        const dataPairs = [
            {label: 'Investment:', value: `${lighting.investment} trillion IDR`},
            {label: 'USD:', value: `${lighting.investmentUSD} billion USD`},
            {label: 'Emission Reduction:', value: `${formatNumber(lighting.emissionReduction)} tCO₂e/year`, type: 'accent-value'}
        ];
        
        // Add either payback period or billing savings based on isSpecial flag
        if (lighting.isSpecial) {
            dataPairs.push({label: 'Penghematan Tagihan:', value: `${lighting.billionSavings} Miliar Rupiah`, type: 'accent-value'});
        } else {
            dataPairs.push({label: 'Payback Period:', value: `${lighting.paybackPeriod} years`});
        }
        
        dataPairs.forEach(pair => {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'label';
            labelDiv.textContent = pair.label;
            
            const valueDiv = document.createElement('div');
            valueDiv.className = pair.type || 'value';
            valueDiv.textContent = pair.value;
            
            dataCard.appendChild(labelDiv);
            dataCard.appendChild(valueDiv);
        });
        
        // Assemble card
        card.appendChild(header);
        card.appendChild(dataCard);
        fragment.appendChild(card);
    });
    
    // Append fragment to container in a single DOM operation
    container.appendChild(fragment);
}


