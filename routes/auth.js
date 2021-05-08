const express = require('express');

const { signup, signin, signout } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { userSignupValidator, userSigninValidator } = require('../validator/validator');

const router = express.Router();


// @route    POST signup/
// @desc     Register user
// @access   Public
router.post('/signup', userSignupValidator(), signup);

// @route    POST signin/
// @desc     Signin user
// @access   Public
router.post('/signin',userSigninValidator(), signin);

// @route    POST signout/
// @desc     Signout user
// @access   Public
router.get('/signout', signout);

// any route containing :userId, our app will first execute userByID()
router.param('userId', userById);


module.exports = router;