// Current active mode
let currentMode = '';

// DOM Elements
const sections = {
    menu: document.getElementById('menu-section'),
    calculator: document.getElementById('calculator-section'),
    comingSoon: document.getElementById('coming-soon-section')
};

const inputs = {
    goldPrice: document.getElementById('gold-price'),
    deduction: document.getElementById('deduction'),
    weight: document.getElementById('weight'),
    grade: document.getElementById('gold-grade')
};

const display = {
    title: document.getElementById('calc-title'),
    finalPrice: document.getElementById('final-price')
};

// Mode Config
const config = {
    ornament: {
        title: 'รับซื้อทองรูปพรรณ',
        deductionDefault: 5
    },
    bar: {
        title: 'รับซื้อทองแท่ง',
        deductionDefault: 0 // Usually bars have no deduction or different logic
    },
    exchange: {
        title: 'เปลี่ยน / เทิร์นทอง',
        deductionDefault: 0
    }
};

/**
 * Switch to Calculator View
 * @param {string} mode - 'ornament', 'bar', 'exchange'
 */
function selectMode(mode) {
    currentMode = mode;

    // Hide menu
    sections.menu.style.display = 'none';

    if (mode === 'ornament') {
        // Active Feature
        // Set UI based on mode
        display.title.innerText = config[mode].title;
        inputs.deduction.value = config[mode].deductionDefault;

        // Hide inputs irrelevant to mode if needed (For now we keep standard inputs but might adjust logic)
        // For this MVP, we use the same field set, as defined mainly for Ornaments.

        // Animation transition
        sections.calculator.classList.remove('hidden');

        // Focus first input
        setTimeout(() => inputs.goldPrice.focus(), 100);
    } else {
        // Coming Soon Feature
        sections.comingSoon.classList.remove('hidden');
    }
}

/**
 * Go back to Main Menu
 */
function goBack() {
    sections.calculator.classList.add('hidden');
    sections.comingSoon.classList.add('hidden');
    sections.menu.style.display = 'grid'; // Restore grid layout
    resetForm();
}

/**
 * Reset all inputs
 */
function resetForm() {
    inputs.goldPrice.value = '';
    inputs.deduction.value = currentMode ? config[currentMode].deductionDefault : 5;
    inputs.weight.value = '';
    inputs.grade.selectedIndex = 0;// Default to 96.5%
    display.finalPrice.innerText = '฿0.00';
}

/**
 * Set weight from tags
 * @param {number} val 
 */
function setWeight(val) {
    inputs.weight.value = val;
    calculate();
}

/**
 * Main Calculation Logic
 */
function calculate() {
    // Get values
    const price = parseFloat(inputs.goldPrice.value) || 0;
    const deductionPercent = parseFloat(inputs.deduction.value) || 0;
    const weight = parseFloat(inputs.weight.value) || 0;

    // Validation
    if (price < 0 || deductionPercent < 0 || weight < 0) {
        display.finalPrice.innerText = "Error";
        // Simple validation visual
        if (price < 0) inputs.goldPrice.style.borderColor = 'red';
        return;
    } else {
        inputs.goldPrice.style.borderColor = '#333';
    }

    // Formula: (Price - %Deduction) * 0.0656 * Weight
    // Note: The prompt formula is: (ราคาทอง − %หักหลอม) × 0.0656 × น้ำหนักทอง(กรัม)
    // We assume %หักหลอม means Percentage of the Gold Price.

    let deductionAmount = price * (deductionPercent / 100);
    let priceAfterDeduction = price - deductionAmount;

    // Calculate Final
    let finalPrice = priceAfterDeduction * 0.0656 * weight;

    // Adjust for logic variations if needed for other modes
    // For 'bar' typically there is no deduction, but we let user control via input for now as placeholder

    // Formatting
    animateValue(finalPrice);
}

/**
 * Format and Display Result
 */
function animateValue(val) {
    // Format currency
    const formatted = new Intl.NumberFormat('th-TH', {
        style: 'currency',
        currency: 'THB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(val);

    display.finalPrice.innerText = formatted;

    // Optional: Add a glow effect on update
    display.finalPrice.style.textShadow = "0 0 20px rgba(76, 175, 80, 0.5)";
    setTimeout(() => {
        display.finalPrice.style.textShadow = "none";
    }, 200);
}

// Initial setup if needed
document.addEventListener('DOMContentLoaded', () => {
    // maybe fetch gold price API in future
});
