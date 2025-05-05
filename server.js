const express = require("express");
const path = require("path");
const app = express();


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));


// Defining the various routes and their assets

//home route
app.get('/home',(req,res)=>{
  const images=[
    'assets/images/HomePageImages/logo.png',//3
    "assets/images/HomePageImages/hero-slider-1.jpg",//0
    "assets/images/HomePageImages/hero-slider-2.jpg",//1
    "assets/images/HomePageImages/hero-slider-3.jpg",//2
    "assets/images/HomePageImages/about-banner.jpg",//4
    "assets/images/HomePageImages/about-abs-image.jpg",//5
    "assets/images/HomePageImages/about-abs-image.jpg", //6
    "assets/images/HomePageImages/intimate_dining.jpg",//7
    "assets/images/HomePageImages/ro_dinning.jpg",//8
    "assets/images/HomePageImages/family_dinning.jpg",//9
    "assets/images/HomePageImages/outdoor_dinning.jpg",//10
    "assets/images/HomePageImages/custom_ambiance.jpg",//11
    "assets/images/HomePageImages/wine_dinning.jpg",//12
    "assets/images/HomePageImages/shape-5.png",//13
    "assets/images/HomePageImages/shape-6.png" ,//14
    "assets/images/HomePageImages/features-icon-1.png",//15
    "assets/images/HomePageImages/features-icon-2.png",//16
    "assets/images/HomePageImages/features-icon-3.png",//17
    "assets/images/HomePageImages/features-icon-4.png" ,//18
    "assets/images/HomePageImages/event-1.jpg",//19
    "https://images.pexels.com/photos/225228/pexels-photo-225228.jpeg?auto=compress&cs=tinysrgb&w=600",//20
    "assets/images/HomePageImages/event-3.jpg"//21

  ];
    res.render('index', {images})
})

// about route
app.get("/about", (req, res) => {
  const images = [
    'assets/images/HomePageImages/logo.png',
    'assets/videos/AboutUsBackground1.mp4',
    "assets/videos/AboutUsBackground1.webm",
    "assets/images/chef1.jpg",
    "assets/images/dining1.jpg",
    "assets/images/kitchen1.jpg" 
  ];
  res.render("aboutUs", { images });
});


// contact route
app.get("/contact",(req,res)=>{
  const images =[
    'assets/images/HomePageImages/logo.png',//0
    "assets/images/logo.png",//1
    "assets/images/yay1.jpg"//2
  ];
  res.render("contact",{images})
});


// explore route
app.get('/explore',(req,res)=>{
  const images=[
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
})

// reservation route
app.get('/reservation',( req, res) => {
  const images=[
    'assets/images/HomePageImages/logo.png',  
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80'
  ];
  res.render('reservation', { images });
})

// feedback route
app.get('/feedback',(req,res)=>{
  const images=[
    "assets/images/HomePageImages/logo.png"
  ];
  res.render('feedback', { images });
})


// orders routes
app.get('/order', async (req, res) => {
  const images = [
      'assets/images/HomePageImages/logo.png',
  ];

  try {
      const response = await fetch('http://localhost:8080/reservation');
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

// payments route
app.get('/payment', (req, res) => {
  const images = [
      'assets/images/HomePageImages/logo.png',
      'assets/images/mc.png',
      'assets/images/vi.png',
      'assets/images/pp.png'
  ];
  res.render('payment', { images });
})


// tracking route
app.get('/tracking',(req,res)=>{
  const images = [
    'assets/images/HomePageImages/logo.png',
];
  res.render('tracking',{images});
})

// login route
app.get('/login', (req, res) => {
  const images = [
      'assets/images/HomePageImages/logo.png',
  ];
  res.render('login', { images });
})

// signup route
app.get('/sign-up', (req, res) => {
  const images = [
      'assets/images/HomePageImages/logo.png',
  ];
  res.render('signUp', { images });
})


// reviews route
app.get('/reviews', (req, res) => {
  const images = [
      'asse/images/HomePageImages/logo.png',
  ];
  res.render('reviews', { images });
})

// Start the server
app.listen(8080, () => {
  console.log("Server running at http://localhost:8080/home");
});
