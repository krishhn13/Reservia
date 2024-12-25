const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');
const cuisineSelect = document.querySelector('.filter-select:nth-child(1)');
const priceSelect = document.querySelector('.filter-select:nth-child(2)');
const ratingSelect = document.querySelector('.filter-select:nth-child(3)');
const restaurantList = document.getElementById('restaurantList');

const allRestaurants = [...restaurantList.children];

searchBtn.addEventListener('click', filterRestaurants);
searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') filterRestaurants();
});
cuisineSelect.addEventListener('change', filterRestaurants);
priceSelect.addEventListener('change', filterRestaurants);
ratingSelect.addEventListener('change', filterRestaurants);

function filterRestaurants() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCuisine = cuisineSelect.value.toLowerCase();
    const selectedPrice = priceSelect.value;
    const selectedRating = ratingSelect.value;

    allRestaurants.forEach(restaurant => {
        let shouldShow = true;

        const restaurantName = restaurant.querySelector('.title-3').textContent.toLowerCase();
        const cuisineType = restaurant.querySelector('.cuisine-type').textContent.toLowerCase();
        const location = restaurant.querySelector('.location').textContent.toLowerCase();
        
        if (searchTerm && !restaurantName.includes(searchTerm) && 
            !cuisineType.includes(searchTerm) && !location.includes(searchTerm)) {
            shouldShow = false;
        }

        if (selectedCuisine && !cuisineType.includes(selectedCuisine)) {
            shouldShow = false;
        }

        if (selectedPrice) {
            const price = restaurant.querySelector('.price').textContent;
            const priceNum = getPriceRange(price);
            
            if (!isPriceInRange(priceNum, selectedPrice)) {
                shouldShow = false;
            }
        }

        if (selectedRating) {
            const rating = parseFloat(restaurant.querySelector('.rating span').textContent.replace(/[()]/g, ''));
            
            switch(selectedRating) {
                case '4plus':
                    if (rating < 4) shouldShow = false;
                    break;
                case '3plus':
                    if (rating < 3) shouldShow = false;
                    break;
                case '2plus':
                    if (rating < 2) shouldShow = false;
                    break;
            }
        }

        restaurant.style.display = shouldShow ? '' : 'none';
    });
}

function getPriceRange(priceText) {
    const prices = priceText.match(/\d+/g).map(Number);
    return Math.max(...prices);
}

function isPriceInRange(price, range) {
    switch(range) {
        case '0-25':
            return price <= 25;
        case '25-50':
            return price > 25 && price <= 50;
        case '50-100':
            return price > 50 && price <= 100;
        case '100+':
            return price > 100;
        default:
            return true;
    }
}

filterRestaurants();