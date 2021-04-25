const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Dish = require('../models/Dish');
const Favourite = require('../models/Favourite');

const router = express.Router();

router.use(bodyParser.json());

router.get('/', authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({user: req.user.id})
        .populate('user dishes')
        .then(fav => {
            res.json(fav);
        })
        .catch(err => next(err));
})

router.post('/', authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({user: req.user.id})
        .then(favourite => {
            if (!favourite) {
                Favourite.create({user: req.user.id})
                    .then(fav => console.log('fav created'))
                    .catch(err => next(err));
            }

            Favourite.findOne({user: req.user.id})
                .then(favourite => {
                    req.body.forEach(element => {
                        Dish.findById(element.id)
                            .then(dish => {
                                const index_no = favourite.dishes.indexOf(dish.id);
                                if (index_no === -1)
                                    favourite.dishes.push(dish.id);
                            })
                            .catch(err => next(err));
                    })

                    favourite.save()
                        .then(fav => {
                            Favourite.findById(fav.id)
                                .then(fav => {
                                    res.json(fav);
                                })
                        })
                        .catch(err => next(err));
                })
                .catch(err => next(err));
        })
        .catch(err => next(err))
})

router.delete('/', authenticate.verifyUser, (req, res, next) => {
    Favourite.findOneAndRemove({user: req.user.id})
        .then(resp => res.json(resp))
        .catch(err => next(err));
})

router.post('/:dishId', authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            if (!dish) {
                let err = new Error('Dish does not exits');
                err.status = 404;
                return next(err);
            }

            Favourite.findOne({user: req.user.id})
                .then(favourite => {
                    if (!favourite) {
                        Favourite.create({user: req.user.id})
                            .then(favourite => {
                                const index_no = favourite.dishes.indexOf(dish.id);

                                if (index_no === -1) {
                                    favourite.dishes.push(dish.id);
                                    favourite.save()
                                        .then(fav => {
                                            Favourite.findById(fav.id)
                                                .then(fav => res.json(fav))
                                                .catch(err => next(err));
                                        })
                                } else {
                                    let err = new Error('item already in favourites list');
                                    err.status = 400;
                                    return next(err);
                                }
                            })
                            .catch(err => next(err));
                    } else {
                        const index_no = favourite.dishes.indexOf(dish.id);

                        if (index_no === -1) {
                            favourite.dishes.push(dish.id);
                            favourite.save()
                                .then(fav => {
                                    Favourite.findById(fav.id)
                                        .then(fav => res.json(fav))
                                        .catch(err => next(err));
                                })
                        } else {
                            let err = new Error('item already in favourites list');
                            err.status = 400;
                            return next(err);
                        }
                    }
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
})

router.delete('/:dishId', authenticate.verifyUser, (req, res, next) => {
    Favourite.findOne({user: req.user.id})
        .then(fav => {
            if (!fav) {
                let err = new Error('User has no favourites');
                err.status = 400;
                return next(err);
            }

            const index_no = fav.dishes.indexOf(req.params.dishId);
            if (index_no !== -1) {
                fav.dishes.splice(index_no);
                fav.save()
                    .then(fav => res.json(fav))
                    .catch(err => next(err));
            } else {
                let err = new Error('item not in favourites list');
                err.status = 400;
                return next(err);
            }
        })
        .catch(err => next(err));
})

module.exports = router;
