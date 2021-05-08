const { check, validationResult } = require('express-validator');

exports.createBussRegValidator = () => {
    return [
        // // name
        // check('name', 'Name is required').notEmpty(),
        // check('name', 'Name must be between 4 to 150 characters').isLength({
        //     min: 3,
        //     max: 20
        // }),
        // // email
        // check('email', 'Please include a valid email').isEmail()        
    ]    
};

exports.userSignupValidator = () => {
    return [
        // name
        check('name', 'Name is required').notEmpty(),
        check('name', 'Name must be between 4 to 150 characters').isLength({
            min: 3,
            max: 20
        }),
        // email
        check('email', 'Please include a valid email').isEmail(),
        // password
        check('password', 'Write a password').notEmpty(),
        check('password', 'Password must be between 4 to 2000 characters').isLength({
            min: 4,
            max: 15
        })
    ]
};

exports.userSigninValidator = () => {
    return [       
        // email
        check('email', 'Please include a valid email').isEmail(),
        // password
        check('password', 'Password is required').exists()
    ]
};
