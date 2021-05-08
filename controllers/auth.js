const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

require('dotenv').config();

const {validationResult} = require('express-validator');
const User = require('../models/user');

// @route    POST signup/
// @desc     Register user
// @access   Public
exports.signup = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({
                errors: [{msg: 'User already exists!'}]
            });
        }

        const user = new User(req.body);
        await user.save();
        res.status(200).json({ user: user });         // or, res.status(200).json({ user });     
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }

};

// @route    POST signin/
// @desc     Signin user
// @access   Public
exports.signin = async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { password } = req.body;
    // find the user based on email
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // if user is found make sure the email and password match
        // create authenticate method in model and use here
        if (!user.authenticate(password)) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
        }

        // generate a token with user id and secret
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

        // persist the token as 't' in cookie with expiry date
        res.cookie('t', token, { expire: new Date() + 3600 });

        // return response with user and token to frontend client
        const { _id, name, email } = user;

        return res.json({ token, user: { _id, email, name } });
    } catch (err) {
          console.error(err.message);
          res.status(500).send('Server error');
      }
};

// @route    POST signout/
// @desc     Signout user
// @access   Public
exports.signout = (req, res) => {
    res.clearCookie('t');
    return res.json({ message: 'Signout success!' });
};

exports.requireSignin = expressJwt({
    //if the token is valid, express jwt appends the verified user's id in an auth key to the request object
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: 'auth'
  });