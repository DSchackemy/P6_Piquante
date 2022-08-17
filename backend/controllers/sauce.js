const Sauce = require('../models/sauce');
const fs = require('fs');
const sauce = require('../models/sauce');

//controllers pour le CRUD

//Method GET pour tout les objets
exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then( sauces => res.status(200).json(sauces))
        .catch( error => res.status(400).json ({ error }));
};

//Method GET pour un seul objet
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
};


//Method POST
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce ({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    sauce.save()
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json ( {error})});
};

//Method PUT
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};

delete sauceObject._userId;
Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status (401).json({message : 'Non-autorisé'});
        } else {
            Sauce.updateOne({ _id: req.params.id}, {...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message: ' Objet modifié !'}))
            .catch(error => { res.status(401).json ( {error})});
        }
    })
    .catch((error => {
        res.status(400).json({error});
    }))
};

//Method DELETE
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        if (sauce.userId != req.auth.userId) {
            res.status (401).json({message : 'Non-autorisé'});
        } else {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then (() => { res.status(200).json ({message: 'Objet supprimé !'})})
                    .catch(error => res.status(401).json ({error}));
            });
        }
    })
    .catch(error => {
        res.status(500).json({error});
    });
};

exports.like = (req, res, next) => {
    // Ajout/suppression d'un like / dislike à une sauce
    // Like présent dans le body
    const like = req.body.like
    // On prend le userID
    const userId = req.body.userId
    // On prend l'id de la sauce
    const sauceId = req.params.id

    if (like === 1) { // Si il s'agit d'un like
        Sauce.updateOne({_id: sauceId}, {
            // On push l'utilisateur et on incrémente le compteur de 1
            $push: {usersLiked: userId},
            // On incrémente de 1
            $inc: {likes: +1},})
        .then(() => res.status(200).json({message: 'Like ajouté !'}))
        .catch((error) => res.status(400).json({error}))
    }
    if (like === -1) {
      Sauce.updateOne( // S'il s'agit d'un dislike
        {_id: sauceId}, {
            // On push l'utilisateur et on incrémente le compteur de 1
            $push: {usersDisliked: userId},
            // On incrémente de 1
            $inc: {dislikes: +1}
        })
        .then(() => {
            res.status(200).json({message: 'Dislike ajouté !'})
        })
        .catch((error) => res.status(400).json({error}))
    }
    if (like === 0) { // Si il s'agit d'annuler un like ou un dislike
    Sauce.findOne({_id: sauceId})
        .then((sauce) => {
            // Si il s'agit d'annuler un like
        if (sauce.usersLiked.includes(userId)) { 
            Sauce.updateOne({_id: sauceId}, {
                //On vient pull (ou tirer) l'utilisateur et on décrémente le compteur de -1
                $pull: {usersLiked: userId},
                // On décrémente de -1
                $inc: {likes: -1}, 
            })
                .then(() => res.status(200).json({message: 'Like retiré !'}))
                .catch((error) => res.status(400).json({error}))
            }
            // Si il s'agit d'annuler un dislike
        if (sauce.usersDisliked.includes(userId)) { 
            Sauce.updateOne({_id: sauceId}, {
                //On vient pull (ou tirer) l'utilisateur et on décrémente le compteur de -1
                $pull: {usersDisliked: userId},
                // On décrémente de -1
                $inc: {dislikes: -1}, 
            })
                .then(() => res.status(200).json({message: 'Dislike retiré !'}))
                .catch((error) => res.status(400).json({error}))
            }
        })
        .catch((error) => res.status(404).json({error}))
    }
}