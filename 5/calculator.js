document.addEventListener('DOMContentLoaded', function() {
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    const calculateBtn = document.getElementById('calculate-btn');
    const resultDiv = document.getElementById('result');
    const quantityError = document.getElementById('quantity-error');
    const productInfo = document.getElementById('product-info');
    
    productSelect.addEventListener('change', function() {
        const selectedOption = productSelect.options[productSelect.selectedIndex];
        const price = selectedOption.value;
        const productName = selectedOption.text.split(' - ')[0];
        productInfo.textContent = `Цена: ${price} руб.`;
    });
    
    calculateBtn.addEventListener('click', function(event) {
        event.preventDefault();

        quantityError.style.display = 'none';
        resultDiv.style.display = 'none';

        const quantityStr = quantityInput.value.trim();
        const price = parseInt(productSelect.value);

        const quantityPattern = /^\d+$/;
        const match = quantityStr.match(quantityPattern);
        
        if (match === null) {
            quantityError.style.display = 'block';
            return;
        }
        const quantity = parseInt(quantityStr);
        if (quantity === 0) {
            quantityError.textContent = 'Количество не может быть нулевым';
            quantityError.style.display = 'block';
            return;
        }

        const totalCost = price * quantity;
        const selectedProduct = productSelect.options[productSelect.selectedIndex].text.split(' - ')[0];
        resultDiv.innerHTML = `Стоимость заказа: <span style="color: #4CAF50;">${totalCost} руб.</span><br>
                              (${selectedProduct} × ${quantity} шт.)`;
        resultDiv.style.display = 'block';
    });
    
    quantityInput.addEventListener('input', function() {
        quantityError.style.display = 'none';
    });
});