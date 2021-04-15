const rect = require('./rectangle');

function solveRect(length, breadth) {
    rect(length, breadth, (err, rectangle) => {
        if (err){
            console.log('Error: ' + err.message);
        }
        else{
            console.log('Perimeter ' + rectangle.perimeter());
            console.log('Area ' + rectangle.area());
        }
    });

    console.log('hello');
}


solveRect(20, 10);
solveRect(0, 10);