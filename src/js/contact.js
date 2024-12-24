function sendMail() {
    document.querySelector('form').addEventListener('submit', function(event) {
        event.preventDefault();

        let email = document.querySelector('input[type="email"]').value;
        let name = document.querySelector('input[type="text"]').value;
        let phone = document.querySelector('input[type="tel"]').value;
        let date = document.querySelector('input[type="date"]').value;
        let message = document.querySelector('textarea').value;

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailPattern.test(email)) {
            alert("Please enter a valid email address.");
            return;
        }

        const namePattern = /^[a-zA-Z\s]+$/;
        if (!namePattern.test(name)) {
            alert("Please enter a valid name. Only alphabets and spaces are allowed.");
            return;
        }

        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(phone)) {
            alert("Please enter a valid 10-digit phone number. Only numbers are allowed.");
            return;
        }

        if (date === "") {
            alert("Please select a date.");
            return;
        }

        if (message.trim() === "") {
            alert("Please enter your message.");
            return;
        }

        alert("Form submitted successfully!");
        this.reset();
    });

    var params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value,
    };

    const serviceID = "service_3soxjtw";
    const templateID = "template_u24qovp";

    emailjs.send(serviceID, templateID, params).then(res => {
        document.getElementById("name").value = "";
        document.getElementById("email").value = "";
        document.getElementById("message").value = "";
        console.log(res);
        alert("Your message sent successfully!!")
    }).catch(err => console.log(err));
}