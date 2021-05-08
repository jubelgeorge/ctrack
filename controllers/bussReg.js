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
            res.json({bussRegs: bussRegs});
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

    /****************SALESFORCE***************/
    //jsForce connection
    const conn = new jsforce.Connection({
        oauth2 : {
        // you can change loginUrl to connect to sandbox or prerelease env.
        loginUrl : 'https://ibm-af-dev-ed.my.salesforce.com',
        clientId : '3MVG9VeAQy5y3BQWEZTsxqeLYmR7ujDLXZf6bRG3NOI3sGyIH95yGf7G5IbGtMU7y7rLQv93AOsnQhYJKifwl',
        clientSecret : 'A4EBB3132DEF60028C9F1F850CE569AC06A3BF2D05EA9AD7C739E36DC3643932',
        redirectUri : 'http://localhost:3000/token'
        }
    });
    conn.login('jacob@ctpoc.com', 'ctrack@2020uwLc9nyrwun6ISAXuqdAZoXng', function(error, result) {
        if (error) { return console.error(error); }
            
        // Now you can get the access token and instance URL information.
        // Save them to establish connection next time.
        console.log(conn.accessToken);
        console.log(conn.instanceUrl);
        
        const body2 = { businessname: req.body.name, email : req.body.email};
        conn.apex.post("/CTRACKBusinessWebService/", body2, function(error, result) {
            if (error) { return console.error(error); }
            console.log("response: ", result);
        });
    });
    /****************************************/

    try {
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



