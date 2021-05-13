const express = require('express');

const {getBussRegs,createBussReg, bussRegsByUser, bussRegById, isBussRegister, deleteBussReg} = require('../controllers/bussReg');
const { requireSignin } = require('../controllers/auth');
const { userById } = require('../controllers/user');
const {createBussRegValidator} = require('../validator/validator');       // Same as const validator = require('../validator/validator');

const router = express.Router();      // Now this entire routes file can be used as a middleware into our application


router.get('/bussregs', getBussRegs);

// @route    POST /bussreg/new/:userId
// @desc     Register new business
// @access   Private
router.post('/bussreg/new/:userId', requireSignin, createBussRegValidator(), createBussReg);

router.get('/bussregs/by/:userId',  bussRegsByUser);

// any route containing :userId, our app will first execute userByID()
router.param('userId', userById);

// any route containing :bussRegId, our app will first execute userByID()
router.param('bussRegId', bussRegById);



module.exports = router;

