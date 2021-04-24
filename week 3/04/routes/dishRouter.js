const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const Dish = require('../models/Dish');

const router = express.Router();

router.use(bodyParser.json());


router.get('/', (req, res) => {
    Dish.find()
        .sort('-updatedAt')
        .populate('comments.author', ['username', 'firstName', 'lastName'])
        .then(dishes => {
            if (dishes)
                res.json(dishes);
            else
                res.status(404).json({err: 'No dishes'});
        })
        .catch(err => console.log('error in getting dishes: ' + err));
});


router.post('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.create(req.body)
        .then(dish => {
            if (dish)
                res.json(dish);
            else
                res.status(400).json({err: 'faulty process'});
        })
        .catch(err => next(err));
})

router.put('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    let err = new Error('PUT operation not supported on /dishes');
    err.status = 400;
    next(err);
});

router.delete('/', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.remove()
        .then(resp => res.json(resp))
        .catch(err => next(err));
})


router.get('/:dishId', (req, res, next) => {
    Dish.findById(req.params.dishId)
        .sort("-updatedAt")
        .populate('comments.author', ['username', 'firstName', 'lastName'])
        .then(dish => {
            if (dish)
                res.json({dish: dish});
            else {
                const err = new Error('dish does not exists');
                err.status = 404;
                next(err);
            }
        })
        .catch(err => next({message: 'error in finding dish: ' + err}));
});


router.post('/:dishId', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    let err = new Error('POST operation not supported on /dishes/' + req.params.dishId);
    err.status = 400;
    next(err);
})

router.put('/:dishId', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.findByIdAndUpdate(
        req.params.dishId,
        {$set: req.body},
        {new: true}
    )
        .then(dish => {
            if (dish)
                res.json({updatedDish: dish});
            else {
                let err = new Error("Dish not found");
                err.status = 400;
                next(err);
            }
        })
        .catch(err => next(err));
})

router.delete('/:dishId', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.findByIdAndDelete(req.params.dishId)
        .then(resp => {
            res.json(resp);
        })
        .catch(err => next(err));
})


router.get('/:dishId/comments', (req, res, next) => {
    Dish.findById(req.params.dishId)
        .sort("-updatedAt")
        .populate('comments.author', ['username', 'firstName', 'lastName'])
        .then(dish => {
            res.json(dish.comments);
        })
        .catch(err => next(err));
})

router.post('/:dishId/comments', authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            req.body.author = req.user.id;
            dish.comments.unshift(req.body);    // pushes item at start
            // dish.comments.push(req.body);    // pushes item at end
            dish.save()
                .then(dish => {
                    Dish.findById(dish._id)
                        .sort("-dish.comments.updatedAt")
                        .populate('comments.author', ['username', 'firstName', 'lastName'])
                        .then(dish => res.json(dish.comments))
                        .catch(err => next(err));
                })
                .catch(err => next(err));
        })
        .catch(err => next(err));
})


router.delete('/:dishId/comments', authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            dish.comments = [];
            dish.save()
                .then(dish => res.json(dish))
                .catch(err => next(err));
        })
        .catch(err => next(err));
})


router.get('/:dishId/comments/:commentId', (req, res, next) => {
    Dish.findById(req.params.dishId)
        .sort("-updatedAt")
        .populate('comments.author', ['username', 'firstName', 'lastName'])
        .then(dish => {
            if (dish.comments.id(req.params.commentId) != null)
                res.json(dish.comments.id(req.params.commentId));
            else {
                let err = new Error('Comment does not exists');
                err.status = 400;
                next(err);
            }
        })
        .catch(err => next(err));
})


router.put('/:dishId/comments/:commentId', authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            if (dish){
                const dishComment = dish.comments.id(req.params.commentId);

                if (dish.comments != null && dishComment != null) {
                    if (req.user.id == dishComment.author) {
                        if (req.body.rating)
                            dishComment.rating = req.body.rating;
                        if (req.body.comment)
                            dishComment.comment = req.body.comment;

                        dish.save()
                            .then(dish => {
                                Dish.findById(dish._id)
                                    .populate('comments.author', ['username', 'firstName', 'lastName'])
                                    .then(dish => res.json(dish))
                                    .catch(err => next(err));

                            })
                            .catch(err => next(err));
                    }else{
                        let err = new Error('You are not authorized to perform this operation');
                        err.status = 403;
                        next(err);
                    }
                } else {
                    let err = new Error('Comment does not exists');
                    err.status = 400;
                    next(err);
                }
            }else{
                let err = new Error('Dish does not exists');
                err.status = 400;
                next(err);
            }
        })
        .catch(err => next(err));
})


router.delete('/:dishId/comments/:commentId', authenticate.verifyUser, (req, res, next) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            if (dish) {
                const dishComment = dish.comments.id(req.params.commentId);
                if (dish.comments != null && dishComment != null) {
                    if (req.user.id == dishComment.author) {
                        dish.comments.id(req.params.commentId).remove();
                        dish.save()
                            .then(dish => {
                                Dish.findById(dish._id)
                                    .populate('comments.author', ['username', 'firstName', 'lastName'])
                                    .then(dish => res.json(dish))
                                    .catch(err => next(err));
                            })
                            .catch(err => next(err));
                    } else {
                        let err = new Error('You are not authorized to perform this task');
                        err.status = 403;
                        next(err);
                    }
                } else {
                    let err = new Error('Comment does not exits');
                    err.status = 400;
                    next(err);
                }

            } else {
                let err = new Error('Dish does not exits');
                err.status = 400;
                next(err);
            }
        })
        .catch(err => next(err));
})


module.exports = router;
