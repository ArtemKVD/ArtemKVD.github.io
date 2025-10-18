document.addEventListener('DOMContentLoaded', function() {
    const quantityInput = document.getElementById('quantity');
    const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
    const optionsSection = document.getElementById('options-section');
    const optionsSelect = document.getElementById('options');
    const propertySection = document.getElementById('property-section');
    const propertyCheckbox = document.getElementById('property');
    const totalCostElement = document.getElementById('total-cost');
    const costDetailsElement = document.getElementById('cost-details');

    const basePrices = {
        'basic': 500,
        'premium': 1000,
        'vip': 2000
    };
    const serviceNames = {
        'basic': 'Базовая услуга',
        'premium': 'Премиум услуга',
        'vip': 'VIP услуга'
    };

    function calculateTotalCost() {
        const quantity = parseInt(quantityInput.value) || 1;
        const selectedServiceType = document.querySelector('input[name="serviceType"]:checked').value;
        const basePrice = basePrices[selectedServiceType];
        
        let additionalCost = 0;
        let details = `${serviceNames[selectedServiceType]} × ${quantity} шт.`;

        if (selectedServiceType === 'premium' && optionsSection.style.display !== 'none') {
            const optionCost = parseInt(optionsSelect.value) || 0;
            additionalCost += optionCost;
            if (optionCost > 0) {
                const selectedOption = optionsSelect.options[optionsSelect.selectedIndex].text;
                details += `<br>${selectedOption}`;
            }
        }

        if (selectedServiceType === 'vip' && propertySection.style.display !== 'none' && propertyCheckbox.checked) {
            additionalCost += 1000;
            details += `<br>Экспресс-выполнение`;
        }

        const totalCost = (basePrice + additionalCost) * quantity;

        totalCostElement.textContent = `${totalCost.toLocaleString('ru-RU')} руб.`;
        costDetailsElement.innerHTML = details;
    }

    function updateAdditionalSections() {
        const selectedServiceType = document.querySelector('input[name="serviceType"]:checked').value;
        
        optionsSection.style.display = 'none';
        propertySection.style.display = 'none';

        if (selectedServiceType === 'premium') {
            optionsSection.style.display = 'block';
            optionsSection.classList.add('fade-in');
        } else if (selectedServiceType === 'vip') {
            propertySection.style.display = 'block';
            propertySection.classList.add('fade-in');
        }
    }

    quantityInput.addEventListener('input', function() {
        if (this.value < 1) {
            this.value = 1;
        } else if (this.value > 100) {
            this.value = 100;
        }
        calculateTotalCost();
    });

    serviceTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            updateAdditionalSections();
            calculateTotalCost();
        });
    });

    optionsSelect.addEventListener('change', calculateTotalCost);

    propertyCheckbox.addEventListener('change', calculateTotalCost);

    updateAdditionalSections();
    calculateTotalCost();
});