const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const connectDB = require('./config/db');

const app = express();

dotenv.config();

// Connect Database
connectDB();

// Define Routes
const bussRegRoutes = require('./routes/bussReg');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

// Init Middleware
app.use(morgan('dev'));
app.use(express.json({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.use('/', bussRegRoutes);         // Now this works as a middleware. Previously, we were handling the route request using 'app.get'. Now, we are using the Express router in the routes folder.
app.use('/', authRoutes);
app.use('/', userRoutes);

app.use(function(err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        res.status(401).json({ error: 'Unauthorized!' });
    }
});



const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));





/* ***************************************************************************** */
//const bussRegRoutes = require('./routes/bussReg');
//app.use('/', bussRegRoutes);         // Now this works as a middleware. Previously, we were handling the route request using 'app.get'. Now, we are using the Express router in the routes folder.
//So this way bussReg routes works as a middleware. So, any request we get here on the " '/' in app.use" will be passed to the bussReg routes and then the bussReg router will give it to the controller and this is how it works.