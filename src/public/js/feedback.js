import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { getDatabase, ref, push } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Handle star rating
let currentRating = 0;
const stars = document.querySelectorAll('.rating-stars i');

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        currentRating = index + 1;
        updateStars();
    });

    star.addEventListener('mouseover', () => {
        updateStars(index + 1);
    });

    star.addEventListener('mouseleave', () => {
        updateStars(currentRating);
    });
});

function updateStars(rating = currentRating) {
    stars.forEach((star, index) => {
        star.style.color = index < rating ? '#ff4757' : '#dfe6e9';
    });
}

// Handle form submission
const feedbackForm = document.querySelector('.feedback-form');
feedbackForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const feedback = document.getElementById('feedback').value;

    if (!name || !email || !feedback || !currentRating) {
        alert('Please fill in all fields and provide a rating');
        return;
    }

    try {
        const feedbackData = {
            name,
            email,
            rating: currentRating,
            feedback,
            timestamp: new Date().toISOString()
        };

        await push(ref(db, 'feedback'), feedbackData);
        alert('Thank you for your feedback!');
        feedbackForm.reset();
        currentRating = 0;
        updateStars();
    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('There was an error submitting your feedback. Please try again.');
    }
});