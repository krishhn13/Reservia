const express = require('express');
const path = require('path');
const debug = require('debug')('app:server');
const rateLimit = require('express-rate-limit');
const timeout = require('connect-timeout');
const slowDown = require('express-slow-down');

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

// API Routes
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
const images=[
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
  "/images/HomePageImages/shape-6.png" ,//14
  "/images/HomePageImages/features-icon-1.png",//15
  "/images/HomePageImages/features-icon-2.png",//16
  "/images/HomePageImages/features-icon-3.png",//17
  "/images/HomePageImages/features-icon-4.png" ,//18
  "/images/HomePageImages/event-1.jpg",//19
  "/images/HomePageImages/event-1.jpg",//20
  "/images/HomePageImages/event-3.jpg"//21
];
  res.render('index', {images})
})

// Contact page
app.get('/contact',(req,res)=>{
  const images=[
    "/images/logo.png",//0
    "/images/yay1.jpg"//1

  ];
  res.render('contact', { images });
})



//About us page
app.get('/about',(req,res)=>{
  const images=[
    '/images/HomePageImages/logo.png',
    '/vids/AboutUsBackground1.mp4',
    "/vids/AboutUsBackground1.webm",
    "/images/chef1.jpg",
    "/images/dining1.jpg","/images/kitchen1.jpg" 
  ];
  res.render('AboutUs', { images });
})

//login
app.get('/login',(req,res)=>{
  const images=[
    '/images/HomePageImages/logo.png',
  ];
  res.render('login', { images });
})


//order
app.get('/order',(req,res)=>{
  const images=[
    '/images/HomePageImages/logo.png',  
  ];
  res.render('order', { images });
})


//payment
app.get('payment',(req,res)=>{
  const images=[
    '/images/HomePageImages/logo.png',  
    '/images/mc.png',
    '/images/vi.png',
    '/images/pp.png'
  ];
  res.render('payment', { images });
})


//reservation
app.get('/res',( req, res) => {
  const images=[
    '/images/HomePageImages/logo.png',  
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  ];
  res.render('res', { images });
})


//reviews
app.get('/reviews',(req,res)=>{
  const images=[
    '/images/HomePageImages/logo.png',
  ];
  res.render('reviews', { images });
})

//signup
app.get('/sign-up',(req,res)=>{
  const images=[
    '/images/HomePageImages/logo.png',
  ];
  res.render('sign-up', { images });
})

app.get('/tracking',(req,res)=>{
  const images=[
    '/images/HomePageImages/logo.png',
  ];
  res.render('tracking', { images });
})

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  debug(`Server is running at http://localhost:${PORT}`);
  console.log(`Server is running at http://localhost:${PORT}`);
});
