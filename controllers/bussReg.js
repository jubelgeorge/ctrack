const jsforce = require('jsforce');

const {validationResult} = require('express-validator');

const BussReg = require('../models/bussReg');

exports.bussRegById = (req, res, next, id) => {
    bussReg.findById(id)
        .populate('doneBy', '_id name')
        //.populate('comments.postedBy', '_id name')
        //.populate('postedBy', '_id name role')
        //.select('_id title body created likes comments photo')
        .exec((err, bussReg) => {
            if (err || !bussReg) {
                return res.status(400).json({
                    error: err
                });
            }
            req.bussReg = bussReg;
            next();
        });
};

exports.getBussRegs = (req, res) => {
    const bussRegs = BussReg.find().select('-__v')    // if no __v needed
         .populate("doneBy", "_id name")
        // .populate("comments", "text created")
        // .populate("comments.bussRegedBy", "_id name")
        // .select("_id title body created likes")
        // .sort({ created: -1 })
        .then(bussRegs => {
            res.json(bussRegs);
        })
        .catch(err => console.log(err));
};

// @route    POST /bussreg/new/:userId
// @desc     Register new business
// @access   Private
exports.createBussReg = async (req,res,next) => {    
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        //const businessExists = await BussReg.findOne({ name: req.body.name, email: req.body.email });
        const businessExists = await BussReg.findOne(
            { 
                $or: [
                    {name: req.body.name},
                    { email: req.body.email}
                 ]
            }
        );
        if (businessExists) {
            return res.status(400).json({
                errors: [{msg: 'User already exists!'}]
            });
        }
        
        
        const newBussReg = new BussReg(req.body);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        newBussReg.doneBy = req.profile;

        const bussReg = await newBussReg.save();
        res.json(bussReg);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
    //   const newBussReg = new BussReg({
    //     name: req.profile.name,
    //     email: req.body.email,      
    //     user: req.profile.id,
    //     doneBy: req.profile
    //   });   
};

exports.bussRegsByUser = (req, res) => {
    console.log(req.profile);
       BussReg.find({ doneBy: req.profile._id })
        .populate('doneBy', '_id name')
        //.select('_id title body created likes')
        .sort('_created')
        .exec((err, bussRegs) => {
            if (err) {
                return res.status(400).json({
                    error: err
                });
            }
            res.json({bussRegs});
        });
};



