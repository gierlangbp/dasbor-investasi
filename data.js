// Color scheme based on the design
const colors = {
    primary: '#2B7EA1',
    secondary: '#1F5870',
    accent: '#4CAF50',
    background: '#0F3648',
    text: '#FFFFFF',
    highlight: '#4AD8D3',
    barColors: ['#4CAF50', '#2B7EA1', '#FF5722']
};

// Building data
const buildingData = [
    { name: 'P1', area: 2800, eui: 90.46, energyConsumption: 253, population: 240212, investment: 155.38, investmentUSD: 9.71, emissionReduction: 20113699, trees: 502842475, paybackPeriod: 4.23 },
    { name: 'P2', area: 25600, eui: 295.33, energyConsumption: 7560, population: 2062, investment: 24.99, investmentUSD: 1.56, emissionReduction: 6645897, trees: 166147417, paybackPeriod: 2.06 },
    { name: 'S3', area: 5400, eui: 77.00, energyConsumption: 416, population: 2689, investment: 9.12, investmentUSD: 0.57, emissionReduction: 428031, trees: 10700770, paybackPeriod: 11.67 }
];

const totalBuildingInvestment = 189.49; // trillion IDR
const totalBuildingInvestmentUSD = 11.84; // billion USD
const totalEmissionReduction = 27187626; // tCO₂e/year
const totalTrees = 679690662;

// Vehicle data
const vehicleData = {
    scenario1: {
        car: { investment: 100.76, investmentUSD: 6.30, emissionReduction: 173616, trees: 4340399, paybackPeriod: 24.40 },
        motorcycle: { investment: 14.15, investmentUSD: 1.03, emissionReduction: 85684, trees: 2142099, paybackPeriod: 16.59 }
    },
    scenario2: {
        car: { investment: 38.06, investmentUSD: 2.38, emissionReduction: 0, trees: 0, paybackPeriod: 9.43 },
        motorcycle: { investment: -3.54, investmentUSD: 1.03, emissionReduction: 0, trees: 0, paybackPeriod: 0.00 }
    },
    scenario3: {
        gasCar: { investment: 55.82, investmentUSD: 3.49 },
        electricCar: { investment: 28.68, investmentUSD: 1.79 },
        savings: "49%"
    }
};

// Street lighting data
const lightingData = [
    { name: 'Mercury to LED', investment: 1.52, investmentUSD: 0.095, emissionReduction: 172508, trees: 4312696, paybackPeriod: 4.5, isSpecial: false },
    { name: 'HPS to LED', investment: 1.63, investmentUSD: 0.102, emissionReduction: 81714, trees: 2042856, paybackPeriod: 10.2, isSpecial: false },
    { name: 'Bangun Baru APJ-TS', investment: 1.78, investmentUSD: 0.111, emissionReduction: 57159, trees: 1428975, billionSavings: 111.66, isSpecial: true, iconClass: 'fa-solar-panel' }
];

// Investment comparison data for bar chart
const investmentData = [
    { name: 'Bangunan Gedung', investment: totalBuildingInvestment },
    { name: 'Kendaraan Dinas', investment: vehicleData.scenario1.car.investment + vehicleData.scenario1.motorcycle.investment },
    { name: 'APJ', investment: lightingData.reduce((acc, curr) => acc + curr.investment, 0) }
];

// Emission reduction data for pie chart
const emissionData = [
    { name: 'Bangunan Gedung', value: totalEmissionReduction },
    { name: 'Kendaraan Dinas', value: vehicleData.scenario1.car.emissionReduction + vehicleData.scenario1.motorcycle.emissionReduction },
    { name: 'APJ', value: lightingData.reduce((acc, curr) => acc + curr.emissionReduction, 0) }
];

// Format large numbers for display
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(1);
}
