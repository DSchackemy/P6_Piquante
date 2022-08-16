// pour securiser la saisie des données on va installer le package de cryptage des mdp bcrypt via npm install --save bcrypt
const bcrypt = require('bcrypt');

const User = require('../models/User');

//installation de npm install --save jsonwebtoken ( permet d'obtenir un token generé aleatoirement)
const jwt = require('jsonwebtoken');

//logique de signup utilisant une fonction de hachage bcrypt dans le mdp qui va saler le mdp 10 fois. Plus la valeur ( ici 10) sera elevée
//plus le hachage sera securisé. attention une trop grosse valeur alongera le temps d'execution de la fonction.
//la fonction renvoie une promise dans laquelle le hash sera genere
//hash permet de sauvegarder le mdp dans la base de données de manière securisée

exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User ({
                email: req.body.email,
                password: hash
            });
        user.save()
            .then( () => res.status(201).json({message: 'Utilisateur créé! '}))
            .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}))
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then(user=> {
        if (user === null) {
            res.status(401).json ({message: 'Paire identifiant/mot de passe incorrecte'});
        } else {
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid) {
                        res.status(401).json({message: 'Paire identifiant/mot de passe incorrecte'})
                    }else {
                        res.status(200).json({
                            userId: user._id,
                            token: jwt.sign(
                                {userId: user._id},
                                'RANDOM_TOKEN_SECRET',
                                { expiresIn: '24h'}
                            )
                        });
                    }
                })
                .catch(error => {
                    res.status(500).json({error});
                })
        }
        
    })
    .catch(error => {
        res.status(500).json ({error});
    })
};