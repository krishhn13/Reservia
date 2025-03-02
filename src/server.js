const express = require('express')
const path = require('path')
const app = express()
const PORT = 8080

//developer-defined middlewares
const logger = require('./middlewares/logger')
const errorHandler = require('./middlewares/errorHandler')


//built-in middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(logger)
app.use(express.static(path.join(__dirname, 'public')))

const apiRoutes = require('./api/apiRoutes')
app.use('/api', apiRoutes)

//---------------------------------- Routes-----------------------------------------------
// app.get('/',(req,res)=>{
//   res.sendFile(path.join(__dirname,'views','index.html'))
// })


// app.get('/api/login', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'login.html'))
// })

// app.get('/api/explore', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'explore.html'))
// })

// app.get('/api/sign-up', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'sign-up.html'))
// })
// app.get('/api/res', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'res.html'))
// })
// app.get('/api/contact', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'contact.html'))
// })
// app.get('/api/AboutUs', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'AboutUs.html'))
// })
// app.get('/api/order', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'order.html'))
// })
// app.get('/api/Tracking', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'Tracking.html'))
// })
// app.get('/api/feedback', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'feedback.html'))
// })
// app.get('/api/reviews', (req, res) => {
//   res.sendFile(path.join(__dirname, 'views', 'reviews.html'))
// })

// Routes Array (To Avoid Repetition)
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
