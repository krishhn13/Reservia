import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getDatabase, ref, get, child } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to load and display reviews
async function loadReviews() {
    try {
        const dbRef = ref(db);
        const snapshot = await get(child(dbRef, 'feedback'));
        const reviewsGrid = document.getElementById('reviewsGrid');
        
        if (snapshot.exists()) {
            const reviews = Object.values(snapshot.val());
            reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            reviewsGrid.innerHTML = ''; // Clear existing content
            reviews.forEach(review => {
                const reviewCard = createReviewCard(review);
                reviewsGrid.innerHTML += reviewCard;
            });
        }
    } catch (error) {
        console.error('Error loading reviews:', error);
    }
}

// Function to create a review card
function createReviewCard(review) {
    const date = new Date(review.timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    return `
        <div class="review-card">
            <div class="review-header">
                <img src="https://api.dicebear.com/6.x/initials/svg?seed=${review.name}" 
                     alt="${review.name}" 
                     class="reviewer-avatar">
                <div class="reviewer-info">
                    <h3>${review.name}</h3>
                    <span class="review-date">${date}</span>
                </div>
            </div>
            <div class="review-rating">
                ${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}
            </div>
            <div class="review-content">
                <p>${review.feedback}</p>
            </div>
        </div>
    `;
}

// Load reviews when the page loads
document.addEventListener('DOMContentLoaded', loadReviews);