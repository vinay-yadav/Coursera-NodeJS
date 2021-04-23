const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');

const router = express.Router();

const Dish = require('../models/Dish');

router.use(bodyParser.json());

// URL : /
// router.all('/', (req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'application/json');
//     next();
// });

router.get('/', (req, res) => {
    Dish.find()
        .sort('-createdAt')
        .then(dishes => {
            if(dishes)
                res.json(dishes);
            else
                res.status(404).json({err: 'No dishes'});
        })
        .catch(err => console.log('error in getting dishes: ' + err));
});


router.post('/', authenticate.verifyUser, (req, res) => {
    Dish.create(req.body)
        .then(dish => {
            if(dish)
                res.json(dish);
            else
                res.status(400).json({err: 'faulty process'});
        })
        .catch(err => console.log('error in creating dish: ' + err));
})

router.put('/', authenticate.verifyUser, (req, res) => {
    res.status(403).json({err: 'PUT operation not supported on /dishes'});
});

router.delete('/', authenticate.verifyUser, (req, res) => {
    res.json({success: 'Deleting all dishes'});
})

// URL: /:dishId
// router.all('/:dishId', (req, res, next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text');
//     next();
// });

router.get('/:dishId', (req, res) => {
    // res.end('Will send the details of the dish: ' + req.params.dishId + ' to you.');
    Dish.findById(req.params.dishId)
        .then(dish => {
            if(dish)
                res.json({dish: dish});
            else
                res.status(404).json({err: 'dish not found'});
        })
        .catch(err => console.log('error in getting dish: ' + err));
});


router.post('/:dishId', authenticate.verifyUser, (req, res) => {
    res.status(403).json({err: 'POST operation not supported on /dishes/'+ req.params.dishId});
})

router.put('/:dishId', authenticate.verifyUser, (req, res) => {
    Dish.findByIdAndUpdate(
        req.params.dishId,
        {$set: req.body},
        {new: true}
    )
        .then(dish => {
            if(dish)
                res.json({updatedDish: dish});
            else
                res.status(404).json({err: "Dish not found"})
        })
        .catch(err => console.log('error in updating dish: ' + err));
})

router.delete('/:dishId', authenticate.verifyUser, (req, res) => {
    Dish.findByIdAndDelete(req.params.dishId)
        .then(resp => {
            res.json(resp);
        })
        .catch(err => console.log('error in deleting a dish: ' + err));
})


router.get('/:dishId/comments', (req, res) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            res.json(dish.comments);
        })
        .catch(err => res.status(400).json({err: `error in getting dish: ${err}`}))
})

router.post('/:dishId/comments', authenticate.verifyUser, (req, res) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            dish.comments.push(req.body);
            dish.save()
                .then(dish => res.json(dish.comments))
                .catch(err => res.status(400).json({err: `error in saving comment: ${err}`}))
        })
        .catch(err => res.status(400).json({err: `error in getting dish: ${err}`}))
})


router.delete('/:dishId/comments', authenticate.verifyUser, (req, res) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            dish.comments = [];
            dish.save()
                .then(dish => res.json(dish))
                .catch(err => res.status(400).json({err: `error in saving comment: ${err}`}))
        })
        .catch(err => res.status(400).json({err: `error in getting dish: ${err}`}))
})


router.get('/:dishId/comments/:commentId', (req, res) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            if(dish.comments.id(req.params.commentId) != null)
                res.json(dish.comments.id(req.params.commentId));
            else
                res.json('comment does not exists');
        })
        .catch(err => res.status(400).json({err: `error in getting dish: ${err}`}))
})


router.put('/:dishId/comments/:commentId', authenticate.verifyUser, (req, res) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            if(dish.comments.id(req.params.commentId) != null){
                if(req.body.rating)
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                if(req.body.comment)
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                
                dish.save()
                    .then(dish => res.json(dish))
                    .catch(err => res.json('error in updating comment'));
            }
            else
                res.json('comment does not exists');
        })
        .catch(err => res.status(400).json({err: `error in getting dish: ${err}`}))
})


router.delete('/:dishId/comments/:commentId', authenticate.verifyUser, (req, res) => {
    Dish.findById(req.params.dishId)
        .then(dish => {
            if(dish.comments != null && dish.comments.id(req.params.commentId) != null){
                dish.comments.id(req.params.commentId).remove();
                dish.save()
                    .then(dish => {
                        res.json(dish);
                    })
                    .catch(err => res.json('error in deleting comment'));
            }
            else{
                res.json('comment does not exists')
            }
        })
        .catch(err => res.status(400).json({err: `error in getting dish: ${err}`}))
})


module.exports = router;
