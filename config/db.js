//Mongodb connection
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config();

const db = process.env.MONGO_URI;    // '.get' used to get something from default.json' .

const connectDB = async () => {
	try {
		await mongoose.connect(db, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
		});

		console.log('MongoDB Connected...');
	} catch (err) {
		console.error(err.message);
		// Exit process with failure
		process.exit(1);
	}
};

module.exports = connectDB;