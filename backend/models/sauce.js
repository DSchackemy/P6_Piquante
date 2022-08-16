const mongoose = require('mongoose');

//creation d'un schema de données
const sauceSchema = mongoose.Schema({
    userId: {type: String, required: true},
    name: { type: String, required: true },
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required: true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number, required: false, default: 0},
    dislikes: {type: Number, requires: false, default: 0},
    usersLiked: {type: [String], required: false, default: []},
    usersDisliked: {type: [String], required: false, default: []},
});
//exportation du modele
module.exports = mongoose.model('sauce', sauceSchema);