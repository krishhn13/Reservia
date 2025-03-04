const express = require('express')
const path = require('path')
const app = express()
const PORT = 8080

// Developer-defined middlewares
const logger = require('./middlewares/logger')
const errorHandler = require('./middlewares/errorHandler')

// Built-in middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)
app.use(express.static(path.join(__dirname, 'public')))

// API Routes
const apiRoutes = require('./api/apiRoutes')
app.use('/api', apiRoutes)

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
]

// Automatically Create Routes
pages.forEach(page => {
  app.get(page.route, (req, res) => {
    res.sendFile(path.join(__dirname, 'views', page.file))
  })
})

// Error Handler Middleware
app.use(errorHandler)

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
