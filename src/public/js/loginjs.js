document.querySelector('.login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;

    const formData = {
        username: form.email.value,
        password: form.password.value,
    };

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        const result = await response.json();
        if (response.ok) {
            alert(result.message);
            window.location.href = result.redirect;
        } else {
            alert(result.message || 'Login failed!');
            window.location.href = '/api/sign-up';
        }
    } catch (error) {
        alert('Something went wrong. Please try again.');
        console.log(error);
    }
});