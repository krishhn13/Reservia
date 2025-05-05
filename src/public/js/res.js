document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Set minimum date to today
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;

    // Animate form inputs
    const inputs = document.querySelectorAll('.input-animate');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    });

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            const navHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;

            window.scrollTo({
                top: targetPosition - navHeight,
                behavior: 'smooth'
            });
        });
    });

    // Form submission handler
    const form = document.getElementById('reservationForm');
    const modal = document.getElementById('success-modal');

    form.addEventListener('submit', async function(e) { // Make the function async
        e.preventDefault();

        // Collect form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            guests: document.getElementById('guests').value,
            music: document.getElementById('music').value,
            requests: document.getElementById('requests').value
        };

        try {
            const response = await fetch('/api/reservations', { // Send data to this endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                // Show success modal
                modal.classList.add('show');

                // Reset form
                form.reset();

                // Hide modal after 3 seconds
                setTimeout(() => {
                    modal.classList.remove('show');
                }, 3000);
            } else {
                console.error('Failed to submit reservation:', response.status);
                // Optionally display an error message to the user
            }
        } catch (error) {
            console.error('Error submitting reservation:', error);
            // Optionally display an error message to the user
        }
    });

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
});