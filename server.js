const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const app = express();

const User = require('./models/login'); // Mongoose model

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Home route
app.get(['/', '/home'], (req, res) => {
  const images = [
      'assets/images/HomePageImages/logo.png',
      "assets/images/HomePageImages/hero-slider-1.jpg",
      "assets/images/HomePageImages/hero-slider-2.jpg",
      "assets/images/HomePageImages/hero-slider-3.jpg",
      "assets/images/HomePageImages/about-banner.jpg",
      "assets/images/HomePageImages/about-abs-image.jpg",
      "assets/images/HomePageImages/about-abs-image.jpg",
      "assets/images/HomePageImages/intimate_dining.jpg",
      "assets/images/HomePageImages/ro_dinning.jpg",
      "assets/images/HomePageImages/family_dinning.jpg",
      "assets/images/HomePageImages/outdoor_dinning.jpg",
      "assets/images/HomePageImages/custom_ambiance.jpg",
      "assets/images/HomePageImages/wine_dinning.jpg",
      "assets/images/HomePageImages/shape-5.png",
      "assets/images/HomePageImages/shape-6.png",
      "assets/images/HomePageImages/features-icon-1.png",
      "assets/images/HomePageImages/features-icon-2.png",
      "assets/images/HomePageImages/features-icon-3.png",
      "assets/images/HomePageImages/features-icon-4.png",
      "assets/images/HomePageImages/event-1.jpg",
      "https://images.pexels.com/photos/225228/pexels-photo-225228.jpeg?auto=compress&cs=tinysrgb&w=600",
      "assets/images/HomePageImages/event-3.jpg"
  ];
  const success = req.query.success;
  res.render('index', { images, success });
});


// About route
app.get("/about", (req, res) => {
    const images = [
        'assets/images/HomePageImages/logo.png',
        'assets/videos/AboutUsBackground1.mp4',
        'assets/videos/AboutUsBackground1.webm',
        'assets/images/chef1.jpg',
        'assets/images/dining1.jpg',
        'assets/images/kitchen1.jpg'
    ];
    res.render("aboutUs", { images });
});

// Contact route
app.get("/contact", (req, res) => {
    const images = [
        'assets/images/HomePageImages/logo.png',
        'assets/images/logo.png',
        'assets/images/yay1.jpg'
    ];
    res.render("contact", { images });
});

// Explore route
app.get('/explore', (req, res) => {
    const images = [
        'assets/images/HomePageImages/logo.png',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9',
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
        'https://images.unsplash.com/photo-1585937421612-70a008356fbe',
        'https://images.unsplash.com/photo-1552566626-52f8b828add9',
        'https://images.unsplash.com/photo-1544148103-0773bf10d330',
        'https://images.unsplash.com/photo-1565299585323-38d6b0865b47',
        'https://images.unsplash.com/photo-1532347922424-c652d9b7208e',
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c'
    ];
    res.render('explore', { images });
});

// Reservation route
app.get('/reservation', (req, res) => {
    const images = [
        'assets/images/HomePageImages/logo.png',
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=2340&q=80'
    ];
    res.render('reservation', { images });
});

// Feedback route
app.get('/feedback', (req, res) => {
    const images = [
        'assets/images/HomePageImages/logo.png'
    ];
    res.render('feedback', { images });
});

// Orders route
app.get('/order', async (req, res) => {
    const images = [
        'assets/images/HomePageImages/logo.png'
    ];

    try {
        const response = await fetch('http://localhost:8080/reservation');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const reservationData = await response.json();

        const orders = reservationData.map(reservation => ({
            orderId: reservation.bookingId,
            orderDate: new Date(reservation.reservationDate),
            items: [
                { name: 'Table Reservation', quantity: reservation.guests },
                { name: `Time: ${reservation.time}`, quantity: 1 },
                { name: `Ambiance: ${reservation.music}`, quantity: 1 },
                ...(reservation.requests ? [{ name: `Special Request: ${reservation.requests}`, quantity: 1 }] : [])
            ],
            totalAmount: 'N/A',
            status: 'Reserved'
        }));

        res.render('order', { images, orders });

    } catch (error) {
        console.error('Failed to fetch reservations:', error);
        res.render('order', { images, orders: [] });
    }
});

// Payment route
app.get('/payment', (req, res) => {
    const images = [
        'assets/images/HomePageImages/logo.png',
        'assets/images/mc.png',
        'assets/images/vi.png',
        'assets/images/pp.png'
    ];
    res.render('payment', { images });
});

// Tracking route
app.get('/tracking', (req, res) => {
    const images = ['assets/images/HomePageImages/logo.png'];
    res.render('tracking', { images });
});

// Login route (GET)
app.get('/login', (req, res) => {
    const images = ['assets/images/HomePageImages/logo.png'];
    res.render('login', { images, message: undefined, redirect: undefined }); // <-- Fix added here
});

// Sign-up route (GET)
app.get('/sign-up', (req, res) => {
    const images = ['assets/images/HomePageImages/logo.png'];
    res.render('signUp', { images });
});

// Reviews route
app.get('/reviews', (req, res) => {
    const images = ['assets/images/HomePageImages/logo.png'];
    res.render('reviews', { images });
});

// Signup POST
app.post('/sign-up', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.json({ message: "Email already registered!", redirect: "/login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();
        res.json({ message: "Signup successful! Please log in.", redirect: "/login" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error. Please try again." });
    }
});

// Login POST
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
      const user = await User.findOne({ email: username });
      if (!user) {
          return res.render('login', {
              images: ['assets/images/HomePageImages/logo.png'],
              message: 'Invalid email or password!',
              redirect: '/login'
          });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.render('login', {
              images: ['assets/images/HomePageImages/logo.png'],
              message: 'Invalid email or password!',
              redirect: '/login'
          });
      }

      res.redirect('/home?success=Login successful!');
  } catch (err) {
      console.error(err);
      res.status(500).render('login', {
          images: ['assets/images/HomePageImages/logo.png'],
          message: 'Something went wrong. Please try again later.',
          redirect: '/login'
      });
  }
});

// Start the server
app.listen(8080, () => {
    console.log("Server running at http://localhost:8080/home");
});
