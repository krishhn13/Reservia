function sendMail() {

  
    document.querySelector('form').addEventListener('submit', function(event) {
event.preventDefault(); // Prevent form submission

let email = document.querySelector('input[type="email"]').value;
let name = document.querySelector('input[type="text"]').value;
let phone = document.querySelector('input[type="tel"]').value;
let date = document.querySelector('input[type="date"]').value;
let message = document.querySelector('textarea').value;

// Email validation
const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
if (!emailPattern.test(email)) {
    alert("Please enter a valid email address.");
    return;
}

// Name validation (only alphabets and spaces allowed)
const namePattern = /^[a-zA-Z\s]+$/;
if (!namePattern.test(name)) {
    alert("Please enter a valid name. Only alphabets and spaces are allowed.");
    return;
}

// Phone number validation (10 digits only)
const phonePattern = /^\d{10}$/;
if (!phonePattern.test(phone)) {
    alert("Please enter a valid 10-digit phone number. Only numbers are allowed.");
    return;
}

// Date validation (should not be empty)
if (date === "") {
    alert("Please select a date.");
    return;
}

// Message validation (optional: check if message is not empty)
if (message.trim() === "") {
    alert("Please enter your message.");
    return;
}

// If all validations pass
alert("Form submitted successfully!");
this.reset(); // Reset the form fields after submission
});


var params = {
  name: document.getElementById("name").value,
  email: document.getElementById("email").value,
  message: document.getElementById("message").value,
};

const serviceID = "service_3soxjtw";
const templateID = "template_u24qovp";

  emailjs.send(serviceID, templateID, params)
  .then(res=>{
      document.getElementById("name").value = "";
      document.getElementById("email").value = "";
      document.getElementById("message").value = "";
      console.log(res);
      alert("Your message sent successfully!!")

  })
  .catch(err=>console.log(err));

}

