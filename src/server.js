const express = require('express');
const path = require('path');
const debug = require('debug')('app:server'); // Debug Middleware
const rateLimit = require('express-rate-limit'); // Rate Limiting Middleware
const timeout = require('connect-timeout'); // Request Timeout Middleware
const slowDown = require('express-slow-down'); // Slow Down Middleware

const app = express();
const PORT = 8080;

// Developer-defined middlewares
const logger = require('./middlewares/logger');
const { errorHandler, notFoundHandler } = require('./middlewares/errorHandler');

// Built-in middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Debugging Middleware
debug('Initializing server...');

// Rate Limiting Middleware (Only for API routes)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per window
  message: "Too many requests from this IP, please try again later."
});
app.use('/api', apiLimiter);

// Slow Down Middleware (Helps prevent abuse by slowing requests)
const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 50, // 50 requests ke baad slow karega
  delayMs: () => 500 // Har extra request pe 500ms delay
});

app.use('/api', speedLimiter);

// Timeout Middleware (Global Timeout for Slow Requests)
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
  }, 5000); // 5-second delay
});

// Routes Array
const pages = [
  { route: '/', file: 'index.html' },
  { route: '/api/login', file: 'login.html' },
  { route: '/api/explore', file: 'explore.html' },
  { route: '/api/sign-up', file: 'sign-up.html' },
  { route: '/api/res', file: 'res.html' },
  { route: '/api/contact', file: 'contact.html' },
  { route: '/api/AboutUs', file: 'AboutUs.html' },
  { route: '/api/order', file: 'order.html' },
  { route: '/api/Tracking', file: 'Tracking.html' },
  { route: '/api/feedback', file: 'feedback.html' },
  { route: '/api/reviews', file: 'reviews.html' }
];

// Automatically Create Routes
pages.forEach(page => {
  app.get(page.route, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', page.file));
  });
});

// Error Handler Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  debug(`Server is running at http://localhost:${PORT}`);
  console.log(`Server is running at http://localhost:${PORT}`);
});