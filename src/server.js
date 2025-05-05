const express = require('express');
const path = require('path');
const debug = require('debug')('app:server');
const rateLimit = require('express-rate-limit');
const timeout = require('connect-timeout');
const slowDown = require('express-slow-down');
const bodyParser = require('body-parser'); // Import body-parser
// const fetch = require('node-fetch'); // Import node-fetch

const app = express();
const PORT = 8080;

// Developer-defined middlewares
const logger = require('./middlewares/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

// Built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

debug('Initializing server...');

// Rate Limiting Middleware
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});
app.use('/api', apiLimiter);

// Slow Down Middleware
const speedLimiter = slowDown({
    windowMs: 15 * 60 * 1000,
    delayAfter: 50,
    delayMs: () => 500
});
app.use('/api', speedLimiter);

// Timeout Middleware
app.use(timeout('10s'));
app.use((req, res, next) => {
    if (!req.timedout) next();
});

// Developer-defined middleware
app.use(logger);

// --- API ROUTES FOR RESERVATIONS ---
// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// In-memory storage for reservations (replace with a database in production)
const reservations = [];
let nextReservationId = 1;

app.post('/api/reservations', (req, res) => {
    const reservationData = req.body;

    // Validate the incoming data (optional, but recommended)
    if (!reservationData.name || !reservationData.email || !reservationData.date || !reservationData.time || !reservationData.guests) {
        return res.status(400).json({ error: 'Missing required fields in reservation data.' });
    }

    // Add a unique ID to the reservation
    reservationData.bookingId = `RESV-${nextReservationId++}`;
    reservationData.reservationDate = new Date(); // Add a timestamp
    reservationData.status = 'Pending'; // Set default status

    // Store the reservation
    reservations.push(reservationData);

    console.log('New reservation stored:', reservationData);

    // Respond with success
    res.status(201).json({ message: 'Reservation created successfully!', bookingId: reservationData.bookingId });
});

app.get('/api/reservations', (req, res) => {
    res.json(reservations);
});

// DELETE route to delete a specific reservation
app.delete('/api/reservations/:bookingId', (req, res) => {
    const bookingIdToDelete = req.params.bookingId;
    const initialLength = reservations.length;

    // Find the index of the reservation to delete
    const indexToDelete = reservations.findIndex(resv => resv.bookingId === bookingIdToDelete);

    if (indexToDelete !== -1) {
        reservations.splice(indexToDelete, 1);
        console.log(`Reservation with booking ID ${bookingIdToDelete} deleted.`);
        res.status(200).json({ message: `Reservation #${bookingIdToDelete} deleted successfully.` });
    } else {
        res.status(404).json({ error: `Reservation with booking ID ${bookingIdToDelete} not found.` });
    }
});
// --- END OF RESERVATION API ROUTES ---

// API Routes (if you have other API routes)
const apiRoutes = require('./api/apiRoutes');
app.use('/api', apiRoutes);

// Slow API Route for Testing
app.get('/api/slow', (req, res) => {
    setTimeout(() => {
        res.json({ message: 'This response was intentionally delayed by 5 seconds.' });
    }, 5000);
});

// Home page
app.get('/', (req, res) => {
    const images = [
        "/images/HomePageImages/hero-slider-1.jpg",//0
        "/images/HomePageImages/hero-slider-2.jpg",//1
        "/images/HomePageImages/hero-slider-3.jpg",//2
        '/images/HomePageImages/logo.png',//3
        "/images/HomePageImages/about-banner.jpg",//4
        "/images/HomePageImages/about-abs-image.jpg",//5
        "/images/HomePageImages/about-abs-image.jpg", //6
        "/images/HomePageImages/intimate_dining.jpg",//7
        "/images/HomePageImages/ro_dinning.jpg",//8
        "/images/HomePageImages/family_dinning.jpg",//9
        "/images/HomePageImages/outdoor_dinning.jpg",//10
        "/images/HomePageImages/custom_ambiance.jpg",//11
        "/images/HomePageImages/wine_dinning.jpg",//12
        "/images/HomePageImages/shape-5.png",//13
        "/images/HomePageImages/shape-6.png",//14
        "/images/HomePageImages/features-icon-1.png",//15
        "/images/HomePageImages/features-icon-2.png",//16
        "/images/HomePageImages/features-icon-3.png",//17
        "/images/HomePageImages/features-icon-4.png",//18
        "/images/HomePageImages/event-1.jpg",//19
        "/images/HomePageImages/event-1.jpg",//20
        "/images/HomePageImages/event-3.jpg"//21
    ];
    res.render('index', { images })
})

// Contact page
app.get('/contact', (req, res) => {
    const images = [
        "/images/logo.png",//0
        "/images/yay1.jpg"//1
    ];
    res.render('contact', { images });
})
//feedback
app.get('/feedback', (req, res) => {
    const images = [
        "/images/HomePageImages/logo.png"
    ];
    res.render('feedback', { images });
})

//About us page
app.get('/about', (req, res) => {
    const images = [
        '/images/HomePageImages/logo.png',
        '/vids/AboutUsBackground1.mp4',
        "/vids/AboutUsBackground1.webm",
        "/images/chef1.jpg",
        "/images/dining1.jpg", "/images/kitchen1.jpg"
    ];
    res.render('AboutUs', { images });
})

//login
app.get('/login', (req, res) => {
    const images = [
        '/images/HomePageImages/logo.png',
    ];
    res.render('login', { images });
})

//order
app.get('/order', async (req, res) => {
    const images = [
        '/images/HomePageImages/logo.png',
    ];

    try {
        const response = await fetch('http://localhost:8080/api/reservations');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
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
            totalAmount: 'N/A', // You might not have a total at booking
            status: 'Reserved'
        }));

        res.render('order', { images: images, orders: orders });

    } catch (error) {
        console.error('Failed to fetch reservations:', error);
        res.render('order', { images: images, orders: [] });
    }
});


//payment
app.get('/payment', (req, res) => {
    const images = [
        '/images/HomePageImages/logo.png',
        '/images/mc.png',
        '/images/vi.png',
        '/images/pp.png'
    ];
    res.render('payment', { images });
})


//reservation
app.get('/res', (req, res) => {
    const images = [
        '/images/HomePageImages/logo.png',
        'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
    ];
    res.render('res', { images });
})


//reviews
app.get('/reviews', (req, res) => {
    const images = [
        '/images/HomePageImages/logo.png',
    ];
    res.render('reviews', { images });
})

//signup
app.get('/sign-up', (req, res) => {
    const images = [
        '/images/HomePageImages/logo.png',
    ];
    res.render('sign-up', { images });
})

app.get('/tracking', (req, res) => {
    const images = [
        '/images/HomePageImages/logo.png',
    ];
    res.render('tracking', { images });
})

app.get('/explore', (req, res) => {
    const images = [
        '/images/HomePageImages/logo.png',
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
})


// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    debug(`Server is running at http://localhost:${PORT}`);
    console.log(`Server is running at http://localhost:${PORT}`);
});
