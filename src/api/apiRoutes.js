const express = require('express')
const path = require('path')
const fs = require('fs').promises // Using fs.promises for async operations
const router = express.Router()
const usersFilePath = path.join(__dirname, '../models/users.json')

// Login Route
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body
    console.log(`🔍 Login attempt: ${username}`)
    
    const data = await fs.readFile(usersFilePath, 'utf-8')
    const users = JSON.parse(data || '[]')

    const user = users.find(u => u.username === username && u.password === password)

    if (user) {
      console.log('✅ Login successful!')
      return res.status(200).json({ message: 'Login successful!', redirect: '/api/explore' })
    } else {
      console.log('❌ Invalid credentials!')
      return res.status(401).json({ message: 'Invalid username or password!' })
    }
  } catch (err) {
    console.error('🔥 Error in login:', err)
    next(err)
  }
})

// Sign-Up Route
router.post('/sign-up', async (req, res, next) => {
  try {
    const { username, password } = req.body
    console.log(`📝 New User Signup: ${username}`)
    
    const data = await fs.readFile(usersFilePath, 'utf-8')
    let users = JSON.parse(data || '[]')

    if (users.find(u => u.username === username)) {
      return res.status(400).json({ message: 'Username already exists!' })
    }

    const newUser = { username, password }
    users.push(newUser)

    await fs.writeFile(usersFilePath, JSON.stringify(users, null, 2))

    console.log('✅ User registered successfully!')
    res.status(201).json({ message: 'User registered successfully!', redirect: '/api/login' })
  } catch (err) {
    console.error('🔥 Error in sign-up:', err)
    next(err)
  }
})

module.exports = router