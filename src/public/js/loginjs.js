    document.querySelector('.login-form').addEventListener('submit', async (e) => {
        e.preventDefault(); // Prevent default form submission
        const form = e.target;

        const formData = {
            username: form.username.value,
            password: form.password.value,
        };

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                alert('Login successful!'); // Replace with better UI handling
                window.location.href = '/explore.html'; // Redirect to dashboard
            } else {
                alert(result.error || 'Login failed!');
                window.location.href ="/sign-up.html"; //Redirect to sign-up page
            }
        } catch (error) {
            alert('Something went wrong. Please try again.');
        }
    });

