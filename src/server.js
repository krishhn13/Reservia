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

// Pages using EJS (no more res.sendFile)
const pages = [
  { route: '/', file: 'index' },
  { route: '/login', file: 'login' },
  { route: '/explore', file: 'explore' },
  { route: '/sign-up', file: 'sign-up' },
  { route: '/res', file: 'res' },
  { route: '/contact', file: 'contact' },
  { route: '/AboutUs', file: 'AboutUs' },
  { route: '/order', file: 'order' },
  { route: '/Tracking', file: 'Tracking' },
  { route: '/feedback', file: 'feedback' },
  { route: '/reviews', file: 'reviews' }
];

// Render EJS views
pages.forEach(page => {
  app.get(page.route, (req, res) => {
    res.render(page.file); // It will render src/views/<file>.ejs
  });
});

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  debug(`Server is running at http://localhost:${PORT}`);
  console.log(`Server is running at http://localhost:${PORT}`);
});
