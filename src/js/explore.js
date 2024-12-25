document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    const filters = document.querySelectorAll('.filter-select');
    const restaurantList = document.getElementById('restaurantList');
    const allRestaurants = [...restaurantList.children];

    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function filterRestaurants() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedCuisine = filters[0].value.toLowerCase();
        const selectedPrice = filters[1].value;
        const selectedRating = filters[2].value;

        allRestaurants.forEach((restaurant) => {
            const restaurantName = restaurant.querySelector('.title-3').textContent.toLowerCase();
            const cuisineType = restaurant.querySelector('.cuisine-type').textContent.toLowerCase();
            const location = restaurant.querySelector('.location').textContent.toLowerCase();
            const price = restaurant.querySelector('.price').textContent;
            const priceNum = getPriceRange(price);
            const rating = parseFloat(restaurant.querySelector('.rating span').textContent.replace(/[()]/g, ''));

            const matchesSearch =
                !searchTerm ||
                [restaurantName, cuisineType, location].some((text) => text.includes(searchTerm));
            const matchesCuisine = !selectedCuisine || cuisineType.includes(selectedCuisine);
            const matchesPrice = !selectedPrice || isPriceInRange(priceNum, selectedPrice);
            const matchesRating = !selectedRating || isRatingSufficient(rating, selectedRating);

            restaurant.style.display = matchesSearch && matchesCuisine && matchesPrice && matchesRating ? '' : 'none';
        });
    }

    function getPriceRange(priceText) {
        const prices = (priceText.match(/\d+/g) || []).map(Number);
        return prices.length ? Math.max(...prices) : 0;
    }

    function isPriceInRange(price, range) {
        switch (range) {
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

    function isRatingSufficient(rating, threshold) {
        switch (threshold) {
            case '4plus':
                return rating >= 4;
            case '3plus':
                return rating >= 3;
            case '2plus':
                return rating >= 2;
            default:
                return true;
        }
    }

    const debouncedFilter = debounce(filterRestaurants, 300);

    searchBtn.addEventListener('click', filterRestaurants);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterRestaurants();
        else debouncedFilter();
    });
    filters.forEach((filter) => filter.addEventListener('change', filterRestaurants));

    // Initial filter
    filterRestaurants();
});
