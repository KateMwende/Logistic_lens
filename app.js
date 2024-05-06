const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');

//create instance of express
const app = express();

//Routes
const routes = require('./routes')

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use( '/', routes)
app.get("/", (req, res) => {
    res.send('Logistic_lens');
  });

  // Middleware for error handling
app.use((err, req, res, next) => {
  res.status(err.status).json({ success: false, error: err.message });
  next();
});

//database connection
 mongoose.connect(process.env.MONGO_URI, 
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false }
).then(() => {
    console.log('Successfully connected to database')
}).catch ((err) => {
    console.log('Failed to connect to databse.')
})

//Server listening
const port = process.env.PORT || 5500;
app.listen(port, function(){
    console.log(`App is listening on port: ${port}`);
})