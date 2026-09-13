document.addEventListener('DOMContentLoaded', () => {
    const checkIn = document.getElementById('checkIn');
    const checkOut = document.getElementById('checkOut');
    const nightsLabel = document.getElementById('nightsLabel');
    const totalPrice = document.getElementById('totalPrice');
    const priceBreakdown = document.getElementById('priceBreakdown');

    const pricePerNight = Number(document.getElementById('bookingData').dataset.price);

    function updatePrice() {
        if (checkIn.value && checkOut.value) {
            const nights = Math.round((new Date(checkOut.value) - new Date(checkIn.value)) / (1000 * 60 * 60 * 24));
            if (nights > 0) {
                nightsLabel.textContent = `₹${pricePerNight.toLocaleString('en-IN')} x ${nights} night${nights > 1 ? 's' : ''}`;
                totalPrice.textContent = `₹${(nights * pricePerNight).toLocaleString('en-IN')}`;
                priceBreakdown.classList.add('price-active');
                return;
            }
        }
        nightsLabel.textContent = 'Select dates to see total';
        totalPrice.textContent = '';
        priceBreakdown.classList.remove('price-active');
    }

    checkIn.addEventListener('change', updatePrice);
    checkOut.addEventListener('change', updatePrice);
});