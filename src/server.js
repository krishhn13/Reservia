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

app.get('/login',(req,res)=>{
  const images=[
    '/images/HomePageImages/logo.png',
  ];
  res.render('login', { images });
})

app.get('/order',(req,res)=>{
  const images=[
    '/images/HomePageImages/logo.png',  
  ];
  res.render('order', { images });
})

app.get('payment',(req,res)=>{
  const images=[
    '/images/HomePageImages/logo.png',  
    '/images/mc.png',
    '/images/vi.png',
    '/images/pp.png'
  ];
  res.render('payment', { images });
})

app.get('/res',( req, res) => {
  const images=[
    '/images/HomePageImages/logo.png',  
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  ];
  res.render('res', { images });
})

app.get('/reviews',(req,res)=>{
  const images=[
    '/images/HomePageImages/logo.png',
  ];
  res.render('reviews', { images });
})

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

app.get('/explore',(req,res)=>{
  const images=[
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

app.get
// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  debug(`Server is running at http://localhost:${PORT}`);
  console.log(`Server is running at http://localhost:${PORT}`);
});
