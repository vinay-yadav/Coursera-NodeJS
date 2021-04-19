const express = require('express');
const mongoose = require('mongoose');

const app = express();

const Dish = require('./models/Dish');

const connect = mongoose.connect('mongodb://localhost:27017/conFusion');

connect
    .then((db) => {
        console.log('db connected')

        // let newDish = Dish({
        //     name: "Teryali",
        //     description: "A Japanese cuisine"
        // });

        // newDish.save()
        //     .then(dish => {
        //         console.log(dish);
        //         mongoose.connection.close();
        //     })
        //     .catch(err => console.log('error in saving dish'));

        Dish.create({
            name: "Aloo Parantha",
            description: "Breakfast"
        })
            .then(dish => {
                console.log(dish);
                return Dish.findByIdAndUpdate(
                    dish._id,
                    {
                        $set: {description: "Updated Yum Breakfast"},
                        
                    },
                    {
                        new: true
                    }
                )
            })
            .then(dish => {
                console.log(dish);

                dish.comments.push({
                    rating: 5,
                    comment: "Super",
                    auther: "Vinay Yadav"
                })

                return dish.save();
            })
            .then(dish => {
                console.log(dish);

                mongoose.connection.close();
            })
            .catch(err => console.log('error in saving dish ' + err));
    
    })
    .catch(err => console.log('error in mongo connection'));