const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const userRoutes = require('./routes/user');
const cors = require('cors')

mongoose.connect(
    'mongodb+srv://Nestor30:neimad54@cluster0.zwtyorc.mongodb.net/?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true }
).then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));


app.use(bodyParser.json());
app.use(cors())


app.use('/api/auth', userRoutes);


module.exports = app;
