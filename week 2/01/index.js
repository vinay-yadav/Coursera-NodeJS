const express = require('express')
const MongoClient = require('mongodb').MongoClient();
const assert = require('assert');

const mongoUrl = 'mongodb://localhost:27017/';
const dbName = 'conFusion';

MongoClient.connect(mongoUrl, (err, client) => {
    assert.equal(err, null);
    console.log('Connect to Mongo');

    const db = client.db(dbName);
    const collection = db.collection('dishes');

    collection.insert(
        {
        "name": "Burger",
        "description": "Two pans"
        },
        (err, result) => {
            assert.equal(err, null);

            console.log('insertion successful');

            console.log(result.ops);

            collection.find({}).toArray((err, docs) => {
                assert.equal(err, null);

                console.log("Data Found: ");

                docs.forEach(element => {
                    console.log(element);
                });

                // db.dropCollection('dishes', (err, result) => {
                //     assert(err, null);
                //     client.close();
                // })
            });
        }
    )
});