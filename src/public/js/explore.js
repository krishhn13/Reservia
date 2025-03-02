import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getDatabase, ref, set, get, child } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
// Store restaurant data in Firebase
const restaurants = [
    {
        id: "la-belle-cuisine",
        name: "La Belle Cuisine",
        rating: 4.5,
        priceRange: "$50 - $100",
        cuisine: "French • Fine Dining",
        location: "123 Gourmet Street, Paris District",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
        featured: true
    },
    {
        id: "sakura-sushi",
        name: "Sakura Sushi",
        rating: 4.0,
        priceRange: "$25 - $50",
        cuisine: "Japanese • Sushi",
        location: "456 Ocean Avenue, Harbor District",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        featured: false
    },
    {
        id: "pasta-paradise",
        name: "Pasta Paradise",
        rating: 5.0,
        priceRange: "$25 - $50",
        cuisine: "Italian • Pasta",
        location: "789 Vineyard Lane, Italian Quarter",
        image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b",
        featured: false
    },
    {
        id: "spice-route",
        name: "Spice Route",
        rating: 4.8,
        priceRange: "$25 - $50",
        cuisine: "Indian • Contemporary",
        location: "321 Curry Lane, Spice District",
        image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
        featured: true
    },
    {
        id: "dragon-palace",
        name: "Dragon Palace",
        rating: 4.6,
        priceRange: "$50 - $100",
        cuisine: "Chinese • Traditional",
        location: "567 Dragon Street, Asian Quarter",
        image: "https://images.unsplash.com/photo-1552566626-52f8b828add9",
        featured: false
    },
    {
        id: "mediterranean-dreams",
        name: "Mediterranean Dreams",
        rating: 4.7,
        priceRange: "$25 - $50",
        cuisine: "Mediterranean • Seafood",
        location: "890 Coastal Road, Beach District",
        image: "https://images.unsplash.com/photo-1544148103-0773bf10d330",
        featured: false
    },
    {
        id: "taco-fiesta",
        name: "Taco Fiesta",
        rating: 4.4,
        priceRange: "$0 - $25",
        cuisine: "Mexican • Street Food",
        location: "432 Salsa Avenue, Latino Quarter",
        image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47",
        featured: false
    },
    {
        id: "thai-orchid",
        name: "Thai Orchid",
        rating: 4.3,
        priceRange: "$25 - $50",
        cuisine: "Thai • Contemporary",
        location: "765 Bamboo Lane, Asian District",
        image: "https://images.unsplash.com/photo-1532347922424-c652d9b7208e",
        featured: false
    },
    {
        id: "le-petit-bistro",
        name: "Le Petit Bistro",
        rating: 4.9,
        priceRange: "$100+",
        cuisine: "French • Classic",
        location: "234 Bistro Street, French Quarter",
        image: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c",
        featured: true
    }
];


// Function to initialize restaurant data
async function initializeRestaurants() {
  try {
    const dbRef = ref(db);
    const snapshot = await get(child(dbRef, 'restaurants'));
    
    if (!snapshot.exists()) {
      await set(ref(db, 'restaurants'), restaurants);
      console.log('Restaurants data initialized');
    }
    loadRestaurants();
  } catch (error) {
    console.error('Error initializing restaurants:', error);
  }
}

async function loadRestaurants() {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'restaurants'));
        
        if (snapshot.exists()) {
            const restaurantList = document.getElementById('restaurantList');
            restaurantList.innerHTML = ''; // Clear existing content
            
            const restaurants = Object.values(snapshot.val());
            restaurants.forEach(restaurant => {
                const card = createRestaurantCard(restaurant);
                restaurantList.insertAdjacentHTML('beforeend', card);
            });
        }
    } catch (error) {
        console.error('Error loading restaurants:', error);
    }
}

function createRestaurantCard(restaurant) {
    return `
        <div class="restaurant-card" data-restaurant-id="${restaurant.id}">
            <div class="card-banner">
                <img src="${restaurant.image}" alt="${restaurant.name}" class="img-cover">
                ${restaurant.featured ? '<span class="badge">Featured</span>' : ''}
            </div>
            <div class="card-content">
                <h3 class="title-3">${restaurant.name}</h3>
                <div class="restaurant-info">
                    <div class="rating">
                        ${createStarRating(restaurant.rating)}
                        <span>(${restaurant.rating})</span>
                    </div>
                    <div class="price">${restaurant.priceRange}</div>
                </div>
                <p class="cuisine-type">${restaurant.cuisine}</p>
                <p class="location">
                    <ion-icon name="location-outline"></ion-icon>
                    ${restaurant.location}
                </p>
                <div class="card-footer">
                    <a href="/res.html">
                        <button class="btn btn-primary">
                            <span class="text text-1">Reserve Table</span>
                            <span class="text text-2" aria-hidden="true">Reserve Table</span>
                        </button>
                    </a>
                </div>
            </div>
        </div>
    `;
}

function createStarRating(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<ion-icon name="star"></ion-icon>';
    }
    
    if (hasHalfStar) {
        stars += '<ion-icon name="star-half"></ion-icon>';
    }
    
    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
        stars += '<ion-icon name="star-outline"></ion-icon>';
    }
    
    return stars;
}

// Function to filter restaurants
function filterRestaurants(cuisine = '', price = '', rating = '') {
  const restaurantList = document.getElementById('restaurantList');
  const searchInput = document.querySelector('.search-input').value.toLowerCase();

  restaurants.forEach(restaurant => {
    const card = document.querySelector(`[data-restaurant-id="${restaurant.id}"]`);
    if (!card) return;

    const matchesSearch = restaurant.name.toLowerCase().includes(searchInput) ||
                         restaurant.cuisine.toLowerCase().includes(searchInput);
    const matchesCuisine = !cuisine || restaurant.cuisine.toLowerCase().includes(cuisine.toLowerCase());
    const matchesPrice = !price || restaurant.priceRange === price;
    const matchesRating = !rating || restaurant.rating >= parseFloat(rating);

    if (matchesSearch && matchesCuisine && matchesPrice && matchesRating) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  initializeRestaurants();

  // Search functionality
  const searchInput = document.querySelector('.search-input');
  searchInput?.addEventListener('input', () => filterRestaurants());

  // Filter functionality
  const filterSelects = document.querySelectorAll('.filter-select');
  filterSelects.forEach(select => {
    select?.addEventListener('change', () => {
      const cuisine = document.querySelector('select[value="cuisine"]')?.value || '';
      const price = document.querySelector('select[value="price"]')?.value || '';
      const rating = document.querySelector('select[value="rating"]')?.value || '';
      filterRestaurants(cuisine, price, rating);
    });
  });
});

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
