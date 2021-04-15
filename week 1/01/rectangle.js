module.exports = (x, y, callback) => {
    if (x <= 0 || y <= 0){
        setTimeout(() => callback(
                new Error('Solution zero with 0 value parameter'),
                null
            ),
            5000
        );
    }else{
        setTimeout(() => callback(
                null,
                {
                    perimeter: () => (2 * (x + y)),
                    area: () => (x + y)
                }
            ),
            5000
        );
    }
}
