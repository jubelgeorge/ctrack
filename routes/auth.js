const express = require('express');

const { signup, signin, signout, forgotPassword, resetPassword, socialLogin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const { userSignupValidator, userSigninValidator, passwordResetValidator } = require('../validator/validator');

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

// password forgot and reset routes
router.put("/forgot-password", forgotPassword);
router.put("/reset-password", passwordResetValidator(), resetPassword);

// then use this route for social login
router.post("/social-login", socialLogin); 

// any route containing :userId, our app will first execute userByID()
router.param('userId', userById);


module.exports = router;