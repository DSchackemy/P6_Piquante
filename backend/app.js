const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors')
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');
const path = require('path')


mongoose.connect(
    'mongodb+srv://Nestor30:neimad54@cluster0.zwtyorc.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(bodyParser.json());
app.use(cors())


app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images'))); 


module.exports = app;
